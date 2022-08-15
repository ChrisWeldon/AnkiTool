const inquirer = require('inquirer');
const clc = require('cli-color');

module.exports = function( pool ){
    const mod = clc.xterm(202);
    choices = pool.map((el, index) => {
        return {
            name: `${mod(el.mod)} ${el.input} \u2192 ${el.targets.join('; ')}`,
            short: `${el.input} \u2192 ${el.targets.join('; ')}`,
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
