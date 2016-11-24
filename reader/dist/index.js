"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var SWCParser_1 = require("./detail/SWCParser");
var JSONParser_1 = require("./detail/JSONParser");
/**
 * Simple function that returns a parser based on the file extension
 * @param  {string}          ext File extension
 * @return {ParserInterface}     Parser
 */
function parserByFileExtension(ext) {
    var low = ext.toLowerCase();
    switch (low) {
        case "swc": return new SWCParser_1.SWCParser();
        case "json": return new JSONParser_1.JSONParser();
        default: return null;
    }
}
exports.parserByFileExtension = parserByFileExtension;
__export(require("./detail/SWCParser"));
__export(require("./detail/JSONParser"));
//# sourceMappingURL=index.js.map