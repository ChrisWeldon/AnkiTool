// Saves and checks data to tmp directory so you don't lose your progress on a deck. 
// Maybe also update decks
const fs = require("fs");
const path = require("path");
const Table = require('cli-table');

// TODO: Clean this file up a bit. Error handling is weird

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
    const name = path.join(__dirname, `/tmp/${title}.csv`);
    const header = `input, mod, target\n`;
    if(!fs.existsSync(name)){
        fs.writeFileSync(name, header);
    }
    return {
        appendWord: ({ input, mod, targets }) => {
            try{
                fs.appendFileSync(
                    name, 
                    `${input},${mod},${targets.join(';')}\n`,
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
                            mod: row[1],
                            targets: row[2].split(";")
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
    const path = `./tmp/${title}.csv`;
    return fs.existsSync(path);
}
function removeSave( title ){
    const path = `./tmp/${title}.csv`;
    try{
        fs.unlinkSync(path);
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

