'use strict';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import HTMLView from 'react-native-htmlview';
const Orientation    = require('react-native-orientation');
const styles         = require('./Styles');
const strings        = require('./LocalizedStrings');
const TextListHeader = require('./TextListHeader');
const LinkFilter     = require('./LinkFilter');

const {
  CategoryColorLine,
  TwoBox,
  LoadingView,
} = require('./Misc.js');

const DEFAULT_LINK_CONTENT = {en: "Loading...", he: "טוען...", sectionRef: ""};

class TextList extends React.Component {
  static propTypes = {
    settings:        PropTypes.object,
    openRef:         PropTypes.func.isRequired,
    openCat:         PropTypes.func.isRequired,
    closeCat:        PropTypes.func.isRequired,
    updateCat:       PropTypes.func.isRequired,
    linkSummary:     PropTypes.array,
    linkContents:    PropTypes.array,
    loading:         PropTypes.bool,
    segmentIndexRef: PropTypes.number,
    filterIndex:     PropTypes.number,
    recentFilters:   PropTypes.array, /* of the form [{title,heTitle,refList}...] */
    textLanguage:    PropTypes.oneOf(["english","hebrew","bilingual"]),
    onDragStart:     PropTypes.func.isRequired,
    onDragMove:      PropTypes.func.isRequired,
    onDragEnd:       PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    Sefaria = props.Sefaria; //Is this bad practice to use getInitialState() as an init function
    const {height, width} = Dimensions.get('window');
    const dataSource = this.generateDataSource(props);

    this.state = {
      dataSource,
      isNewSegment: false,
      width: width,
      height: height,
    };
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    Orientation.getOrientation(this._verifyDimensions);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.segmentIndexRef !== nextProps.segmentIndexRef) {
      this.setState({isNewSegment:true});
    } else if (this.props.recentFilters !== nextProps.recentFilters ||
               this.props.filterIndex !== nextProps.filterIndex ||
               this.props.linkContents !== nextProps.linkContents) {
      this.setState({dataSource: this.generateDataSource(nextProps)});
    }
  }

  componentDidUpdate() {
    if (this.state.isNewSegment)
      this.setState({isNewSegment:false});
  }

  generateDataSource = (props) => {
    const linkFilter = props.recentFilters[props.filterIndex];
    if (!linkFilter) {
      return [];
    }
    const isCommentaryBook = linkFilter.category === "Commentary" && linkFilter.title !== "Commentary"
    return linkFilter.refList.map((linkRef, index) => {
      const key = `${props.segmentIndexRef}|${linkRef}`;
      const loading = props.linkContents[index] == null;
      return {
        key,
        ref: linkRef,
        //changeString: [linkRef, loading, props.settings.fontSize, props.textLanguage].join("|"),
        pos: index,
        isCommentaryBook: isCommentaryBook,
        content: props.linkContents[index],
      };
    });
  };

  _orientationDidChange = (orientation) => {
    this.setState({
      width: this.state.height,
      height: this.state.width
    })
  };

  _verifyDimensions = (err, orientation) => {
    // Dimensions seems to often swap height/width. This checks them against the orientation and swaps them if they're wrong.
    var {height, width} = Dimensions.get('window');
    //console.log(orientation, "h: ",height,"w: ",width);
    if ((width > height && orientation !== "LANDSCAPE") ||
        (width < height && orientation == "LANDSCAPE")) {
      [height, width] = [width, height];
    }
    //console.log(orientation, "h: ",height,"w: ",width);
    this.setState({height: height, width: width});
  };

  renderItem = ({ item }) => {
    const loading = item.content == null;
    const linkContentObj = loading ? DEFAULT_LINK_CONTENT : item.content;
    return (<LinkContent
              theme={this.props.theme}
              settings={this.props.settings}
              openRef={this.props.openRef}
              refStr={item.ref}
              linkContentObj={linkContentObj}
              textLanguage={this.props.textLanguage}
              loading={loading}
              isCommentaryBook={item.isCommentaryBook}
    />);
  };

  onViewableItemsChanged = ({viewableItems, changed}) => {
    for (let item of viewableItems) {
      if (item.item.content === null) {
        this.props.loadLinkContent(item.item.ref, item.item.pos);
      }
    }
  };

  render() {
    var isSummaryMode = this.props.filterIndex == null;
    if (isSummaryMode) {

      var viewList = [];
      this.props.linkSummary.map((cat)=>{
        let heCategory = Sefaria.hebrewCategory(this.props.category);
        let filter = new LinkFilter(cat.category, heCategory, cat.category, heCategory, cat.refList,cat.category);

        var innerViewList = cat.books.map((obook)=>{
          let filter = new LinkFilter(obook.title, obook.heTitle, obook.collectiveTitle, obook.heCollectiveTitle, obook.refList, cat.category);
          return (
          <LinkBook
            theme={this.props.theme}
            title={obook.collectiveTitle ? obook.collectiveTitle : obook.title} //NOTE backwards compatibility
            heTitle={obook.heCollectiveTitle ? obook.heCollectiveTitle : obook.heTitle}
            count={obook.count}
            language={this.props.settings.language}
            onPress={function(filter,title) {
              this.props.openCat(filter);
              Sefaria.track.event("Reader","Text Filter Click",title);
            }.bind(this,filter,obook.title)}
            key={obook.title} />);
        });

        viewList.push(
          <View style={styles.textListSummarySection} key={cat.category+"-container"}>
            <LinkCategory
              theme={this.props.theme}
              category={cat.category}
              refList={cat.refList}
              count={cat.count}
              language={this.props.settings.language}
              onPress={function(filter,category) {
                this.props.openCat(filter);
                Sefaria.track.event("Reader","Category Filter Click",category);
              }.bind(this,filter,cat.category)}
              key={cat.category} />
            <TwoBox content={innerViewList} />
          </View>);

      });
      if (viewList.length == 0) { viewList = <EmptyLinksMessage theme={this.props.theme} />; }
    }

    var textListHeader = (
      <View
        onStartShouldSetResponder={(evt)=>this.props.onDragStart(evt)}
        onResponderMove={(evt)=>this.props.onDragMove(evt)}
        onResponderRelease={(evt)=>this.props.onDragEnd(evt)}>

        <TextListHeader
          Sefaria={Sefaria}
          theme={this.props.theme}
          themeStr={this.props.themeStr}
          updateCat={this.props.updateCat}
          closeCat={this.props.closeCat}
          category={isSummaryMode ? null : this.props.recentFilters[this.props.filterIndex].category}
          filterIndex={this.props.filterIndex}
          recentFilters={this.props.recentFilters}
          language={this.props.settings.language}
          isSummaryMode={isSummaryMode} />
      </View>
    );

    if (isSummaryMode) {
      var content = this.props.loading ?
                      <LoadingView /> :
                      <ScrollView style={styles.textListSummaryScrollView}>{viewList}</ScrollView>;
      return (
        <View style={[styles.textListSummary, this.props.theme.textListSummary]}>
          {textListHeader}
          {content}
        </View>);

    } else if (!this.state.isNewSegment) {
      // Using Dimensions to adjust marings on text at maximum line width because I can't figure out
      // how to get flex to center a component with maximum width without allows breaking the stretch
      // behavior of its contents, result in rows in the list view with small width if their content is small.
      var marginAdjust = this.state.width > 800 ? (this.state.width-800)/2 : 0
      var listViewStyles = [styles.textListContentListView, {marginLeft: marginAdjust}];
      return (
      <View style={[styles.textListContentOuter, this.props.theme.textListContentOuter]}>
        {textListHeader}
        {this.props.linkContents.length == 0 ?
          <View style={styles.noLinks}><EmptyLinksMessage theme={this.props.theme} /></View> :
          <FlatList style={listViewStyles}
            data={this.state.dataSource}
            renderItem={this.renderItem}
            getItemLayout={this.getItemLayout}
            contentContainerStyle={{justifyContent: "center"}}
            onViewableItemsChanged={this.onViewableItemsChanged}
          />
        }
      </View>
      );
    } else {
      return null;
    }
  }
}

