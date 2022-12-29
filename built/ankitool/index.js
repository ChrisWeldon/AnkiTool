var _a = require('./dictcc'), getTargetsDictCCBrowse = _a.getTargetsDictCCBrowse, getTargetsDictCCTable = _a.getTargetsDictCCTable;
var getTargetsDeepL = require('./deepl/retrieve').getTargetsDeepL;
var Deck = require('./anki').Deck;
var getGoogleImage = require('./google').getGoogleImage;
module.exports = {
    getTargetsDictCCBrowse: getTargetsDictCCBrowse,
    getTargetsDictCCTable: getTargetsDictCCTable,
    getTargetsDeepL: getTargetsDeepL,
    getGoogleImage: getGoogleImage,
    Deck: Deck,
};
// TODO: change targets terminology. It is used currently meaning "the target
// translation of your input word" which is confusing because your 'target
// language' refers to the language you would be inputting. Really confusing
