// Saves and checks data to tmp directory so you don't lose your progress on a deck. 
// Maybe also update decks
const fs = require("fs");
const path = require("path");
const Table = require('cli-table');

// TODO: Clean this file up a bit. Error handling is weird

const NODE_PATH = path.resolve(process.env.NODE_PATH || '.');
const SAVE_DIR = path.join(NODE_PATH, `saves`);

const DELIMITER = 0x2C; // ','
const NEWLINE = 0x0A;

function parseCSV(b){
    let rows = [];
    let offset = 0;
    do{
        var r = parseCSVRow(b.slice(offset));
        rows.push(r.entries);
        offset = offset + r.length;
    }while(offset<b.length)
    return rows;
}

function parseCSVRow(b){
    let entries = [];
    let offset = 0;

    do{
        var e = parseCSVEntry(b.slice(offset))
        entries.push(e.sub.toString());
        offset = offset + e.length;
    }while(!e.eol)

    return {
        entries,
        length: offset
    }
}

function parseCSVEntry(b){
    // TODO: implement escape character
    let b_itr = b.entries();
    let c = b_itr.next();
    while(c.value[1] != DELIMITER && c.value[1] != NEWLINE && !c.done){
        c = b_itr.next();
    }
    return {
        sub: b.slice(0, c.value[0]),
        eol: (c.value[1]==NEWLINE), 
        length: c.value[0]+1 // position of offset + delimiter|CR
    };
}

function startSave( title ){
    const name = path.join(SAVE_DIR, `/${title}.csv`);
    // TODO: make version transporter to manage save formats on different
    //  versions. Also make JSON file for each save with metadata
    const header = `input, input_mod, targets, target_mod\n`;
    if(!fs.existsSync(name)){
        fs.writeFileSync(name, header);
    }
    return {
        appendWord: ({ input, input_mod, targets, target_mod }) => {
            try{
                fs.appendFileSync(
                    name,
                    `${input},${input_mod ? input_mod : ''},${targets.join(';')},${target_mod ? 
                            target_mod.join(';') :
                            ''}\n`,
                    { 
                        encoding: "latin1",
                        flag: "a"
                    });
            }catch( err ){
                console.log(err);
                return false;
            }
            return true;
        },
        load: () => {
            try{
                let csv = parseCSV(fs.readFileSync(name));
                // We know what the fields are already
                let table = new Table({
                    head: csv[0],
                });
                table.push(...csv.slice(1));
                if(csv.length>1){
                    console.log(table.toString());
                }
                let words = [];
                for(let i=1; i<csv.length; ++i){
                    let row = csv[i];
                    words.push(
                        {
                            input: row[0],
                            input_mod: row[1],
                            targets: row[2].split(";"),
                            target_mod: row[3].split(';')
                        }
                    )
                }
                return words;
            }catch( err ){
                return [];
            }
        },
    } 
}

function checkSave( title){
    const name = path.join(SAVE_DIR, `${title}.csv`);
    return fs.existsSync(name);
}
function removeSave( title ){
    const name = path.join(SAVE_DIR, `${title}.csv`);
    try{
        fs.unlinkSync(name);
        return true;
    }catch( err ){
        console.log(err);
        return false;
    }
}


module.exports = {
    startSave,
    checkSave,
    removeSave
}

