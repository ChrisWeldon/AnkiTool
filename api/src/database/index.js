/**
 * The main file to the Database.
 * author: Chris Evans
 *
 * This file ties together all of the database models and functions.
 *
 * Initiate one database object and return to main application.
 * exports an array of initiated Schemas
 */

const mongoose = require('mongoose');

// This connection string should include all necessary credentials. Provided by ENV
const CONNECTIONSTRING = process.env.CONNECTIONSTRING;

// TODO verify connection string
const schemas = require('./schemas').schemas

mongoose.connect(CONNECTIONSTRING)

// Make models from mutated copy of schemas. This must happen after mongoose connection is created.
var models = {...schemas};
Object.keys(models)
    .map((key)=>{
        // TODO: Make this generate a key "CardModel" from name "CardSchema". Maybe that means manual
        // Visit schemas/index.js to determine the names provided
        models[key] = mongoose.model(key, models[key]);
    })

// For testing only. Creating example cards
models.Card.deleteMany({}, (res) => {
    var test = new models.Card({
        langs: ["FR", "EN"],
        terms: ["Bonjour", "Hello"]
    });
    test.save();

    var test = new models.Card({
        langs: ["FR", "EN"],
        terms: ["au revoir", "Good bye"]
    });
    test.save();
});

module.exports = {
    models,
    schemas,
    validators: require("./validators")
}
