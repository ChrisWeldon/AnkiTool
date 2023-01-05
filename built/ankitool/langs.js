"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: pull deepl to find aspiratd h sounds le hibou vs hospital
var vowels = ['a', 'e', 'i', 'o', 'u'];
var languages = [
    {
        name: 'Français', code: 'FR',
        value: 'french',
        rank: 10,
        mods: {
            masculin: {
                base: function () { return 'm. '; },
                is: function () { return 'un '; },
                ds: function (w) {
                    if (vowels.includes(w.charAt(0).toLowerCase())) {
                        return "l'";
                    }
                    return 'le ';
                },
                ipl: function () { return 'des '; },
                dpl: function () { return 'les '; }, // definit plural
            },
            féminin: {
                base: function () { return 'f. '; },
                is: function () { return 'une '; },
                ds: function (w) {
                    if (vowels.includes(w.charAt(0).toLowerCase())) {
                        return "l'";
                    }
                    return 'la ';
                },
                ipl: function () { return 'des '; },
                dpl: function () { return 'les '; }
            },
            adjective: { base: function () { return 'adj. '; } },
            'adverb/adverbial': { base: function () { return 'adv. '; } },
            conjunction: { base: function () { return 'conj. '; } },
            pronoun: { base: function () { return 'pron. '; } },
            'preposition/adpos.': { base: function () { return 'prep. '; } },
        }
    },
    {
        name: 'English',
        code: 'EN',
        value: 'english',
        rank: 6,
        mods: {
            noun: {
                base: function () { return 'n. '; },
                is: function () { return 'a '; },
                ds: function () { return 'the '; },
                ipl: function () { return 'some '; },
                dpl: function () { return 'the '; }
            },
            adjective: { base: function () { return 'adj'; } },
            'adverb/adverbial': { base: function () { return 'adv.'; } },
            conjunction: { base: function () { return 'conj.'; } },
            pronoun: { base: function () { return 'pron.'; } },
            'preposition/adpos.': { base: function () { return 'prep.'; } },
        }
    },
    {
        name: 'Deutsch',
        code: 'DE',
        value: 'german',
        rank: 4,
        mods: {
            "der - männlich (Maskulinum)": {
                base: function () { return 'm. '; },
                is: function () { return 'ein '; },
                ds: function () { return 'der '; },
                ipl: function () { return 'die '; },
                dpl: function () { return 'die '; }, // definit plural
            },
            "die - weiblich (Femininum)": {
                base: function () { return 'f. '; },
                is: function () { return 'die '; },
                ds: function () { return 'eine '; },
                ipl: function () { return ' '; },
                dpl: function () { return 'die '; }
            },
            "das - sächlich (Neutrum)": {
                base: function () { return 'n. '; },
                is: function () { return 'ein '; },
                ds: function () { return 'ein'; },
                ipl: function () { return ' '; },
                dpl: function () { return 'die '; }
            },
            adjective: { base: function () { return 'adj. '; } },
            'adverb/adverbial': { base: function () { return 'adv. '; } },
            conjunction: { base: function () { return 'conj. '; } },
            pronoun: { base: function () { return 'pron. '; } },
            'preposition/adpos.': { base: function () { return 'prep. '; } },
        },
        disabled: true
    },
    { name: 'Español', code: 'ES', value: 'spanish', rank: 8, disabled: true, mods: {} },
];
exports.default = languages;
