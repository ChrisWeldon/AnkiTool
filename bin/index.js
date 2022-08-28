#!/usr/bin/env node
// Same as cli.js, should be collapsed probably
require("dotenv").config()
const path = require('path');
const clear = require('clear');
const figlet = require('figlet');
const { startCLi } = require('../src/cli');
const { Deck } = require('../src/ankitool');
clear();

console.log(
  figlet.textSync('AnkiTool', { horizontalLayout: 'full' })
);
console.log("Started with script");
console.log(`NODE_PATH: ${path.resolve(process.env.NODE_PATH)}`)
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
