/* deepl/retrieve.js
 * A module containing functions for retrieving Deepl translations.
 *
 * @author: Chris Evans
 */
import { AxiosResponse } from "axios";

const querystring = require('querystring');
const axios = require('axios');



function getTargetsDeepL(input: string, request: WordRequestOptions): Promise<TranslationResponse>{
    const API_KEY: string | undefined = process.env.DEEPL_API_KEY; 
    /* Retrieves translation of input word via Deepl
     *
     * @param:  input: string - The sentence to be translated
     * @param: request:Object - An object containing various options for translation
     *
     * @return: Promise - Returns a promise which passes a list of potential translations
    */
    if(typeof API_KEY == undefined){
        return Promise.reject("Deepl API key not set")
    }
    let payload = {
        auth_key: API_KEY as string,
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
    return new Promise((resolve, reject) => {
        axios(options)
        .then(({ data } : AxiosResponse<any>) => {
            // todo maybe make deepl type instead of any
            return resolve(data.translations.map((obj: any) => {
                    return {
                        input,
                        targets: [obj.text],
                    };
                })
            );
        })
        .catch((err: AxiosResponse<any>) => {
            return reject(err);
        });
    })
};

export { getTargetsDeepL };