class LinkCategory extends React.Component {
  static propTypes = {
    theme:    PropTypes.object.isRequired,
    onPress:  PropTypes.func.isRequired,
    category: PropTypes.string,
    language: PropTypes.string,
    count:    PropTypes.number
  };

  render() {
    let countStr = " | " + this.props.count;
    let style = {"borderColor": Sefaria.palette.categoryColor(this.props.category)};
    let heCategory = Sefaria.hebrewCategory(this.props.category);
    let content = this.props.language == "hebrew"?
      (<Text style={[styles.hebrewText, this.props.theme.text]}>{heCategory + countStr}</Text>) :
      (<Text style={[styles.englishText, this.props.theme.text]}>{this.props.category.toUpperCase() + countStr}</Text>);

    return (<TouchableOpacity
              style={[styles.readerNavCategory, this.props.theme.readerNavCategory, style]}
              onPress={this.props.onPress}>
              {content}
            </TouchableOpacity>);
  }
}

class LinkBook extends React.Component {
  static propTypes = {
    theme:    PropTypes.object.isRequired,
    onPress:  PropTypes.func.isRequired,
    title:    PropTypes.string,
    heTitle:  PropTypes.string,
    language: PropTypes.string,
    count:    PropTypes.number
  };

  render() {
    let countStr = this.props.count == 0 ? "" : " (" + this.props.count + ")";
    let textStyle = this.props.count == 0 ? this.props.theme.verseNumber : this.props.theme.text;
    return (
      <TouchableOpacity
        style={[styles.textBlockLink, this.props.theme.textBlockLink]}
        onPress={this.props.onPress}>
        { this.props.language == "hebrew" ?
          <Text style={[styles.hebrewText, styles.centerText, textStyle]}>{this.props.heTitle + countStr}</Text> :
          <Text style={[styles.englishText, styles.centerText, textStyle]}>{this.props.title + countStr}</Text> }
      </TouchableOpacity>
    );
  }
}

