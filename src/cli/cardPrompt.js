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
                
                console.log(opts)
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

                    // Manage available options
                    .then(( total ) => {
                        // Filter the words by length
                        total = total.filter(( word ) => {
                            if( word.input.length==0 ) return false;
                            return true;
                        })
                        return targetPrompt(total, opts);
                    })

                    // Manage selected options
                    .then(( picks )=>{
                        // TODO: Refactor this out during pipeline refactor
                        // array-ify the targets
                        picks.forEach( ( pick ) => {
                            if(!Array.isArray(pick.targets)){
                                pick.targets = [ pick.targets ];
                                pick.target_mod = [ pick.target_mod ]; // FIXME
                            }
                        })
                        return picks;
                    })
                
                    // Combine all the options into one card object
                    .then(( picks ) => {
                        // You want one card for all the options selected
                        collapsed_words = [];
                        picks.forEach(( pick ) => {
                            // find if a record for that input already exists
                            record = collapsed_words.find(( r ) => r.input == pick.input);
                            // augment the picked translations to avoid duplicates
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
                            opts.save = save;
                            return cardPrompt(words, opts);
                        }
                    });
            }
        });
}

module.exports = cardPrompt;
