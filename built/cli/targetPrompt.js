/** cli/targetPrompt.js
 * A module for producing the prompt which displays translation options.
 *
 * @author Chris Evans
 */
var inquirer = require('inquirer');
var clc = require('cli-color');
var langs = require('../ankitool/langs');
module.exports = function (pool, request) {
    var input_lang = request.input_lang;
    var target_lang = request.target_lang;
    var mod = clc.xterm(202);
    choices = pool.map(function (el, index) {
        // deepl module does not use mods (doesn't provide part of speech)
        var input_mod_text = el.input_mod ? mod(input_lang.mods[el.input_mod].base()) : '';
        var target_mod_text = el.target_mod ? mod(target_lang.mods[el.target_mod].base()) : '';
        return {
            name: "".concat(input_mod_text).concat(el.input, " \u2192 ").concat(target_mod_text).concat(el.targets),
            short: "".concat(el.input, " \u2192 ").concat(target_mod_text).concat(el.targets),
            value: index
        };
    });
    // Handles the the preliminary options for the deck, langue, card type,
    var questions = [
        {
            name: 'opts',
            type: 'checkbox',
            message: choices.length ? 'Which Definitions:' : 'No Definitions available',
            choices: choices
        }
    ];
    return inquirer.prompt(questions)
        .then(function (selected) {
        // get choices from original questions
        return selected.opts.map(function (c) {
            return pool[c];
        });
    });
};
