
const { Card } = require('../database').schemas;
const { validators } = require('../database');

module.exports = {
    search : (req, res, next) => {
        if (!validators.Card.search(req.body)){
            throw "Invalid Cards/get: \n \t" + JSON.stringify(validators.Card.search.errors);
        }
        next();
    },
    create : (req, res, next) => {
        // TODO
        next();
    },
    delete : (req, res, next) => {
        // TODO
        next();
    },
    update : (req, res, next) => {
        // TODO
        next();
    }
}
