"use strict";
var core_1 = require("@neuroviewer/core");
/**
*  SWCParser class
*  Reads a SWC FILE and produces a Neuron
*/
var JSONParser = (function () {
    function JSONParser() {
    }
    JSONParser.prototype.readAsync = function (id, data, cb) {
        if (typeof data == "string" || data instanceof String) {
            // Convert to JSON
            this.process(id, JSON.parse(data));
        }
        else {
            this.process(id, data);
        }
        cb(this.neuron, this.error);
    };
    ;
    JSONParser.prototype.readSync = function (id, data) {
        if (typeof data == "string" || data instanceof String) {
            // Convert to JSON
            this.process(id, JSON.parse(data));
        }
        else {
            this.process(id, data);
        }
        return this.error;
    };
    ;
    JSONParser.prototype.initializeNeuron = function (id) {
        this.neuron = new core_1.Neuron(id);
    };
    JSONParser.prototype.process = function (id, data) {
        // Create empty neuron
        this.initializeNeuron(id);
        try {
            this.neuron = core_1.Neuron.fromObject(data);
        }
        catch (e) {
            this.error = e;
        }
    };
    return JSONParser;
}());
exports.JSONParser = JSONParser; // End JSON PARSER
//# sourceMappingURL=JSONParser.js.map