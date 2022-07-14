module.exports = {
    type: "object",
    properties: {
        langs: {
            type: ["array", "string"],
            items: {
                type: "string"
            }
        },
        terms: {
            type: ["array", "string"],
            items: {
                type: "string"
            }
        }
    },
    required: ["type", "terms"],
    additionalProperties: false
}
