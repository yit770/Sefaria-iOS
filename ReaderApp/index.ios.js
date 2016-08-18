/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, { Component } from 'react';
import { 	
  AppRegistry,
	StyleSheet,
	ScrollView,
	Text,
	View,
	ListView,
	Modal,
	TextInput,
	TouchableOpacity,
	ActivityIndicatorIOS
} from 'react-native';

var styles  = require('./Styles.js');
var Sefaria = require('./sefaria');

var ReaderPanel = require('./ReaderPanel');

var {
  LoadingView
} = require('./Misc.js');

var ReaderApp = React.createClass({
    getInitialState: function () {
        Sefaria.init().then(function() {
            this.setState({loaded: true});
        }.bind(this));

        return {
            segmentRef: 0,
            ref: "",
            textReference: "",
            bookReference: "",
            loaded: false,
            menuOpen: "navigation",
            navigationCategories: [],
            loadingTextTail: false,
            interfaceLang: "english" // TODO check device settings for Hebrew: ### import {NativeModules} from 'react-native'; console.log(NativeModules.SettingsManager.settings.AppleLocale);
        };
    },
    componentDidMount: function () {
      Sefaria._deleteAllFiles().then(function() {
          // this.loadNewText(this.state.ref);
         }.bind(this)).catch(function(error) {
          console.log('oh no', error);
        });
    },
    TextSegmentPressed: function(q) {
        this.setState({segmentRef: q})
    },
    loadNewText: function(ref) {
        Sefaria.data(ref).then(function(data) {
            this.setState({
                data: data.content,
                next: data.next,
                prev: data.prev,
                loaded: true
            });
            Sefaria.saveRecentRef(ref);
        }.bind(this)).catch(function(error) {
          console.log('oh no', error);
        });

    },
    updateData: function(data,ref,next,prev) {
        this.setState({
            data: data,
            textReference: ref,
            loaded: true,
            loadingTextTail: false,
            next: next,
            prev: prev
        });
    },
    openRef: function(ref) {
        this.setState({
            loaded: false,
            textReference: ref
        });
        this.closeMenu();
        this.loadNewText(ref);
    },
    openMenu: function(menu) {
        this.setState({menuOpen: menu});
    },
    closeMenu: function() {
        this.clearMenuState();
        this.openMenu(null);
    },
    openNav: function() {
        this.openMenu("navigation");
    },
    setNavigationCategories: function(categories) {
        this.setState({navigationCategories: categories});
    },
    openSearch: function(query) {
        this.openMenu("search");
    },
    clearMenuState: function() {
        this.setState({
            navigationCategories: []
        });
    },
    setLoadTextTail: function(setting) {
        this.setState({
            loadingTextTail: setting
        });
    },
    render: function () {
        if (!this.state.loaded) { return <LoadingView />; }
        else {
            return (
                <View style={styles.container}>
                    <ReaderPanel
                        textReference={this.state.textReference}
                        data={this.state.data}
                        next={this.state.next}
                        prev={this.state.prev}
                        segmentRef={this.state.segmentRef}
                        textList={0}
                        menuOpen={this.state.menuOpen}
                        navigationCategories={this.state.navigationCategories}
                        style={styles.mainTextPanel}
                        updateData={this.updateData}
                        TextSegmentPressed={ this.TextSegmentPressed }
                        openRef={ this.openRef }
                        interfaceLang={this.state.interfaceLang}
                        openMenu={this.openMenu}
                        closeMenu={this.closeMenu}
                        openNav={this.openNav}
                        setNavigationCategories={this.setNavigationCategories}
                        openSearch={this.openSearch}
                        loadingTextTail={this.props.loadingTextTail}
                        setLoadTextTail={this.setLoadTextTail}
                        Sefaria={Sefaria} />
                </View>
            );
        }
    },
});

AppRegistry.registerComponent('ReaderApp', () => ReaderApp);