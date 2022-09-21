const axios = require('axios');
const cheerio = require('cheerio');
const langs = require('../langs');

const MAX = 4;
function parseTablePage($, request){
    const table_element = $('div[id="maincontent"]');
    const parsed = [];

    const input_lang = request.input_lang; 
    const target_lang = request.target_lang; 
    
    // the non-id'd part of speach header appears one line up from main word table rows
    var header_pos = table_element.find('#tr1').prev();
    
    // starting at 1 because row's id is 1 based
    for (i=1; i<MAX; ++i) {
        var row = table_element.find('#tr' + i);

        let left_entry = row.find('td:nth-child(2)');
        let right_entry = row.find('td:nth-child(3)');
        // Dict.cc displays the lower alphabet lang on left, which is weird
        if(input_lang.rank > target_lang.rank){
            // input is left side of web table, target is right side
            var input_mod = Object.keys(input_lang.mods).find(
                (title)=>$(`var[title=${title}]`, left_entry)!='');
            var target_mod = Object.keys(target_lang.mods).find(
                (title)=>$(`var[title=${title}]`, right_entry)!='');
        }else{
            // input is right side of web table, target is left side
            var input_mod = Object.keys(input_lang.mods).find(
                (title)=>$(`var[title=${title}]`, right_entry)!='');
            var target_mod = Object.keys(target_lang.mods).find(
                (title)=>$(`var[title=${title}]`, left_entry)!='');
        }
        // Cleaning up the element of misc text 
        left_entry.find('var').remove();
        right_entry.find('var').remove();
        
        let left_atags = left_entry.find('a');
        let right_atags = right_entry.find('a');

        // reduce text into one string (element isn't Array)
        let left_text = '';
        left_atags.each((i, tag) => {
            left_text = `${left_text} ${$(tag).text().trim()}`
        });
        left_text = left_text.trim()
        
        let right_text = '';
        right_atags.each((i, tag) => {
            right_text = `${right_text} ${$(tag).text().trim()}`
        });
        right_text = right_text.trim()

        // dict.cc displays languages alphabetically right to left regardless of input lang
        parsed.push({
            input: input_lang.rank > target_lang.rank ? left_text : right_text, 
            targets: input_lang.rank > target_lang.rank ? right_text : left_text, 
            input_mod, 
            target_mod, 
        });
    }
    return parsed;
}

function parsePOSRow(header){
    // TODO create a config file which describes how to extract depending on POS
    let left_pos = header.find('td:nth-child(1)');
    let right_pos = header.find('td:nth-child(2)');
    return {
        leftpos: parsePOSCell(left_pos),
        rightpos: parsePOSCell(right_pos)
    }
}
function parsePOSCell(cell){
    // returns the text corresponding to the POS. Will pretty much only ever
    //  return NOUN or VERB because dict.cc doesn't bother with the others

    // NOTE the 'title' attrib of the tr lays out which tenses are in which order
    let tenses_outline = cell.find('tr').attr('title');
    // TODO: include lang based rules for extracting past participle etc
    let POS = cell.find('tr').find('td:nth-child(2)').find('b');
    return POS.text().trim();
}

function getTargetsDictCCTable(input_word, request){    // request are the options for the things
    // Scrapes word from webpage and returns a promise with the translation and alternative inputs

    const RETRIEVAL_URL = "https://"
        + request.input_lang.code.toLowerCase()
        + '-'
        + request.target_lang.code.toLowerCase()
        + '.dict.cc/?s='
        + input_word.trim();

    return new Promise(function(accept, reject){
        axios.get(
        		RETRIEVAL_URL
        	)
            .then((data) => {
                // word exists, parse the page for the options
                const $ = cheerio.load(data.data, { decodeEntities: false }, false);
                var parsed = parseTablePage($, request);

                // trim results;
                parsed = parsed.slice(0, (parsed.length<MAX ? parsed.length : MAX));
                accept(parsed);
            })
            .catch((err) => {
                // Word might not exist
                console.log('Dict.cc No word');
                reject(err);
            })
    });
}

module.exports = {
    getTargetsDictCCTable
}
