const { beforeAll, afterAll, describe, it, expect, test} = require('@jest/globals');
import { getTargetsDeepL } from './retrieve';
import languages from '../langs';
import { WordRequestOptions } from '../globaltypes';

describe("[Deepl Module] deepl.retrieve ", () => {
    const [french, english] = languages;
    
    beforeAll(() => {

    })

    afterAll(()=>{

    })
     

    let requestOptions : WordRequestOptions  =  {
        input_lang: french,
        target_lang: english,
        deck_name: 'deepldeck',
        opts: [],
        article: 'is'
    }
    let word = 'oie';

    it('doesn\'t throw an error', async ()=>{
        await expect(getTargetsDeepL(word, requestOptions)).resolves.toBeTruthy();
    })

    it('has a reponse that is formatted correctly', ()=>{
        expect(false).toBeTruthy();
    })

    it('retrieve the correct French translation of goose from English', ()=>{
        expect(false).toBeTruthy();
    })

    it('retrieve the c',()=>{
        expect(false).toBeTruthy();
    })

});

describe("[Deepl Module Error] deepl.retrieve", ()=>{
    const [french, english] = languages;

    let requestOptions : WordRequestOptions  =  {
        input_lang: french,
        target_lang: english,
        deck_name: 'deepldeck',
        opts: [],
        article: 'is'
    }
    let word = 'oie';

    it('throws error on lack of API key', async ()=>{
        await expect(getTargetsDeepL(word, requestOptions)).rejects.toThrow();
    })


});
