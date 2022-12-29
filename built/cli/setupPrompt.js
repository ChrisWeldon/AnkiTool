var inquirer = require('inquirer');
var langs = require('../ankitool/langs');
// Note: target in this case is not YOUR target language, but the translation targets
module.exports = function () {
    // Handles the the preliminary options for the deck, langue, card type, etc
    var questions = [
        {
            name: 'input_lang',
            type: 'list',
            message: 'Choose input language:',
            choices: langs,
        },
        {
            name: 'target_lang',
            type: 'list',
            message: 'Choose your native language:',
            choices: function (answers) {
                return langs.filter(function (word) { return word.value != answers.input_lang; });
            }
        },
        {
            name: 'deck_name',
            type: 'input',
            message: 'Deck Name:',
            default: 'My Anki Deck'
        },
        {
            name: 'opts',
            type: 'checkbox',
            message: 'Deck Options:',
            choices: [
                {
                    name: "Study Speaking (recall)",
                    short: "Speaking",
                    value: "speak",
                    checked: true
                },
                {
                    name: "Study Comprehension (reading)",
                    short: "Comprehension",
                    value: "comp",
                    checked: true
                },
                {
                    name: 'Clean all verbs to infinitive',
                    short: 'Infinitive',
                    value: 'make_infinitive',
                    disabled: true
                },
                {
                    name: 'Include images',
                    short: 'Images',
                    value: 'images',
                    checked: true
                },
                {
                    name: 'Prompt only images for speaking (recall in your target)',
                    short: 'Speaking Images Only',
                    value: 'speak_images',
                    disabled: true
                },
                {
                    name: 'Return only images for comprehension',
                    short: 'Comprehension Images Only',
                    value: 'comp_images',
                    disabled: true
                },
                {
                    name: 'Include audio ( your target language)',
                    short: 'Audio',
                    value: 'audio',
                    disabled: true
                }
            ]
        },
        {
            name: "article",
            message: "Word article:",
            type: 'list',
            choices: [
                {
                    name: 'Base',
                    short: 'base',
                    value: 'base'
                },
                {
                    name: 'Indefinite Singular',
                    short: 'Indefinite',
                    value: 'is'
                },
                {
                    name: 'Definite Singular',
                    short: 'Definite',
                    value: 'ds'
                }
            ]
        }
    ];
    return inquirer.prompt(questions);
};
