const setupPrompt = require('./setupPrompt');
const cardPrompt = require('./cardPrompt');
const configPrompt = require('./configPrompt');
const { startSave } = require('./saveData');

module.exports = {
    startCLi: async () => {
        // main cli function which will generate a REST like request body
        // TODO: turn into Promise.resolve pattern
        var request = {};
        await configPrompt();
        return new Promise(async function(accept, reject){
            setupPrompt()
                .then(answers => {
                    request = answers;
                    request.save = startSave(request.deck_name);
                    // open recursive call to carPromp
                    return cardPrompt([], request);
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
