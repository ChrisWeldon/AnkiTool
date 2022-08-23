const axios = require('axios');
const cheerio = require('cheerio');
const langs = require('../langs');

const MAX = 2;
function parseTablePage($){
    const table_element = $('div[id="maincontent"]');
    const parsed = [];

    for (i=1; i<MAX; ++i) {
        var row = table_element.find('#tr' + i);
        // Sometimes the text is wrrapped in a clickable div with these id's.
        // Note: will definitally cause bug

        //row.find('#elliwrapen252287, #elliwrapde252287').unwrap();
        row.find('div:not(#elliwrapen252287):not(#elliwrapde252287)').remove();
        row.find('dfn').remove();

        var mod = $(row).find('var').contents()
            .filter(function () {
                return this.type === "text";
            })
            .text().trim();
        row.find('var').remove();

        parsed.push({
            input: row.find('td:nth-child(2)').text().trim().replace(/\s+/g, ' '),
            mod: ( mod!='' ? mod: undefined),
            targets:[row.find('td:nth-child(3)').text().trim().replace(/\s+/g, ' ')]
        });
    }
    return parsed;
}

function getTargetsDictCCTable(input_word, request){
    // Scrapes word from webpage and returns a promise with the translation and alternative inputs

    // TODO: get
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
                var parsed = parseTablePage($);

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
