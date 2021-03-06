'use strict'
import {
  Dimensions,
  StyleSheet,
} from 'react-native';

const iPad = require('./isIPad');


var Sefaria = require('./sefaria'); // Included for Sefaria.palette

module.exports = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    alignSelf: 'stretch',
    alignItems: "flex-end"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color:  '#333333',
    marginBottom: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  categoryColorLine: {
    height: 26,
    borderTopWidth: 20,
    borderTopColor: "black",
    alignSelf: "stretch"
  },
  header: {
    height: 50,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  readerDisplayOptionsMenu: {
    position: "absolute",
    top: 76,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'column',
    borderBottomWidth: 1,
  },
  readerDisplayOptionsMenuRow: {
    justifyContent: "center",
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: iPad ? 20 : 15,
  },
  readerDisplayOptionMenuRowNotColor: {
    borderRadius: 5
  },
  readerDisplayOptionsMenuItem: {
    flex: 1,
    flexDirection: "row",
    height:50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  readerDisplayOptionsMenuItemLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRightWidth: 0,
  },
  readerDisplayOptionsMenuItemCenter: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginLeft: 1
  },
  readerDisplayOptionsMenuItemRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderLeftWidth: 0,
    marginLeft: 1
  },
  readerDisplayOptionsMenuColor: {
    flex: 1,
    flexDirection: "row",
    height: 50,
    borderWidth: 1,
    borderRadius: 5
  },
  readerDisplayOptionsMenuColorLeft: {
    marginRight: 5
  },
  readerDisplayOptionsMenuColorCenter: {
    marginLeft: 5,
    marginRight: 5
  },
  readerDisplayOptionsMenuColorRight: {
    marginLeft: 5
  },
  readerDisplayOptionsMenuIcon: {
    resizeMode: "contain",
    height: 18,
  },
  readerDisplayOptionsMenuDivider: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "stretch",
    height: 1
  },
  headerButton: {
    width: 40,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  leftHeaderButton: {
    marginLeft: iPad ? 10 : 0
  },
  directedButton: {
    marginLeft: 12,
    marginRight: 12
  },
  directedButtonWithTextEn: {
    marginLeft: 5,
    marginRight: 12
  },
  directedButtonWithTextHe: {
    marginLeft: 12,
    marginRight: 5
  },
  menuButton: {
    width: 17,
    height: 17,
  },
  rightHeaderButton: {
    marginRight: iPad ? 10 : 0
  },
  displaySettingsButton: {
    width: 25,
    height: 25,
    marginRight: 4
  },
  closeButton: {
    width: 16,
    height: 16,
  },
  headerButtonSearch: {
    width: 24,
    marginRight: 10,
  },
  searchButton: {
    width: 17,
    height: 17,
  },
  tripleDotsContainer: {
    width: 22,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: "center"
  },
  tripleDots: {
    width: 22,
    height: 22,
    opacity: 0.5
  },
  headerTextTitle: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: "column"
  },
  headerTextTitleInner: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "center",
  },
  headerTextTitleText: {
    fontSize: iPad ? 18 : 16,
    textAlign: "center",
    marginHorizontal: 5,
  },
  headerCategoryAttributionTextEn: {
    fontFamily: "Amiri",
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 18,
    color: "#999",
    paddingTop: 2,
    marginTop: -3
  },
  headerCategoryAttributionTextHe: {
    fontFamily: "Taamey Frank Taamim Fix",
    color: "#999",
    fontSize: 15,
  },
  downCaret: {
    width: 10,
    height: 10,
  },
  moreArrowEn: {
    width: 12,
    height: 12,
    paddingLeft: 20,
    marginBottom: 4
  },
  moreArrowHe: {
    width: 12,
    height: 12,
    paddingRight: 20
  },
  collapseArrowEn: {
    width: 12,
    height: 12,
    paddingLeft: 20,
    marginTop: 8
  },
  collapseArrowHe: {
    width: 12,
    height: 12,
    paddingRight: 20,
    marginTop: 3
  },
  forwardButtonEn: {
    width: 12,
    height: 12,
    paddingRight: 20,
    marginTop: 4
  },
  forwardButtonHe: {
    width: 12,
    height: 12,
    paddingRight: 20,
    marginTop: 4
  },
  searchResultSummary: {
    paddingVertical: 10,
    paddingHorizontal: iPad ? 60 : 30,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  searchResultSummaryHe: {
    flexDirection: "row-reverse",
  },
  searchInput: {
    alignSelf: 'stretch',
    flex: 1,
    fontSize: 16,
    fontStyle: "normal",
    fontFamily: "Amiri",
    paddingTop: 0,
    paddingRight: 20,
    backgroundColor: "transparent"
  },
  searchInputPlaceholder: {
    fontStyle: "italic",
  },
  searchPage: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  searchTextResult: {
    flex: 1,
    marginHorizontal: iPad ? 60 : 30,
    marginTop: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    borderBottomWidth: 1,
  },
  searchFilterCat: {
    flexGrow: 1,
    flexDirection: "row",
    borderTopWidth: 4,
    margin: 2,
    paddingVertical: 0,
    paddingHorizontal: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchFilterCheckBox: {
    width: 18,
    height: 18,
  },
  searchFilterClearAll: {
    width: 18,
    height: 18,
    marginHorizontal: 10
  },
  textListSummary: {
    flex: 1
  },
  textListHeaderSummary: {
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
  textListHeaderSummaryText: {
    textAlign: "center",
  },
  textListSummaryScrollView: {
    paddingHorizontal: iPad ? 20 : 10,
    paddingVertical: 20,
  },
  textListSummarySection: {
    marginBottom: 22
  },
  textListContentOuter: {
    flex: 1,
    flexDirection: "column",
  },
  textListContentListView: {
    flex: 1,
    maxWidth: 800,
    flexDirection: "column",
  },
  textListHeader: {
    height: 50,
    alignSelf: "stretch",
    borderTopWidth: 6,
    borderBottomWidth: 1,
    paddingHorizontal: iPad ? 55 : 25,
    flexDirection: "row",
  },
  textListHeaderScrollView: {
    alignSelf: "stretch"
  },
  textListHeaderItem: {
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textListHeaderItemText: {
    fontSize: iPad ? 18 : 16,
  },
  textListCitation: {
    marginBottom: 4,
  },
  linkContentText: {
    flex: 1,
    alignItems: "stretch",
  },
  noLinks: {
    flex:1,
    alignItems: "center",
    margin: 10
  },
  emptyLinksMessage: {
    fontStyle: "italic",
    fontFamily: "Amiri",
    textAlign: "center",
    marginTop: 8
  },
  menu: {
    alignSelf: 'stretch',
    flex: 1
  },
  menuContent: {
    paddingHorizontal: iPad ? 20 : 10,
    paddingTop: 20,
    paddingBottom: 40
  },
  menuScrollViewContent: {
    paddingBottom: 100,
  },
  languageToggle: {
    width: 30,
    height: 30,
    marginRight: iPad ? 20 : 10,
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  languageToggleTextEn: {
    color: "black",
    backgroundColor: "transparent",
    fontSize: 15,
    marginTop: -1
  },
  languageToggleTextHe: {
    color: "black",
    backgroundColor: "transparent",
    fontSize: 19,
    marginTop: 5,
  },
  readerNavSection: {
    marginVertical: 15
  },
  readerNavCategory: {
    flexGrow: 1,
    flexDirection: "row",
    borderTopWidth: 4,
    margin: 2,
    paddingVertical: 10,
    paddingHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  readerNavSectionTitle: {
    fontSize: 13,
    letterSpacing: 1
  },
  readerNavSectionTitleOuter: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  readerNavSectionMoreEn: {
    textAlign: "right",
    paddingRight: 10,
    fontSize: 10,
    width: 100
  },
  readerNavSectionMoreHe: {
    textAlign: "left",
    paddingLeft: 10,
    fontSize: 10,
    width: 100
  },
  readerNavSectionMoreInvisible: {
    opacity: 0
  },
  navBottomLinks: {
    marginTop: 20,
    paddingBottom: 30,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  navBottomLink: {
    marginHorizontal: 3,
  },
  category: {
    marginBottom: 10
  },
  categoryTitle: {
    flex: 1,
    textAlign: "center",
    letterSpacing: 1,
  },
  categorySectionTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    marginVertical: 15
  },
  textBlockLink: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    margin: 2,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navToggle: {
    fontSize: iPad ? 14 : 10,
    paddingTop: 2
  },
  navToggles: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 22
  },
  navTogglesDivider: {
    fontSize: iPad ? 18 : 10,
    marginHorizontal: 7
  },
  navigationCategoryCategoryAttribution: {
    marginBottom: 25,
    marginTop: 10,
  },
  navigationCategoryCategoryAttributionTextEn: {
    fontSize: 22,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "Amiri",
  },
  navigationCategoryCategoryAttributionTextHe: {
    fontSize: 20,
    color: "#999",
    textAlign: "center",
    fontFamily: "Taamey Frank Taamim Fix",
  },
  textTocHeaderTitle: {
    flex: 1,
    paddingLeft: 10,
    textAlign: 'center',
    letterSpacing: 1
  },
  mainTextPanel: {
    flexWrap: "nowrap",
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: "flex-start",
    flexDirection:"row"
  },
  commentaryTextPanel: {
    alignSelf: 'stretch'
  },
  verseNumber: {
    paddingTop: 5,
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontWeight: '400',
    fontSize: iPad ? 11 : 9,
    width: iPad ? 60 : 30,
  },
  hebrewVerseNumber: {
    fontSize: 11,
  },
  continuousHebrewVerseNumber: {
    fontSize: 11,
    paddingTop: 0
  },
  continuousVerseNumber: {
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontWeight: '400',
    fontSize: 9,
    paddingTop: 5
  },
  continuousVerseNumberHolder: {
    height: 19,
    width: 19,
    left: -25,
  },
 continuousVerseNumberHolderTalmud: {
    height: 1,
    width: 1,
   opacity: 0
  },
  continuousSectionRow: {
    paddingTop: 10,
    textAlign: "justify"
  },
   continuousRowHolder: {
    marginLeft: 30,
    marginRight: 30,
  },
  verseBullet: {
    paddingTop: 7,
    textAlign: 'center',
    fontSize: iPad ? 9 : 7,
    width: iPad ? 60 : 30,
  },
  englishSystemFont: {
    fontFamily: "Open Sans",
    fontWeight: "100"
  },
  title: {
    fontFamily: "Amiri",
    fontSize: 20
  },
  verseContainer: {
    flexDirection: "column",
    marginTop:10,
    marginBottom:10,
  },
  sectionContainer: {
    flexDirection: "column",
    marginVertical: 10,
    marginHorizontal: 30,
  },
  textColumn: {
    flex: 1,
    maxWidth: 800,
    flexDirection: "column",
    alignItems: 'stretch',
  },
  sectionHeaderBox: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  sectionHeader: {
    marginVertical: 25,
    padding: 5,
    borderBottomWidth: 4,
  },
  sectionHeaderText: {
    textAlign: "center",
    fontSize: iPad ? 22 : 14,
  },
  hebrewSectionHeaderText: {
    fontSize: iPad ? 26 : 17,
  },
  textSegment: {
    flexDirection: "column",
    flexWrap:"wrap",
    flex:.93
  },
  numberSegmentHolderEn: {
    flexDirection: "row",
    justifyContent: "center",
  },
  numberSegmentHolderBiHe: {
    flexDirection: "row-reverse",
  },
  rightContainer: {
    flex: 1
  },
  textTocCategoryAttribution: {
    marginBottom: 20,
  },
  textTocCategoryAttributionTextEn: {
    fontSize: 22,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    fontFamily: "Amiri",
  },
  textTocCategoryAttributionTextHe: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    fontFamily: "Taamey Frank Taamim Fix",
  },
  textTocVersionInfo: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 5
  },
  textTocVersionInfoItem: {
    paddingHorizontal: 7,
  },
  textTocVersionInfoText: {
    fontSize: 12
  },
  textTocVersionTitle: {
    paddingTop: 25,
    fontSize: iPad ? 28 : 17,
    textAlign: "center"
  },
  textTocVersionNotes: {
    textAlign: "center",
    fontFamily: "Amiri",
    fontSize: 13,
  },
  textTocTopBox: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: iPad ? 34 : 24,
    paddingBottom: iPad ? 34 : 24,
    paddingTop: iPad ? 20 : 0,
    borderBottomWidth: 1
  },
  textTocTitle: {
    fontSize: iPad ? 32 : 19,
    textAlign: "center"
  },
  textTocCategoryBox: {
    marginTop: 3,
    marginBottom: 12,
  },
  textTocCategory: {
    fontSize: iPad ? 20 : 12,
  },
  textTocSectionString: {
    fontSize: iPad ? 20 : 12,
  },
  textTocNumberedSectionBox: {
    marginBottom: 20
  },
  textTocNumberedSection: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  textTocNamedSection: {
    marginBottom: 15,
    marginHorizontal: 15
  },
  textTocSectionTitle: {
    fontSize: 16,
    marginBottom: 10
  },
  sectionLink: {
    height: 40,
    minWidth: 40,
    margin: 2,
    justifyContent: "center"
  },
  settingsHeader: {
    flex: 1,
    letterSpacing: 1,
    paddingRight: 40,
    textAlign: "center"
  },
  settingsSectionHeader: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10
  },
  settingsSection: {
    marginTop: 15,
    marginBottom: 5,
  },
  buttonToggleSet: {
    marginRight: 0,
    marginLeft: 0,
  },
  settingsMessage: {
    textAlign: "center",
    marginBottom: 6,
  },
  settingsDivider: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 14,
    marginVertical: 5
  },
  buttonText: {
    textAlign: "center",
    color: "#666",
  },
  dedication: {
    fontStyle: "italic",
    fontFamily: "Amiri",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20
  },
  lineEnd: {
    flex: 1,
    height: 1
  },
  englishText: {
    fontFamily: "Amiri",
    textAlign: 'left',
    fontSize: iPad ? 19 : 15,
    lineHeight: iPad ? 26 : 20,
    marginTop: 5
  },
  hebrewText: {
    fontFamily: "Taamey Frank Taamim Fix",
    writingDirection: "rtl",
    textAlign: 'right',
    flex: -1,
    fontSize: iPad ? 22 : 18,
    paddingTop: 10,
    marginTop: -5,
  },
  bilingualEnglishText: {
    paddingTop: 10
  },
  hebrewSystemFont: {
    fontFamily: "Open Sans Hebrew"
  },
  en: {
    fontFamily: "Amiri",
    textAlign: 'left'
  },
  he: {
    fontFamily: "Taamey Frank Taamim Fix",
    textAlign: 'right',
  },
  enInt: {
    fontFamily: "Open Sans",
    textAlign: 'left'
  },
  heInt: {
    fontFamily: "Open Sans Hebrew",
    textAlign: 'right'
  },
  blank: {
    height: 0,
    width: 0
  },
  readerOptions: {
    width: 30,
    height: 40,
  },
  loadingViewBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  loadingView: {
    backgroundColor: "transparent",
    height: 80,
  },
  twoBox: {

  },
  twoBoxRow: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  twoBoxItem: {
    flex: 1,
    alignItems: "stretch",
  },
  centerText: {
    textAlign: "center"
  },
  justifyText: {
    textAlign: "justify"
  },
  spacedText: {
    letterSpacing: 1
  },
  rtlRow: {
    flexDirection: "row-reverse"
  },


//HTML Styles:
  strong: {
    fontWeight: "bold"
  },
  small: {
    fontSize: 14
  },
  b: {
    fontWeight: "bold"
  },
  i: {
    fontStyle: "italic"
  },
  gemarraregular: {
    fontWeight: "500",

  },
  gemarraitalic: {
    fontStyle: "italic",
    fontWeight: "500",
  },
  a: {
    fontWeight: "300",
  },
  hediv: {
    fontFamily: "Taamey Frank Taamim Fix",
    writingDirection: "rtl",
    flex: -1,
    paddingTop: 15,
    marginTop: -10,
    textAlign: "justify",
  },
  endiv: {
    fontFamily: "Amiri",
    textAlign: 'justify',
    paddingTop: 15,
    marginTop: -10,
  }


});
