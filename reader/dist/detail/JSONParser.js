"use strict";
var core_1 = require("@neuroviewer/core");
/**
*  SWCParser class
*  Reads a SWC FILE and produces a Reconstruction
*/
var JSONParser = (function () {
    function JSONParser() {
    }
    JSONParser.prototype.readAsync = function (data, cb) {
        if (typeof data == "string" || data instanceof String) {
            // Convert to JSON
            this.process(JSON.parse(data));
        }
        else {
            this.process(data);
        }
        cb(this.rec, this.error);
    };
    ;
    JSONParser.prototype.readSync = function (data) {
        if (typeof data == "string" || data instanceof String) {
            // Convert to JSON
            this.process(JSON.parse(data));
        }
        else {
            this.process(data);
        }
        return this.error;
    };
    ;
    JSONParser.prototype.initialize = function () {
        this.rec = new core_1.Reconstruction();
    };
    JSONParser.prototype.process = function (data) {
        // Create empty neuron
        this.initialize();
        try {
            this.rec = core_1.Reconstruction.fromObject(data);
        }
        catch (e) {
            this.error = e;
        }
    };
    return JSONParser;
}());
exports.JSONParser = JSONParser; // End JSON PARSER
//# sourceMappingURL=JSONParser.js.map