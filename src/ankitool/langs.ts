/* A module for managing the quirks and features of different languages so 
 * that they can be handled in a programmatic way.
 *
 * @author: Chris Evans
 *
 * NOTE: This doc follows the same notation as dict.cc client tags. Thus there 
 * are tons of quirks (eg. the change in language for mods).
 * {
 *  name: <Language name>
 *  code: <code for language> used in language queries
 *  value: <English spelling of language> used in language queries
 *  mods: {
 *      <title of mod in dict.cc>: {
 *          <articles>: <target lang>
 *      }
 *  }
 * }
 */ 

type LanguageName = 'Français' | 'English' | 'Español' | 'Deutsch' ;
type LanguageCode = 'FR' | 'EN' | 'ES' | 'DE';
interface LanguageMod{
    base: ((word: string) => string) | (() => string),
    [key: string]: ((word: string) => string) | (() => string),
}

type Language = {
    name: LanguageName,
    code: LanguageCode,
    value: string,
    rank: number,
    mods: Record<string, LanguageMod>,
    disabled?: boolean
}
// TODO: pull deepl to find aspiratd h sounds le hibou vs hospital
const vowels = ['a', 'e', 'i', 'o', 'u'];
let languages: Language[] = [
    {   /* FRENCH */ 
        name: 'Français', code: 'FR',
        value:'french',
        rank:10,
        mods:{
            masculin:{
                base: () => 'm. ',
                is: () => 'un ',   // indefinite article
                ds: (w) => {
                    if (vowels.includes(w.charAt(0).toLowerCase())){
                       return "l'";
                    }
                    return 'le ';
                },   // definite article
                ipl: () => 'des ', // indefinite plural
                dpl: () => 'les ', // definit plural
            },
            féminin:{
                base: () => 'f. ',
                is: () => 'une ',
                ds: (w) => {
                    if (vowels.includes(w.charAt(0).toLowerCase())){
                       return "l'";
                    }
                    return 'la ';
                },   // definite article
                ipl: () => 'des ',
                dpl: () => 'les '
            },
            adjective:{ base: () => 'adj. ' },
            'adverb/adverbial':{ base:() => 'adv. ' },
            conjunction:{ base:() => 'conj. ' },
            pronoun:{ base:() => 'pron. '},
            'preposition/adpos.':{ base:() => 'prep. ' },
        }
    },
    {   /* ENGLISH */ 
        name: 'English',
        code: 'EN',
        value:'english',
        rank:6,
        mods:{
            noun:{
                base:() => 'n. ',
                is: () => 'a ',
                ds: () => 'the ',
                ipl: () => 'some ',
                dpl: () => 'the '
            },
            adjective:{ base: () => 'adj' },
            'adverb/adverbial':{ base:() => 'adv.' },
            conjunction:{ base:() => 'conj.' },
            pronoun:{ base:() => 'pron.'},
            'preposition/adpos.':{ base:() => 'prep.' },
        }
    },
    { /* GERMAN */
        name: 'Deutsch',
        code: 'DE',
        value:'german',
        rank:4,
        mods:{
            "der - männlich (Maskulinum)":{
                base: () => 'm. ',
                is: () => 'ein ',   // indefinite article
                ds: () => 'der ',   // definite article
                ipl: () => 'die ', // indefinite plural
                dpl: () => 'die ', // definit plural
            },
            "die - weiblich (Femininum)":{
                base: () => 'f. ',
                is: () => 'die ',
                ds: () => 'eine ',   // definite article
                ipl: () => ' ',
                dpl: () => 'die '
            },
            "das - sächlich (Neutrum)":{
                base: () => 'n. ',
                is: () => 'ein ',
                ds: () => 'ein',   // definite article
                ipl: () => ' ',
                dpl: () => 'die '
            },
            adjective:{ base: () => 'adj. ' },
            'adverb/adverbial':{ base:() => 'adv. ' },
            conjunction:{ base:() => 'conj. ' },
            pronoun:{ base:() => 'pron. '},
            'preposition/adpos.':{ base:() => 'prep. ' },
        },
        disabled: true
    },
    { name: 'Español', code: 'ES', value:'spanish', rank:8, disabled:true, mods:{}},
];

module.exports = languages;
