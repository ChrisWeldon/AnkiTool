/* Global Type Declartions
 *
 * @author Chris Evans
 */


// Indefinite Singular | Definite Singular | No added article
type ArticleCode = 'is' | 'ds' |  'base';


type WordRequestOptions = {
    input_lang: Language,
    target_lang: Language,
    deck_name: string,
    opts: string[], // TODO Make rigorous with better option codes
    article: ArticleCode
}
