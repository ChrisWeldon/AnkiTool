/* Global Type Declartions
 *
 * @author Chris Evans
 */
import { Language } from './langs';

// Indefinite Singular | Definite Singular | No added article
export type ArticleCode = 'is' | 'ds' |  'base';


export type WordRequestOptions = {
    input_lang: Language,
    target_lang: Language,
    deck_name: string,
    opts: string[], // TODO Make rigorous with better option codes
    article: ArticleCode
}


