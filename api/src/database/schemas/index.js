module.exports = {
    schemas: {
        Card: require('./CardSchema').schema
    },
    validators:{
        Card : require('./CardSchema').validator
    }
}
