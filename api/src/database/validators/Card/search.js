module.exports = {
    type: "object",
    properties: {
        langs: {
            type: ["array", "null", "string"],
            items: {
                type: "string"
            }
        },
        terms: {
            type: ["array", "null", "string"],
            items: {
                type: "string"
            }
        }
    },
    required: []
}
