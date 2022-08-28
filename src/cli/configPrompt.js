const inquirer = require('inquirer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

module.exports = async () => {
    const google_questions = [
      {
        name: 'GOOGLE_IMAGE_SEARCH',
        type: 'input',
        message: 'Paste in your Google search api key: ',
      }, 
      {
        name: 'CID',
        type: 'input',
        message: 'Paste in your Google CID: ',
      }, 
    ]
    const deepl_questions = [
      {
        name: 'DEEPL_API_KEY',
        type: 'input',
        message: 'Paste in your DeepL API key: ',
      },
    ]
    if(!process.env.GOOGLE_IMAGE_SEARCH){
        //TODO write api key to env
        const { GOOGLE_IMAGE_SEARCH, CID } = await inquirer.prompt(google_questions);
        process.env["GOOGLE_IMAGE_SEARCH"] = GOOGLE_IMAGE_SEARCH;
        process.env["CID"] = CID;
        
        let DOTENV = path.join(process.env.NODE_PATH, '.env');
        if(!fs.existsSync(DOTENV)){
            fs.writeFileSync(DOTENV, '#saved api keys for anki-tool')
        }
        fs.appendfileSync(DOTENV, 
            `
            GOOGLE_IMAGE_SEARCH=${GOOGLE_IMAGE_SEARCH}
            CID=${CID}
            `
        )
    }
    if(!process.env.DEEPL_API_KEY){
        //TODO write api key to env
        let DOTENV = path.join(process.env.NODE_PATH, '.env');
        const { DEEPL_API_KEY } = await inquirer.prompt(deepl_questions);
        process.env["DEEPL_API_KEY"] = DEEPL_API_KEY;
        if(!fs.existsSync(DOTENV)){
            fs.writeFileSync(DOTENV, '#saved api keys for anki-tool')
        }
        fs.appendFileSync(DOTENV, 
            `
            DEEPL_API_KEY=${DEEPL_API_KEY}
            `
        )
    }
}
