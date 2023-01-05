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
/** google/index.js barrel
 * Module for gathering images from user's google custom search.
 *
 * @author Chris Evans
 */
var tmp = require("tmp");
var fs = require("fs");
var path = require("path");
var axios = require('axios');
GOOGLE_IMAGE_SEARCH = process.env.GOOGLE_IMAGE_SEARCH;
CID = process.env.CID;
// TODO: search in input language for more precise images
function downloadImage(url, filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios({
                        url: url,
                        method: 'GET',
                        responseType: 'stream'
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, new Promise(function (accept, reject) {
                            response.data.pipe(fs.createWriteStream(filepath))
                                .on('error', reject)
                                .once('close', function () { return accept(filepath); });
                        })];
            }
        });
    });
}
function callGoogleAPI(term) {
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            url = "https://customsearch.googleapis.com/customsearch/v1?cx=26c8d4546ff284e30&imgSize=MEDIUM&imgType=stock&q=".concat(term, "&safe=high&searchType=image&key=").concat(GOOGLE_IMAGE_SEARCH);
            return [2 /*return*/, axios.get(url)];
        });
    });
}
function initImageDir() {
    var tmpobj = tmp.dirSync();
    return {
        get: function () { return tmpobj.name; },
        close: function () { return tmpobj.removeCallback(); }
    };
}
function getGoogleImage(input, dir) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (!CID || !GOOGLE_IMAGE_SEARCH) {
                throw ("Google Images API key not configured!");
            }
            return [2 /*return*/, callGoogleAPI(input)
                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var images, img, i, uri, err_1, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                images = response.data.items;
                                img = images[0];
                                i = 1;
                                while (img.fileFormat != 'image/jpeg' && i < 10) {
                                    img = images[i];
                                    i++;
                                }
                                uri = path.join(dir, 'tmp.jpg');
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 6, , 7]);
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, downloadImage(img.link, uri)];
                            case 3:
                                uri = _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                err_1 = _a.sent();
                                console.log(err_1);
                                return [3 /*break*/, 5];
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                err_2 = _a.sent();
                                console.log(err_2);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/, uri];
                        }
                    });
                }); })
                    .catch(function (err) {
                    console.log(err);
                })];
        });
    });
}
module.exports = {
    getGoogleImage: getGoogleImage,
    initImageDir: initImageDir
};
