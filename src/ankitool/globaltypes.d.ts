/* Global Type Declartions
 *
 * @author Chris Evans
 */
import { Language } from './langs';

declare global {
    // Indefinite Singular | Definite Singular | No added article
    type ArticleCode = 'is' | 'ds' |  'base';


    type WordRequestOptions = {
        input_lang: Language,
        target_lang: Language,
        deck_name: string,
        opts: string[], // TODO Make rigorous with better option codes
        article: ArticleCode
    }

    export type Translation = {
        input: string, 
        targets: string[],  
        input_mod?: string,
        target_mod?: string,
    
    }
    export type TranslationResponse = Translation[];

    export type Translator = {
        description: string,
        (word: string, request: WordRequestOptions) : Promise<TranslationResponse>
    }

}


