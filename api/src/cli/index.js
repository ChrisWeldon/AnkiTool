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
        // TODO: turn into Promise.resolve pattern
        var request = {};
        await configPrompt();
        return new Promise(async function(accept, reject){
            setupPrompt()
                .then(async answers => {
                    request = answers;
                    if(checkSave(request.deck_name)){
                        // Prompt for deletion of existing save
                        const { keep_save } = await inquirer.prompt(KEEP_SAVE)
                        if(!keep_save){
                            removeSave(request.title);
                        }
                    }
                    
                    request.save = startSave(request.deck_name);
                    // open recursive call to cardPrompt with load as
                    // starting point. 
                    return cardPrompt(request.save.load(), request);
                })
                .then((words) => {
                    request.words = words;
                    request.words.map(( word, i) => {
                        word.id = i;
                    });
                    accept(request);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

}
