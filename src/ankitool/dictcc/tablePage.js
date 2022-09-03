const axios = require('axios');
const cheerio = require('cheerio');
const langs = require('../langs');

const MAX = 2;
function parseTablePage($, request){
    const table_element = $('div[id="maincontent"]');
    const parsed = [];
    console.log(request);
    // HERE: FILTER REQUEST LANG to languages
    const input_lang = request.input_lang;
    const target_lang = request.target_lang;

    for (i=1; i<MAX; ++i) {
        var row = table_element.find('#tr' + i);

        let left_entry = row.find('td:nth-child(2)');
        let right_entry = row.find('td:nth-child(3)');
        console.log(`${input_lang.rank} vs ${target_lang.rank}`)
        // Dict.cc displays the lower alphabet lang on left, which is weird
        if(input_lang.rank > target_lang.rank){
            // input is left side of web table, target is right side
            var input_mod = $('var[title=masculin]', left_entry);
            var target_mod = $('var[title=masculin]', right_entry);
            
        }else{
            // input is right side of web table, target is left side
            var input_mod = $('var[title=masculin]', right_entry);
            var target_mod = $('var[title=masculin]', left_entry);
        }
        console.log(`INPUT MOD: ${input_mod}`);
        console.log(`TARGET MOD: ${target_mod}`);
        
        // dict.cc displays languages alphabetically right to left regardless of search term
        parsed.push({
            input: input_lang.rank > target_lang.rank ? left_text : right_text, 
            mod: ( mod!='' ? mod: undefined), // TODO fix csv saving to have versioning
            targets: input_lang.rank > target_lang.rank ? right_text : left_text, 
            input_mod: undefined,
            target_mod: undefined ,
        });
    }
    return parsed;
}

function getTargetsDictCCTable(input_word, request){    // request are the options for the things
    // Scrapes word from webpage and returns a promise with the translation and alternative inputs

    const RETRIEVAL_URL = "https://"
        + langs.find((o)=>o.value==request.input_lang).code.toLowerCase()
        + '-'
        + langs.find((o)=>o.value==request.target_lang).code.toLowerCase()
        + '.dict.cc/?s='
        + input_word.trim();

    return new Promise(function(accept, reject){
        axios.get(
        		RETRIEVAL_URL
        	)
            .then((data) => {
                // word exists, parse the page for the options
                const $ = cheerio.load(data.data, null, false);
                var parsed = parseTablePage($, request);

                // trim results;
                parsed = parsed.slice(0, (parsed.length<MAX ? parsed.length : MAX));
                accept(parsed);
            })
            .catch((err) => {
                // Word might not exist
                reject(err);
            })
    });
}

module.exports = {
    getTargetsDictCCTable
}
