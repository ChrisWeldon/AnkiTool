// Saves and checks data to tmp directory so you don't lose your progress on a deck. 
// Maybe also update decks
var fs = require("fs");
var path = require("path");
var Table = require('cli-table');
// TODO: Clean this file up a bit. Error handling is weird
var NODE_PATH = path.resolve(process.env.NODE_PATH || '.');
var SAVE_DIR = path.join(NODE_PATH, "saves");
var DELIMITER = 0x2C; // ','
var NEWLINE = 0x0A;
function parseCSV(b) {
    var rows = [];
    var offset = 0;
    do {
        var r = parseCSVRow(b.slice(offset));
        rows.push(r.entries);
        offset = offset + r.length;
    } while (offset < b.length);
    return rows;
}
function parseCSVRow(b) {
    var entries = [];
    var offset = 0;
    do {
        var e = parseCSVEntry(b.slice(offset));
        entries.push(e.sub.toString());
        offset = offset + e.length;
    } while (!e.eol);
    return {
        entries: entries,
        length: offset
    };
}
function parseCSVEntry(b) {
    // TODO: implement escape character
    var b_itr = b.entries();
    var c = b_itr.next();
    while (c.value[1] != DELIMITER && c.value[1] != NEWLINE && !c.done) {
        c = b_itr.next();
    }
    return {
        sub: b.slice(0, c.value[0]),
        eol: (c.value[1] == NEWLINE),
        length: c.value[0] + 1 // position of offset + delimiter|CR
    };
}
function startSave(title) {
    var name = path.join(SAVE_DIR, "/".concat(title, ".csv"));
    // TODO: make version transporter to manage save formats on different
    //  versions. Also make JSON file for each save with metadata
    var header = "input, input_mod, targets, target_mod\n";
    if (!fs.existsSync(name)) {
        fs.writeFileSync(name, header);
    }
    return {
        appendWord: function (_a) {
            var input = _a.input, input_mod = _a.input_mod, targets = _a.targets, target_mod = _a.target_mod;
            try {
                fs.appendFileSync(name, "".concat(input, ",").concat(input_mod ? input_mod : '', ",").concat(targets.join(';'), ",").concat(target_mod ?
                    target_mod.join(';') :
                    '', "\n"), {
                    encoding: "latin1",
                    flag: "a"
                });
            }
            catch (err) {
                console.log(err);
                return false;
            }
            return true;
        },
        load: function () {
            try {
                var csv = parseCSV(fs.readFileSync(name));
                // We know what the fields are already
                var table = new Table({
                    head: csv[0],
                });
                table.push.apply(table, csv.slice(1));
                if (csv.length > 1) {
                    console.log(table.toString());
                }
                var words = [];
                for (var i = 1; i < csv.length; ++i) {
                    var row = csv[i];
                    words.push({
                        input: row[0],
                        input_mod: row[1],
                        targets: row[2].split(";"),
                        target_mod: row[3].split(';')
                    });
                }
                return words;
            }
            catch (err) {
                return [];
            }
        },
    };
}
function checkSave(title) {
    var name = path.join(SAVE_DIR, "".concat(title, ".csv"));
    return fs.existsSync(name);
}
function removeSave(title) {
    var name = path.join(SAVE_DIR, "".concat(title, ".csv"));
    try {
        fs.unlinkSync(name);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
module.exports = {
    startSave: startSave,
    checkSave: checkSave,
    removeSave: removeSave
};
