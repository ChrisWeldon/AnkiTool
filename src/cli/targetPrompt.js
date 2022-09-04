/** cli/targetPrompt.js  
 * A module for producing the prompt which displays translation options.
 *
 * @author Chris Evans
 */

const inquirer = require('inquirer');
const clc = require('cli-color');
const langs = require('../ankitool/langs');

module.exports = function( pool, request ){
    const input_lang = request.input_lang;
    const target_lang = request.target_lang;

    const mod = clc.xterm(202);
    choices = pool.map((el, index) => {
        // deepl module does not use mods (doesn't provide part of speech)
        const input_mod_text = el.input_mod ? mod(input_lang.mods[ el.input_mod ].base) : '';
        const target_mod_text = el.target_mod ? mod(target_lang.mods[ el.target_mod ].base): '';
        return {
            name: `${input_mod_text}${el.input} \u2192 ${target_mod_text}${el.targets}`,
            short: `${el.input} \u2192 ${target_mod_text}${el.targets}`,
            value: index
        }
    })
    // Handles the the preliminary options for the deck, langue, card type,
    const questions = [
      {
        name: 'opts',
        type: 'checkbox',
        message: choices.length ? 'Which Definitions:' : 'No Definitions available',
        choices
      }
    ]

    return inquirer.prompt(questions)
        .then(( selected ) => {
            // get choices from original questions
            return selected.opts.map( c => {
                return pool[c];
            });
        });
}
