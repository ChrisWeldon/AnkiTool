// Saves and checks data to tmp directory so you don't lose your progress on a deck. 
// Maybe also update decks
const fs = require("fs");

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
                const load = fs.readFileSync(path, {
                    encoding: 'utf8',
                    flag: 'r'
                });
                console.log(load);
                return [];
            }catch( err ){
                console.log(err);
            }
        },
    } 
}

function checkSave( title ){
    const path = `./tmp/${title}.csv`;
    return fs.existsSync(path);
}
function removeSave( title ){
    const path = `./tmp/${title}.csv`;
    try{
        fs.unlinkSync(path);
        return true;
    }catch( err ){
        return false;
    }
}

module.exports = {
    startSave,
    checkSave
}
