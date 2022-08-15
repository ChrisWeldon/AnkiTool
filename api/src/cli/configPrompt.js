const inquirer = require('inquirer');

module.exports = async () => {
    const google_questions = [
      {
        name: 'GOOGLE_IMAGE_SEARCH',
        type: 'input',
        message: 'Paste in Google your key: ',
      }, 
      {
        name: 'CID',
        type: 'input',
        message: 'Paste in Google CID your key: ',
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
    }
    if(!process.env.DEEPL_API_KEY){
        //TODO write api key to env
        const { DEEPL_API_KEY } = await inquirer.prompt(deepl_questions);
        process.env["DEEPL_API_KEY"] = DEEPL_API_KEY;
        
    }
}