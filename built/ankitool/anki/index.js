/* Module for generating ankideck from words
 *
 * This module exports a Deck factory which exposes functions
 * for adding Cards and exporting
 *
 * NOTES: Everything is left in the index.js folder because anki-apkg-export
 *  is missing a lot of stuff. Eventually I will have to make my own library
 *  entirely, which will also require a complete refactor of this module.
 *  This is basically just a façade of the current library. It is missing things
 *  like custom templates (must use libraries 1 template), reversal of cards,
 *  note + card separation, etc.

 *  This complete refactor is not totally undesirable because of the implementation
 *  anki. Anki is built ontop of an sql database. The anki-apkg-export library
 *  simulates this database then exports the data to make an apkg. When refactoring,
 *  I could totally just tie the webserver database and the anki database together.
 *  This would basically give a bunch of free functionality like deck sharing between users,
 *  saving decks on users. Combining like decks, etc.
 *
 * @author Chris Evans
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs').promises;
var path = require('path');
var AnkiExport = require('anki-apkg-export').default;
var _a = require('../google'), getGoogleImage = _a.getGoogleImage, initImageDir = _a.initImageDir;
// apkg.addMedia('anki.png', fs.readFileSync('anki.png'));
var style = ".card {\nfont-family: baskerville;\nfont-size: 30px;\ntext-align: center;\ncolor: black;\nbackground-color: #FFFFFF;}\n\n#gender {\n    font-style: bold;\n}\n\n.card1 { background-color: #FFFFFF; }\n.card2 { background-color: #FFFFFF; }\n\n";
function article(word, request, lang, mod) {
    if (request[lang].mods[mod] == undefined) {
        return '';
    }
    return request[lang].mods[mod][request.article](word);
}
function card(request, style) {
    // A card closure for applying styling and cli options
    return {
        compBack: function (_a) {
            var target_mod = _a.target_mod, targets = _a.targets, id = _a.id;
            return "<div class=\"card\">\n                ".concat(targets.map(function (t, i) {
                return "".concat(target_mod ?
                    article(t, request, 'target_lang', target_mod[i]) : "", " \n                            <span style=\"color:maroon\">\n                                ").concat(t, "\n                            </span>");
            }).join("; "), "\n                ").concat(request.opts.includes('images') ? "<br> <img src=\"".concat(id, ".jpg\"> <br>") : "", "\n            </div>\n            <style> ").concat(style, " </style>");
        },
        compFront: function (_a) {
            var input = _a.input, input_mod = _a.input_mod;
            return "<div class=\"card\">\n                <span id=\"gender\">".concat(article(input, request, 'input_lang', input_mod), "</span>").concat(input, "</div><style>").concat(style, "</style>");
        },
        speakBack: function (_a) {
            var input = _a.input, input_mod = _a.input_mod;
            return "<div class=\"card\">\n                <span style=\"color:maroon\">\n                    ".concat(input_mod ? "<span id=\"gender\"> ".concat(article(input, request, 'input_lang', input_mod), "</span>") : "").concat(input, "\n                </span>\n            </div>\n            <style> ").concat(style, " </style>");
        },
        speakFront: function (_a) {
            var targets = _a.targets, target_mod = _a.target_mod, id = _a.id;
            // called image.jpg because there is only one image
            return "<div class=\"card\">\n                ".concat(targets.join("; "), "\n                ").concat(request.opts.includes('images') ? "<br> <img src=\"".concat(id, ".jpg\"> <br>") : "", "\n            </div><style>").concat(style, "</style>");
        }
    };
}
// FIXME: this does not need to be async. It is just a factory
function Deck(request) {
    return __awaiter(this, void 0, void 0, function () {
        var deck_name, apkg, OUTPUT_DIR, OUTPUT_PATH, _a, compBack, compFront, speakFront, speakBack, tmpDir, deck;
        var _this = this;
        return __generator(this, function (_b) {
            deck_name = request.deck_name;
            apkg = new AnkiExport(deck_name);
            OUTPUT_DIR = process.env.output_dir || "./";
            OUTPUT_PATH = path.join(OUTPUT_DIR, "".concat(deck_name, ".apkg"));
            _a = card(request, style), compBack = _a.compBack, compFront = _a.compFront, speakFront = _a.speakFront, speakBack = _a.speakBack;
            tmpDir = initImageDir();
            deck = {
                addCard: function (word) { return __awaiter(_this, void 0, void 0, function () {
                    var uri, _a, _b, _c, err_1, err_2;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 7, , 8]);
                                if (!request.opts.includes("images")) return [3 /*break*/, 6];
                                _d.label = 1;
                            case 1:
                                _d.trys.push([1, 5, , 6]);
                                return [4 /*yield*/, getGoogleImage(word.targets.join(" "), tmpDir.get())];
                            case 2:
                                uri = _d.sent();
                                _b = (_a = apkg).addMedia;
                                _c = ["".concat(word.id, ".jpg")];
                                return [4 /*yield*/, fs.readFile(uri)];
                            case 3:
                                _b.apply(_a, _c.concat([_d.sent()]));
                                return [4 /*yield*/, fs.unlink(uri)];
                            case 4:
                                _d.sent();
                                return [3 /*break*/, 6];
                            case 5:
                                err_1 = _d.sent();
                                console.log(err_1);
                                return [3 /*break*/, 6];
                            case 6:
                                if (request.opts.includes('speak')) {
                                    apkg.addCard(speakFront(word), speakBack(word));
                                }
                                if (request.opts.includes('comp')) {
                                    apkg.addCard(compFront(word), compBack(word));
                                }
                                return [2 /*return*/, deck];
                            case 7:
                                err_2 = _d.sent();
                                console.log(err_2);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); },
                export: function () {
                    apkg.save()
                        .then(function (zip) {
                        return fs.writeFile(OUTPUT_PATH, zip);
                    })
                        .then(function (res) {
                        console.log("Package has been generated: ".concat(deck_name, ".pkg"));
                    })
                        .catch(function (err) { return console.log(err); });
                    tmpDir.close();
                    return deck;
                }
            };
            return [2 /*return*/, deck];
        });
    });
}
module.exports = {
    Deck: Deck
};
