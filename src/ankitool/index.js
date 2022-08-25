const { getTargetsDictCCBrowse, getTargetsDictCCTable  } = require('./dictcc');
const { getTargetsDeepL } = require('./deepl/retrieve');
const { Deck } = require('./anki');
const { getGoogleImage } = require('./google');

module.exports = {
    getTargetsDictCCBrowse,
    getTargetsDictCCTable,
    getTargetsDeepL,
    getGoogleImage,
    Deck,
}

// TODO: change targets terminology. It is used currently meaning "the target
// translation of your input word" which is confusing because your 'target
// language' refers to the language you would be inputting. Really confusing