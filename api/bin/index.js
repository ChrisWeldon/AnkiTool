#!/usr/bin/env node
require("dotenv").config()
const clear = require('clear');
const figlet = require('figlet');
const { startCLi } = require('../src/cli');
const { Deck } = require('../src/ankitool');
clear();

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