/* dictcc.test.js
 * Test Dict.cc webpage scraper
 */
const AJV = require('ajv');
const ajv = new AJV();
const { getTargetsDictCCTable } = require("../tablePage");

const opts = {
    input_lang: {
        name: 'Français',
        code: 'FR',
        value: 'french',
        rank: 10,
        mods: { }
    },
    target_lang: {
        name: 'English',
        code: 'EN',
        value: 'english',
        rank: 6,
        mods: { }
    },
    deck_name: 'jestdeck',
    opts: [ 'speak', 'comp', 'images' ],
    article: 'is'
}




test("getTargetsDictCCTable ERROR", () => {
    //expect(async () => await getTargetsDictCCTable()).toThrow();
})

test("getTargetsDictCCTable returns array", async () => {
    return getTargetsDictCCTable('foulard', opts).then((res)=>{
        console.log(res);
        expect(Array.isArray(res)).toBeTruthy();
    })
})

const wordSchema = {
    type:'object',
    properties:{
        input : {type: 'string'},
        targets : {type: 'string'},
        input_mod : {
            type: 'string',
            nullable: true
        },
        target_mod : {
            type: 'string',
            nullable: true
        }
    }
} 

const validateWord = ajv.compile(wordSchema);
test("getTargetsDictCCTable words follow schema", async ()=>{
    return getTargetsDictCCTable('foulard', opts).then(res => {
        res.forEach(w => {
            let valid = validateWord(w);
            expect(valid).toBeTruthy();
        });
    })
})

