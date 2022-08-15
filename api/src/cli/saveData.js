// Saves and checks data to tmp directory so you don't lose your progress on a deck. 
// Maybe also update decks
const fs = require("fs");

function startSave( title ){
    const path = `./tmp/${title}.csv`;
    const header = `input, mod, target\n`;
    if(fs.existsSync(path)){
        console.log("Deck save already exists here!")
        //TODO handle existing gavN here. ie Prompt continue
    }
    console.log("starting save");
    fs.writeFileSync(path, header);
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
        }
    } 
}

module.exports = {
    startSave
}
