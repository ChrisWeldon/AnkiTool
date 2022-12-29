#!/usr/bin/env node
/** The entry point into the cli.js
 * 
 * This file is currently responsible for the prep of the terminal emulator,
 * the initialization of the cli, and the final wrap up and creation of the deck.
 *
 * Eventually the deck creation will be pulled out of here, but only after I crush
 * the anki-deck-generator depndancy.
 *
 * @author Chris Evans
 */
// Same as cli.js, should be collapsed probably
require("dotenv").config()
const path = require('path');
const clear = require('clear');
const figlet = require('figlet');
const { startCLi } = require('../built/cli');
const { Deck } = require('../built/ankitool');

clear(); // Give tool full screen

console.log(
  figlet.textSync('AnkiTool', { horizontalLayout: 'full' })
);
startCLi()
    .then(async function(res){
        const { words, ...opts } = res;
        Deck(opts)
            .then(async ( deck ) => {
                    for(const word of words){
                        await deck.addCard(word);
                    }
                    deck.export();
            });
    })
    .catch(err => {
        console.error(err);
    });
