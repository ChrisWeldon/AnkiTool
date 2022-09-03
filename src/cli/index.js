/** 
 *
 */

const setupPrompt = require('./setupPrompt');
const cardPrompt = require('./cardPrompt');
const configPrompt = require('./configPrompt');
const { startSave, checkSave, removeSave } = require('./saveData');
const inquirer = require('inquirer');

const KEEP_SAVE = [
    {
        name: 'keep_save',
        type: 'confirm',
        message: 'Load Exisiting Save for this deck?',
        default: true
    }
];
module.exports = {
    startCLi: async () => {
        // main cli function which will generate a REST like request body
        var request = {};
        
        await configPrompt(); // This works like a config.js

        // TODO: turn into Promise.resolve pattern
        return new Promise(async function(accept, reject){
            setupPrompt()
                .then(async answers => {
                    request = answers;
                    if(checkSave(request.deck_name)){
                        // Prompt for deletion of existing save
                        const { keep_save } = await inquirer.prompt(KEEP_SAVE)
                        if(!keep_save){
                            removeSave(request.deck_name);
                        }
                    }
                    
                    request.save = startSave(request.deck_name);
                    // open recursive call to cardPrompt with load as
                    // starting point. 
                    // TODO: Alter input_lang and target lang to be actual lang, pipeline
                    return cardPrompt(request.save.load(), request);
                })
                .then((words) => {
                    // The words are not encoded with an id, but one is needed
                    //  down the line for tmp file saving.
                    //  TODO: to this in a better way, pipeline as well
                    request.words = words;
                    request.words.map(( word, i) => {
                        word.id = i;
                    });
                    
                    // lazily: reloading the file simply for the table display
                    //  of the finished deck
                    request.save.load();
                    accept(request);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

}
