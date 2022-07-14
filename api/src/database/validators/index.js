const Ajv = require("ajv");
const ajv = new Ajv();

module.exports = {
    Card: {
        search : ajv.compile(require('./Card/search'))
    }
}
