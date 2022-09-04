const inquirer = require('inquirer');
const { getTargetsDeepL, getTargetsDictCCTable,
    getTargetsDictCCBrowse } = require('../ankitool');
const targetPrompt = require('./targetPrompt');

// FIXME somewhere words are getting folded into the opts upon finish object and it is
//  creating a lot of unexepcted behaviors.
function cardPrompt(words, {save, ...opts}){
    // Handles the asking for words. Recursively mutates the input array
    const WORD_INPUT = [
        {
            name: 'word',
            type: 'input',
            message: 'Word:',
        }
    ];

    const CONFIRMATION = [
        {
            name: 'done',
            type: 'confirm',
            message: 'Finished adding cards?',
            default: true
        }
    ];

    return inquirer.prompt(WORD_INPUT)
        .then( res => {
            if(res.word.length>0){
                // Internet data retrieval step
                // NOTE: no longer using browse page - not worth it
                return Promise.allSettled([
                    getTargetsDeepL(res.word, opts),
                    getTargetsDictCCTable(res.word, opts),
                ])
                    .then(( promises ) => {
                        let total = [];
                        // It is likely that some of these promises fail
                        if(promises[0].status=='fulfilled'){
                            // Deepl
                            total = total.concat(promises[0].value);
                        }
                        if(promises[1].status=='fulfilled'){
                            // dict.cc tables
                            total = total.concat(promises[1].value);
                        }

                        // All possible choices of translations
                        return total;
                    })

                    .then(( total ) => {
                        // Reduce/filter the picks available to user
                        total = total.filter(( word ) => {
                            if( word.input.length==0 ) return false;
                            return true;
                        })
                        return targetPrompt(total, opts);
                    })

                    .then(( picks ) => {
                        // Reduce the picked options
                        collapsed_words = [];
                        picks.forEach(( pick ) => {
                            // find if a record for that input already exists
                            record = collapsed_words.find(( r ) => r.input == pick.input);
                            if(record){
                                record.targets = record.targets.concat(pick.targets);
                                record.mod = pick.mod ? pick.mod : record.mod;
                            }else{
                                collapsed_words.push( pick );
                            }
                        });

                        words = words.concat(collapsed_words);
                        collapsed_words.forEach(( word ) => {
                            save.appendWord(word);
                        })
                        opts.save = save;
                        // add to words then repeat
                        return cardPrompt(words, opts);
                    })

                    .catch( err => {
                        console.log(err);
                        return cardPrompt(words, opts);
                    });
            }else {
                return inquirer.prompt(CONFIRMATION)
                    .then(( res ) => {
                        // get choices from original questions
                        if(res.done){
                            return words;
                        }else{
                            return cardPrompt(words, opts);
                        }
                    });
            }
        });
}

module.exports = cardPrompt;
