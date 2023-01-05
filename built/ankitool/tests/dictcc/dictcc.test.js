"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('@jest/globals'), beforeAll = _a.beforeAll, afterAll = _a.afterAll, describe = _a.describe, it = _a.it, expect = _a.expect;
var index_js_1 = require("../../index.js");
var langs_1 = require("../../langs");
describe("[Dictcc Module] dictcc.getTargetsDictCCTable ", function () {
    var french = langs_1.default[0], english = langs_1.default[1];
    beforeAll(function () {
    });
    afterAll(function () {
    });
    var requestOptions = {
        input_lang: french,
        target_lang: english,
        deck_name: 'dictcc_deck',
        opts: [],
        article: 'is'
    };
    var word = 'oie';
    it('doesn\'t throw an error', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect((0, index_js_1.getTargetsDictCCTable)(word, requestOptions)).resolves.toBeTruthy()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('retrieve the correct French translation of goose from English', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, hope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_js_1.getTargetsDictCCTable)(word, requestOptions)];
                case 1:
                    response = _a.sent();
                    hope = {
                        input: 'oie',
                        targets: ['goose'],
                        input_mod: "masculin",
                        target_mod: "noun"
                    };
                    expect(response.length).toBeGreaterThan(0);
                    expect(response[0]).toEqual(hope);
                    return [2 /*return*/];
            }
        });
    }); });
    it("throws no results on a non-existent word", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_js_1.getTargetsDictCCTable)("oiiiiiiioiiiiiiioiii", requestOptions)];
                case 1:
                    response = _a.sent();
                    expect(response.length).toEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it("throws no results on a null word", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            response = (0, index_js_1.getTargetsDictCCTable)("", requestOptions);
            response.catch(function (e) {
                expect(e).toEqual("empty word");
            });
            return [2 /*return*/];
        });
    }); });
    it("throws no results on a empty word", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            response = (0, index_js_1.getTargetsDictCCTable)("  ", requestOptions);
            response.catch(function (e) {
                expect(e).toEqual("empty word");
            });
            return [2 /*return*/];
        });
    }); });
});
