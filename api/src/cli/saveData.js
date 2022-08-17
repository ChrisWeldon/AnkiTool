// Saves and checks data to tmp directory so you don't lose your progress on a deck. 
// Maybe also update decks
const fs = require("fs");

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
    const path = `./tmp/${title}.csv`;
    const header = `input, mod, target\n`;
    console.log("starting save");
    if(fs.existsSync(path)){
        fs.writeFileSync(path, header);
    }
    return {
        appendWord: ({ input, mod, targets }) => {
            console.log("Appending to file")
            try{
                fs.appendFileSync(
                    path, 
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
            console.log("Loading saved data")
            try{
                const load = fs.readFileSync(path); // Returns buffer
                let csv = parseCSV(load);
                console.log(csv);
                
                return [];
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

let s = startSave("test");
s.appendWord({ input: "Hi", mod: "{m}", targets:["Bonjour"]});
s.load();

module.exports = {
    startSave,
    checkSave,
    removeSave
}

