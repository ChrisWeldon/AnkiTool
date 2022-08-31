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
 * }
 */ 
module.exports =  [
    { 
        name: 'Français', code: 'FR',
        value:'french',
        rank:10
        mods:{
            masculin:{
                ia: 'un',
                da: 'le',
                ipl: 'des',
                dpl: 'les'
            },
            féminin:{
                ia: 'une',
                da: 'la',
                ipl: 'des',
                dpl: 'les'
            },
            adjective:{},
            'adverb/adverbial':{},
            conjunction:{},
            pronoun:{},
            'preposition/adpos.':{},
        }
    },
    { 
        name: 'English',
        code: 'EN',
        value:'english',
        rank:6,
        mods:{
            noun:{
                ia: 'a',
                da: 'the',
                ipl: 'some',
                dpl: 'the'
            }
            adjective:{},
            'adverb/adverbial':{},
            conjunction:{},
            pronoun:{},
            'preposition/adpos.':{},
        }
    },
    { name: 'Español', code: 'ES', value:'spanish', rank:8, disabled:true},
    { name: 'Deutsch', code: 'DE', value:'german', rank:4, disabled:true}
]
