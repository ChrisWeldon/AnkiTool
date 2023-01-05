"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetsDeepL = void 0;
var querystring = require('querystring');
var axios = require('axios');
function getTargetsDeepL(input, request) {
    var API_KEY = process.env.DEEPL_API_KEY;
    /* Retrieves translation of input word via Deepl
     *
     * @param:  input: string - The sentence to be translated
     * @param: request:Object - An object containing various options for translation
     *
     * @return: Promise - Returns a promise which passes a list of potential translations
    */
    if (typeof API_KEY == undefined) {
        return Promise.reject("Deepl API key not set");
    }
    var payload = {
        auth_key: API_KEY,
        text: input,
        source_lang: request.input_lang.code.toUpperCase(),
        target_lang: request.target_lang.code.toUpperCase()
    };
    var url = 'https://api-free.deepl.com/v2/translate';
    var options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(payload),
        url: url,
    };
    return new Promise(function (resolve, reject) {
        axios(options)
            .then(function (_a) {
            var data = _a.data;
            // todo maybe make deepl type instead of any
            return resolve(data.translations.map(function (obj) {
                return {
                    input: input,
                    targets: [obj.text],
                };
            }));
        })
            .catch(function (err) {
            return reject(err);
        });
    });
}
exports.getTargetsDeepL = getTargetsDeepL;
;
