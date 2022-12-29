/**
 *
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
var _this = this;
var setupPrompt = require('./setupPrompt');
var cardPrompt = require('./cardPrompt');
var configPrompt = require('./configPrompt');
var _a = require('./saveData'), startSave = _a.startSave, checkSave = _a.checkSave, removeSave = _a.removeSave;
var inquirer = require('inquirer');
var langs = require('../ankitool/langs');
var KEEP_SAVE = [
    {
        name: 'keep_save',
        type: 'confirm',
        message: 'Load Exisiting Save for this deck?',
        default: true
    }
];
module.exports = {
    startCLi: function () { return __awaiter(_this, void 0, void 0, function () {
        var request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = {};
                    return [4 /*yield*/, configPrompt()];
                case 1:
                    _a.sent(); // This works like a config.js
                    // TODO: turn into Promise.resolve pattern
                    return [2 /*return*/, new Promise(function (accept, reject) {
                            return __awaiter(this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    setupPrompt()
                                        .then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                                        var keep_save;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    request = answers;
                                                    console.log(request);
                                                    if (!checkSave(request.deck_name)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, inquirer.prompt(KEEP_SAVE)];
                                                case 1:
                                                    keep_save = (_a.sent()).keep_save;
                                                    if (!keep_save) {
                                                        removeSave(request.deck_name);
                                                    }
                                                    _a.label = 2;
                                                case 2:
                                                    // TODO: pipeline this
                                                    request.input_lang = langs.find(function (o) { return o.value == request.input_lang; });
                                                    request.target_lang = langs.find(function (o) { return o.value == request.target_lang; });
                                                    request.save = startSave(request.deck_name);
                                                    // open recursive call to cardPrompt with load as
                                                    // starting point. 
                                                    return [2 /*return*/, cardPrompt(request.save.load(), request)];
                                            }
                                        });
                                    }); })
                                        .then(function (words) {
                                        // The words are not encoded with an id, but one is needed
                                        //  down the line for tmp file saving.
                                        //  TODO: to this in a better way, pipeline as well
                                        request.words = words;
                                        request.words.map(function (word, i) {
                                            word.id = i;
                                        });
                                        // lazily: reloading the file simply for the table display
                                        //  of the finished deck
                                        request.save.load();
                                        accept(request);
                                    })
                                        .catch(function (err) {
                                        reject(err);
                                    });
                                    return [2 /*return*/];
                                });
                            });
                        })];
            }
        });
    }); }
};
