import {
  AlertIOS,
  AsyncStorage,
  NetInfo
} from 'react-native';

const RNFS = require('react-native-fs'); //for access to file system -- (https://github.com/johanneslumpe/react-native-fs)
const strings = require('./LocalizedStrings');


const SCHEMA_VERSION = "3";
const HOST_PATH = "https://readonly.sefaria.org/static/ios-export/" + SCHEMA_VERSION + "/";
//const HOST_PATH = "file:///Users/nss/Documents/Sefaria-Export/ios/" + SCHEMA_VERSION + "/";

var Downloader = {
  _data: {
    shouldDownload: false,  // Whether or not to download books at all or just stick to API mode
    downloadPaused: false,  // Whether or not the download process has been temporarily paused
    lastDownload: {},       // Map book titles to timestamp of their last downloaded version or null
    availableDownloads: {}, // Server provided map of titles to ther timestamp of their last update available
    updateComment: "",      // Current update comment. Generally a short note on what's new
    downloadQueue: [],      // Ordered list of title to download
    downloadInProgress: [], // List of titles currently downloading
    lastUpdateCheck: null,  // Timestamp of last download of updates list
    lastUpdateSchema: null, // Schema Version of  last update check
    debugNoLibrary: false   // True if you want to disable library access even if it's downloaded for debugging purposes
  },
  downloading: false,     // Whether the download is currently active, not stored in _data because we never want to persist value
  onChange: null, // Handler set above called when books in the Library finish downloading, or download mode changes.
  init: function() {
    return this._loadData()
            .then(function() {
              //console.log("Downloader init with data:")
              //console.log(Downloader._data);
              //console.log(Downloader.titlesAvailable().length + " titles available");
              //console.log(Downloader.titlesDownloaded().length + " titles downloaded");
              //console.log("Updates:" , Downloader.updatesAvailable());
              Downloader.checkForUpdatesIfNeeded();
              if (!Downloader._data.downloadPaused) {
                Downloader.resumeDownload();
              }
            });
  },
  downloadLibrary: function() {
    RNFS.mkdir(RNFS.DocumentDirectoryPath + "/library");
    RNFS.mkdir(RNFS.DocumentDirectoryPath + "/tmp");
    Downloader._setData("shouldDownload", true);
    Downloader.downloadUpdatesList()
      .then(() => {
        Downloader._updateDownloadQueue();
        Downloader._downloadNext();
     });
    Downloader.downloading = true;
    Downloader.onChange && Downloader.onChange();
    AlertIOS.alert(
      strings.libraryDownloading,
      strings.libraryDownloadingMessage,
      [{text: strings.ok}]
    );
    Sefaria.track.event("Downloader", "Download Library");
  },
  deleteLibrary: function() {
    AlertIOS.alert(
      strings.deleteLibrary,
      strings.confirmDeleteLibraryMessage,
      [
        {text: strings.cancel, style: 'cancel'},
        {text: strings.delete, style: 'destructive', onPress: () => {
          RNFS.unlink(RNFS.DocumentDirectoryPath + "/library");
          RNFS.unlink(RNFS.DocumentDirectoryPath + "/tmp");
          Downloader._setData("lastDownload", {});
          Downloader._setData("shouldDownload", false);
          Downloader.clearQueue();
          Downloader.onChange && Downloader.onChange();
          Sefaria.track.event("Downloader", "Delete Library");
        }}
      ]);
  },
  resumeDownload: function() {
    // Resumes the download process if anything is left in progress or in queue.
    // if titles where left in progress, put them back in the queue
    RNFS.unlink(RNFS.DocumentDirectoryPath + "/tmp");
    RNFS.mkdir(RNFS.DocumentDirectoryPath + "/tmp");
    Downloader._setData("downloadPaused", false);
    if (Downloader._data.downloadInProgress.length) {
      Downloader._setData("downloadQueue", Downloader._data.downloadQueue.concat(Downloader._data.downloadInProgress));
      Downloader._setData("downloadInProgress", []);
    }
    // Resume working through queue
    if (Downloader._data.shouldDownload) {
      Downloader.downloading = true;
      Downloader._downloadNext();
      Downloader.onChange && Downloader.onChange();
    }
  },
  downloadUpdatesList: function() {
    // Downloads the "last_update.json", stores it in _data.availableDownloads
    // and adds any new items to _data.lastDownload with a null value indicating they've never been downlaoded
    // Also downloads latest "toc.json"
    var lastUpdatePromise = fetch(HOST_PATH + "last_updated.json", {headers: {'Cache-Control': 'no-cache'}})
      .then((response) => response.json())
      .then((data) => {
        // Add titles to lastDownload list if they haven't been seen before
        var titles;
        if (!!data.titles) {
          titles = data.titles;
        } else {
          titles = data; //NOTE backwards compatibility
        }
        Downloader._setData("availableDownloads", titles);
        if (data.comment) {
          Downloader._setData("updateComment", data.comment);
        }
        for (var title in titles) {
          if (titles.hasOwnProperty(title) && !(title in Downloader._data.lastDownload)) {
            Downloader._data.lastDownload[title] = null;
          }
        }
        Downloader._setData("lastDownload", Downloader._data.lastDownload);
      });
    var tocPromise = RNFS.downloadFile({
      fromUrl: HOST_PATH + "toc.json",
      toFile: RNFS.DocumentDirectoryPath + "/library/toc.json",
      background: true,
    }).promise.then(() => {
      Sefaria._loadTOC();
    });
    var hebCatPromise = RNFS.downloadFile({
      fromUrl: HOST_PATH + "hebrew_categories.json",
      toFile: RNFS.DocumentDirectoryPath + "/library/hebrew_categories.json",
      background: true,
    }).promise.then(() => {
      Sefaria._loadHebrewCategories();
    });
    return Promise.all([lastUpdatePromise, tocPromise, hebCatPromise]).then(() => {
      var timestamp = new Date().toJSON();
      Downloader._setData("lastUpdateCheck", timestamp)
      Downloader._setData("lastUpdateSchema", SCHEMA_VERSION)
      Downloader.onChange && Downloader.onChange();
    });
  },
  downloadUpdates: function() {
    // Starts download of any known updates
    Downloader._updateDownloadQueue();
    Downloader.resumeDownload();
  },
  clearQueue: function() {
    Downloader._setData("downloadQueue", []);
    Downloader._setData("downloadInProgress", []);
  },
  checkForUpdates: function(confirmUpToDate = true) {
    // Downloads the most recent update list then prompts to download updates
    // or notifies the user that the library is up to date.
    Downloader.clearQueue();
    Downloader.downloadUpdatesList().then(() => {
      var updates = Downloader.updatesAvailable();
      if (updates.length) {
        Downloader._updateDownloadQueue();
        Downloader.promptLibraryUpdate();
      } else if (confirmUpToDate) {
        AlertIOS.alert(
          strings.libraryUpToDate,
          strings.libraryUpToDateMessage,
          [
            {text: strings.ok},
          ]);
      }
    });
  },
  checkForUpdatesIfNeeded: function() {
    // Downloads the most recent update list if enough time has passed since previous check.
    // If not updates are available, prompts for to download.
    if (Downloader._data.shouldDownload && Downloader._isUpdateCheckNeeded()) {

      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
          this.checkForUpdates(false);
        };
      });
    }
  },
  prioritizeDownload: function(title) {
    // Moves `title` to the front of the downloadQueue if it's there
    var i = this._data.downloadQueue.indexOf(title);
    if (i > -1) {
        this._data.downloadQueue.splice(i, 1);
        this._setData("downloadQueue", [title].concat(this._data.downloadQueue));
    }
  },
  titlesAvailable: function() {
    // Returns a list of titles that are available for download
    var available = [];
    for (var title in this._data.availableDownloads) {
      if (this._data.availableDownloads.hasOwnProperty(title)) {
        available.push(title)
      }
    }
    return available;
  },
  titlesDownloaded: function() {
    // Returns a list of titles that have been downloaded
    var downloaded = [];
    for (var title in this._data.lastDownload) {
      if (this._data.lastDownload.hasOwnProperty(title)
          && this._data.lastDownload[title] !== null) {
        downloaded.push(title)
      }
    }
    return downloaded;
  },
  updatesAvailable: function() {
    // Returns a list of titles that have updates available to download
    var updates = [];
    for (var title in this._data.availableDownloads) {
      if (this._data.availableDownloads.hasOwnProperty(title) &&
          this._data.availableDownloads[title] !== this._data.lastDownload[title]) {
            updates.push(title);
      }
    }
    return updates;
  },
  updateComment: function() {
    //Returns list of update comments, oldest first
    return this._data.updateComment;
  },
  promptLibraryDownload: function() {
    // If it hasn't been done already, prompt the user to download the library.
    AsyncStorage.getItem("libraryDownloadPrompted")
      .then((prompted) => {
        if (!prompted) {
          var onDownload = function() {
            AsyncStorage.setItem("libraryDownloadPrompted", "true");
            Downloader.downloadLibrary();
            Sefaria.track.event("Downloader", "Initial Download Prompt", "accept");
          };
          var onCancel = function() {
            AsyncStorage.setItem("libraryDownloadPrompted", "true");
            AlertIOS.alert(
              strings.usingOnlineLibrary,
              strings.howToDownloadLibraryMessage,
              [
                {text: strings.ok},
              ]);
            Sefaria.track.event("Downloader", "Initial Download Prompt", "decline");
          };
          AlertIOS.alert(
            strings.welcome,
            strings.downloadLibraryRecommendedMessage,
            [
              {text: strings.download, onPress: onDownload},
              {text: strings.notNow, onPress: onCancel}
            ]);
        }
      });
  },
  promptLibraryUpdate: function() {
    var updates = Downloader.updatesAvailable();
    var updateComment = Downloader.updateComment();
    var updateFullString = updates.length + " " + strings.updatesAvailableMessage;
    if (updateComment.length > 0) {
      updateFullString += ". " + updateComment;
    }

    if (updates.length == 0) { return; }

    var onDownload = function() {
      Downloader.downloadUpdates();
      Sefaria.track.event("Downloader", "Update Prompt", "accept");
    };

    var onCancel = function() {
      AlertIOS.alert(
        strings.updateLater,
        strings.howToUpdateLibraryMessage,
        [
          {text: strings.ok},
        ]);
      Downloader._setData("downloadPaused", true);
      Sefaria.track.event("Downloader", "Update Prompt", "decline");
    };
    AlertIOS.alert(
      strings.updateLibrary,
      updateFullString,
      [
        {text: strings.download, onPress: onDownload},
        {text: strings.notNow, onPress: onCancel}
      ]);
  },
  _updateDownloadQueue: function() {
    // Examines availableDownloads and adds any title to the downloadQueue that has a newer download available
    // and is not already in queue.
    // Removes anything from downloadQueue that is not in the list of availableDownloads
    this._data.downloadQueue = this._data.downloadQueue.filter((title) => {
      return title in this._data.availableDownloads;
    });
    var updates = this.updatesAvailable();
    for (var i = 0; i < updates.length; i++) {
      var title = updates[i];
      if (this._data.downloadQueue.indexOf(title) == -1) {
        this._data.downloadQueue.push(title);
      }
    }
    this._setData("downloadQueue", this._data.downloadQueue);
  },
  _downloadNext: function() {
    // Starts download of the next item of the queue, and continues doing so after successful completion.
    if (!this._data.downloadQueue.length || Downloader._data.downloadPaused) {
      this.downloading = false;
      Downloader.onChange && Downloader.onChange();
      return;
    }
    var nextTitle = this._data.downloadQueue[0];
    this._downloadZip(nextTitle)
      .then(() => { Downloader._downloadNext(); })
      .catch(this._handleDownloadError);
  },
  _handleDownloadError: function(error) {
    console.log("Download error: ", error);
    Downloader.downloading = false;
    var cancelAlert = function() {
      Downloader._setData("downloadPaused", true);
      AlertIOS.alert(
        strings.downloadPaused,
        strings.howToResumeDownloadMessage,
        [
          {text: strings.ok},
        ]);
      Downloader.onChange && Downloader.onChange();
    };
    AlertIOS.alert(
      strings.downloadError,
      strings.downloadErrorMessage,
      [
        {text: strings.tryAgain, onPress: () => { Downloader.resumeDownload(); }},
        {text: strings.pause, onPress: cancelAlert}
      ]);
    Sefaria.track.event("Downloader", "Download Error", error);
  },
  _downloadZip: function(title) {
    // Downloads `title`, first to /tmp then to /library when complete.
    // Manages `title`'s presense in downloadQueue and downloadInProgress.
    var tempFile = RNFS.DocumentDirectoryPath + "/tmp/" + title + ".zip";
    var toFile   = RNFS.DocumentDirectoryPath + "/library/" + title + ".zip"
    var start = new Date();
    //console.log("Starting download of " + title);
    this._removeFromDowloadQueue(title);
    this._setData("downloadInProgress", [title].concat(this._data.downloadInProgress));
    return new Promise(function(resolve, reject) {
      RNFS.exists(toFile).then((exists) => {
        if (exists) { RNFS.unlink(toFile); }
      });
      RNFS.downloadFile({
        fromUrl: HOST_PATH + encodeURIComponent(title) + ".zip",
        toFile: tempFile
      }).promise.then(function(downloadResult) {
        if (downloadResult.statusCode == 200) {
          //console.log("Downloaded " + title + " in " + (new Date() - start));
          RNFS.moveFile(tempFile, toFile);
          Downloader._removeFromInProgress(title);
          Downloader._data.lastDownload[title] = Downloader._data.availableDownloads[title];
          Downloader._setData("lastDownload", Downloader._data.lastDownload);
          Downloader.onChange && Downloader.onChange();
          resolve();
        } else {
          reject(downloadResult.statusCode + " - " + title);
          RNFS.unlink(tempFile);
        }
      })
    });
  },
  _removeFromDowloadQueue: function(title) {
    var i = this._data.downloadQueue.indexOf(title);
    if (i > -1) {
        this._data.downloadQueue.splice(i, 1);
        this._setData("downloadQueue", this._data.downloadQueue);
    }
  },
  _removeFromInProgress: function(title) {
    var i = this._data.downloadInProgress.indexOf(title);
    if (i > -1) {
        this._data.downloadInProgress.splice(i, 1);
        this._setData("downloadInProgress", this._data.downloadInProgress);
    }
  },
  _isUpdateCheckNeeded: function() {
    // Returns true if enough time has passed since the last check for updates
    if (!this._data.lastUpdateCheck) { return true; }
    var cutoff = new Date(this._data.lastUpdateCheck);
    cutoff.setDate(cutoff.getDate() + 7) // One week;
    var now = new Date();
    return now > cutoff;
  },
  _loadData: function() {
    // Loads data from each field in `_data` stored in Async storage into local memory for sync access.
    // Returns a Promise that resolves when all fields are loaded.
    var promises = [];
    for (var field in this._data) {
      if (this._data.hasOwnProperty(field)) {
        var loader = function(field, value) {
          if (!value) { return; }
          Downloader._data[field] = JSON.parse(value);
        }.bind(null, field);
        var promise = AsyncStorage.getItem(field)
          .then(loader)
          .catch(function(error) {
            console.error("AsyncStorage failed to load libraryData: " + error);
          });;
        promises.push(promise);
      }
    }
    return Promise.all(promises);
  },
  _setData: function(field, value) {
    // Sets `_data[field]` to `value` in local memory and saves it to Async storage
    this._data[field] = value;
    AsyncStorage.setItem(field, JSON.stringify(value));
  },
};


module.exports = Downloader;
