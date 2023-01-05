"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios');
var langs = require('../langs');
var cheerio = require('cheerio');
var MAX = 4;
function parseTablePage($, request) {
    var table_element = $('div[id="maincontent"]');
    var parsed = [];
    var input_lang = request.input_lang;
    var target_lang = request.target_lang;
    // the non-id'd part of speach header appears one line up from main word table rows
    var header_pos = table_element.find('#tr1').prev();
    var _loop_1 = function (i) {
        row = table_element.find('#tr' + i);
        var left_entry = row.find('td:nth-child(2)');
        var right_entry = row.find('td:nth-child(3)');
        // Dict.cc displays the lower alphabet lang on left, which is weird
        if (input_lang.rank > target_lang.rank) {
            // input is left side of web table, target is right side
            input_mod = Object.keys(input_lang.mods).find(function (title) { return $("var[title=".concat(title, "]"), left_entry) !== undefined; });
            target_mod = Object.keys(target_lang.mods).find(function (title) { return $("var[title=".concat(title, "]"), right_entry) != undefined; });
        }
        else {
            // input is right side of web table, target is left side
            input_mod = Object.keys(input_lang.mods).find(function (title) { return $("var[title=".concat(title, "]"), right_entry) != undefined; });
            target_mod = Object.keys(target_lang.mods).find(function (title) { return $("var[title=".concat(title, "]"), left_entry) != undefined; });
        }
        // Cleaning up the element of misc text 
        left_entry.find('var').remove();
        right_entry.find('var').remove();
        var left_atags = left_entry.find('a');
        var right_atags = right_entry.find('a');
        // reduce text into one string (element isn't Array)
        var left_text = '';
        left_atags.each(function (i, tag) {
            left_text = "".concat(left_text, " ").concat($(tag).text().trim());
        });
        left_text = left_text.trim();
        var right_text = '';
        right_atags.each(function (i, tag) {
            right_text = "".concat(right_text, " ").concat($(tag).text().trim());
        });
        right_text = right_text.trim();
        // dict.cc displays languages alphabetically right to left regardless of input lang
        parsed.push({
            input: input_lang.rank > target_lang.rank ? left_text : right_text,
            targets: input_lang.rank > target_lang.rank ? [right_text] : [left_text],
            input_mod: input_mod,
            target_mod: target_mod,
        });
    };
    var row, input_mod, target_mod, input_mod, target_mod;
    // starting at 1 because row's id is 1 based
    for (var i = 1; i < MAX; ++i) {
        _loop_1(i);
    }
    return parsed;
}
function parsePOSRow(header) {
    // TODO create a config file which describes how to extract depending on POS
    var left_pos = header.find('td:nth-child(1)');
    var right_pos = header.find('td:nth-child(2)');
    return {
        leftpos: parsePOSCell(left_pos),
        rightpos: parsePOSCell(right_pos)
    };
}
function parsePOSCell(cell) {
    // returns the text corresponding to the POS. Will pretty much only ever
    //  return NOUN or VERB because dict.cc doesn't bother with the others
    // NOTE the 'title' attrib of the tr lays out which tenses are in which order
    var tenses_outline = cell.find('tr').attr('title');
    // TODO: include lang based rules for extracting past participle etc
    var POS = cell.find('tr').find('td:nth-child(2)').find('b');
    return POS.text().trim();
}
function getTargetsDictCCTable(input_word, request) {
    // Scrapes word from webpage and returns a promise with the translation and alternative inputs
    var RETRIEVAL_URL = "https://"
        + request.input_lang.code.toLowerCase()
        + '-'
        + request.target_lang.code.toLowerCase()
        + '.dict.cc/?s='
        + input_word.trim();
    return new Promise(function (accept, reject) {
        axios.get(RETRIEVAL_URL)
            .then(function (data) {
            // word exists, parse the page for the options
            var $ = cheerio.load(data.data, { decodeEntities: false }, false);
            var parsed = parseTablePage($, request);
            // trim results;
            parsed = parsed.slice(0, (parsed.length < MAX ? parsed.length : MAX));
            accept(parsed);
        })
            .catch(function (err) {
            // Word might not exist
            console.log('Dict.cc No word');
            reject(err);
        });
    });
}
module.exports = {
    getTargetsDictCCTable: getTargetsDictCCTable
};
