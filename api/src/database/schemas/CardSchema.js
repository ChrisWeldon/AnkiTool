const mongoose = require('mongoose');
const { Schema } = mongoose;

// TODO: Write tool to turn ajv validation schema into the proper format for Mongoose Schema.
//      Duplication like this is so stupid.
//      Seems like the existing tools for this problem have a lot of vunerabilities


// NOTE: Validation could take place in a number of places,
//      I am choosing express middleware because a lot of validation will occur
//      on bizar inputs like searches etc.
// For validation
const ajv_schema = {
    type: "object",
    properties: {
        langs: {
            type: "array",
            items: {
                type: "string"
            }
        },
        terms: {
            type: "array",
            items: {
                type: "string"
            }
        }
    },
    required: [],
    additionalProperties:false
}


// For creation
const mongoose_schema = {
    langs: [String],
    terms: [String]
}


// TODO undo this validator part, this will be somewhere else
module.exports = {
    schema: new Schema(mongoose_schema),
    validator: ajv_schema
};
