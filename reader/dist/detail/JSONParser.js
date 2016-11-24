"use strict";
var core_1 = require("@neuroviewer/core");
/**
*  SWCParser class
*  Reads a SWC FILE and produces a Reconstruction
*/
var JSONParser = (function () {
    function JSONParser() {
    }
    /**
     * JSON Read function
     * @param  {ReconstructionJSON |  string}      data Reconstruction JSON object or a JSON string
     * @param  {fn}                 cb Callback function (Reconstruction,error)
     * @return {Reconstruction}                   Reconstruction object
     */
    JSONParser.prototype.read = function (data, cb) {
        if (typeof data == "string" || data instanceof String) {
            // Convert to JSON
            this.process(JSON.parse(data));
        }
        else {
            this.process(data);
        }
        // Call the callback function
        if (cb)
            cb(this.rec, this.error);
        // Return
        return this.rec;
    };
    ;
    /**
     * Initializes the reconstruction (Creates an empty one)
     * @return {void}
     */
    JSONParser.prototype.initialize = function () {
        this.rec = new core_1.Reconstruction();
    };
    /**
     * Process the JSON data and creates a reconstruction
     * @param  {ReconstructionJSON} data JSON data
     * @return {Reconstruction} Neuron reconstruction
     */
    JSONParser.prototype.process = function (data) {
        // Create empty neuron
        this.initialize();
        try {
            // Just creates an object from the json
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