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
module.exports =  [
    {   /* FRENCH */ 
        name: 'Français', code: 'FR',
        value:'french',
        rank:10,
        mods:{
            masculin:{
                base: 'm. ',
                ia: 'un ',   // indefinite article
                da: 'le ',   // definite article
                ipl: 'des ', // indefinite plural
                dpl: 'les ', // definit plural
            },
            féminin:{
                base: 'f. ',
                ia: 'une ',
                da: 'la ',
                ipl: 'des ',
                dpl: 'les '
            },
            adjective:{ base: 'adj. ' },
            'adverb/adverbial':{ base:'adv. ' },
            conjunction:{ base:'conj. ' },
            pronoun:{ base:'pron. '},
            'preposition/adpos.':{ base:'prep. ' },
        }
    },
    {   /* ENGLISH */ 
        name: 'English',
        code: 'EN',
        value:'english',
        rank:6,
        mods:{
            noun:{
                base:'n. ',
                ia: 'a ',
                da: 'the ',
                ipl: 'some ',
                dpl: 'the '
            },
            adjective:{ base: 'adj' },
            'adverb/adverbial':{ base:'adv.' },
            conjunction:{ base:'conj.' },
            pronoun:{ base:'pron.'},
            'preposition/adpos.':{ base:'prep.' },
        }
    },
    { name: 'Español', code: 'ES', value:'spanish', rank:8, disabled:true},
    { name: 'Deutsch', code: 'DE', value:'german', rank:4, disabled:true}
]