class LinkContent extends React.PureComponent {
  static propTypes = {
    theme:             PropTypes.object.isRequired,
    settings:          PropTypes.object,
    openRef:           PropTypes.func.isRequired,
    refStr:            PropTypes.string,
    linkContentObj:    PropTypes.object, /* of the form {en,he} */
    textLanguage:      PropTypes.string,
    loading:           PropTypes.bool,
    isCommentaryBook:  PropTypes.bool
  };

  render() {
    var lco = this.props.linkContentObj;
    var lang = Sefaria.util.getTextLanguageWithContent(this.props.textLanguage,lco.en,lco.he);
    var textViews = [];

    var hebrewElem =  <HTMLView
                        stylesheet={styles}
                        value={"<hediv>"+lco.he+"</hediv>"}
                        textComponentProps={
                          {
                            style: [styles.hebrewText, styles.linkContentText, this.props.theme.text, {fontSize: this.props.settings.fontSize, lineHeight: this.props.settings.fontSize * 1.1}],
                            key: this.props.refStr+"-he"
                          }
                        }
                      />;
    var englishElem = <HTMLView
                        stylesheet={styles}
                        value={"<endiv>"+"&#x200E;"+lco.en+"</endiv>"}
                        textComponentProps={
                          {
                            style: [styles.englishText, styles.linkContentText, this.props.theme.text, {fontSize: 0.8 * this.props.settings.fontSize, lineHeight: this.props.settings.fontSize}],
                            key: this.props.refStr+"-en"
                          }
                        }
                      />;
    if (lang == "bilingual") {
      textViews = [hebrewElem, englishElem];
    } else if (lang == "hebrew") {
      textViews = [hebrewElem];
    } else if (lang == "english") {
      textViews = [englishElem];
    }

    return (
      <TouchableOpacity style={[styles.searchTextResult, this.props.theme.searchTextResult]} onPress={()=>{this.props.openRef(this.props.refStr, this.props.linkContentObj.sectionRef)}}>
        {this.props.isCommentaryBook ? null : <Text style={[styles.en, styles.textListCitation, this.props.theme.textListCitation]}>{this.props.refStr}</Text>}
        {textViews}
      </TouchableOpacity>
    );
  }
}

class EmptyLinksMessage extends React.Component {
  static propTypes = {
    theme:         PropTypes.object.isRequired,
    interfaceLang: PropTypes.string
  };

  render() {
    return (<Text style={[styles.emptyLinksMessage, this.props.theme.secondaryText]}>{strings.noConnectionsMessage}</Text>);
  }
}


module.exports = TextList;
