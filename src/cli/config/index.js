const path = require('path');

const GOOGLE_IMAGE_SEARCH = process.env.GOOGLE_IMAGE_SEARCH;
const CID = process.env.CID;
const NODE_PATH = path.resolve(process.env.NODE_PATH);
const SAVE_DIR = path.join(NODE_PATH, `saves`);
// TODO: if these don't exist, write write them to .env

module.exports= {
    GOOGLE_IMAGE_SEARCH,
    CID,
    DEEPL_API_KEY
    SAVE_DIR
}

