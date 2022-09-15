/* deepl/retrieve.js
 * A module containing functions for retrieving Deepl translations.
 *
 * @author: Chris Evans
 */
const axios = require('axios');
const querystring = require('querystring');
const langs = require('../langs');

const API_KEY = process.env.DEEPL_API_KEY; 
function getTargetsDeepL(input, request){
    /* Retrieves translation of input word via Deepl
     *
     * @param:  input:String - The sentence to be translated
     * @param: request:Object - An object containing various options for translation
     *
     * @return: Promise - Returns a promise which passes a list of potential translations
     */
    let payload = {
        auth_key: API_KEY,
        text: input,
        source_lang: request.input_lang.code.toUpperCase(),
        target_lang: request.target_lang.code.toUpperCase()
    };

    const url = 'https://api-free.deepl.com/v2/translate';
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(payload),
        url,
    };
    //TODO convert to Promise.resolve
    return new Promise(async function(accept, reject){
        if(!API_KEY){
            reject("Deepl API key not set");
        }
        axios(options)
            .then(({ data }) => {
                accept(data.translations.map((obj) => {
                        return {
                            input,
                            targets: [obj.text]
                        };
                    })
                );
            })
            .catch((err) => {
                reject(err);
            });
    })
};

module.exports = {
    getTargetsDeepL
};
