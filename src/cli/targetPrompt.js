/** cli/targetPrompt.js  
 * A module for producing the prompt which displays translation options.
 *
 * @author Chris Evans
 */

const inquirer = require('inquirer');
const clc = require('cli-color');

module.exports = function( pool ){
    const mod = clc.xterm(202);
    choices = pool.map((el, index) => {
        return {
            name: `${mod(el.input_mod)} ${el.input} \u2192 ${mod(el.target_mod)} ${el.targets}`,
            short: `${el.input} \u2192 ${mod(el.target_mod)} ${el.targets}`,
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
