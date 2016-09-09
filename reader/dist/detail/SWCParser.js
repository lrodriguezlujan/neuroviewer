"use strict";
var core_1 = require("@neuroviewer/core");
;
/**
*  SWCReader class
*  Reads a SWC FILE and produces a Neuron
*/
var SWCParser = (function () {
    function SWCParser() {
    }
    SWCParser.prototype.readAsync = function (id, data, cb) {
        this.process(id, data.split(/\r\n|\n/));
        cb(this.neuron, this.error);
        /*let self = this;
        $.ajax({
          type: "GET",
          url: this.url,
          dataType: "text",
          success: function(data){
            self.process(data.split(/\r\n|\n/));
            cb(self.neuron,self.error);
          },
          error: function(e){
            // ADD CORS MSG
          }
        })*/
    };
    ;
    SWCParser.prototype.readSync = function (id, data) {
        /*let self = this;
        $.ajax({
          type: "GET",
          url: this.url,
          dataType: "text",
          success: function(data){
            self.process(data.split(/\r\n|\n/)); // Process array of lines
          },
          error: function(e){
            // ADD CORS MSG
          },
          async: false
        });*/
        this.process(id, data.split(/\r\n|\n/));
        return this.error;
    };
    ;
    SWCParser.prototype.initializeNeuron = function (id) {
        this.neuron = new core_1.Neuron(id);
    };
    SWCParser.prototype.process = function (id, data) {
        // Create empty neuron
        this.initializeNeuron(id);
        // Initialize array
        this.tmpArray = [];
        try {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var line = data_1[_i];
                line.trim();
                if (SWCParser.isHeader(line)) {
                    this.processHeader(line);
                }
                else {
                    this.processData(line);
                }
            }
            // Create Neurites
            this.createNeurites();
            // Fill soma
            this.addSoma();
        }
        catch (e) {
            this.error = e;
        }
    };
    // s should be trimmed
    SWCParser.isHeader = function (s) {
        return s[0] == '#';
    };
    SWCParser.prototype.processHeader = function (s) {
        // Remove leading #
        var tmp = s.slice(1);
        tmp.trim();
        // Split by whitespace and/or tabs
        var fields = s.split(/\s+/);
        if (fields.length > 0) {
            // Find in prop keys
            if (SWCParser.property_keys.indexOf(fields[0]) > -1) {
                // Create a neuron property and insert it.
                if (fields.length == 1)
                    // Empty
                    this.neuron.addProperty(fields[0]);
                else {
                    // Join remaining fields - using string by def.
                    this.neuron.addProperty(fields[0], fields.slice(1).join(" "));
                }
            }
        }
    };
    SWCParser.prototype.processData = function (s) {
        s.trim();
        var fields = s.split(/\s+/);
        var id = parseInt(fields[0]);
        var type = parseInt(fields[1]);
        var x = parseFloat(fields[2]);
        var y = parseFloat(fields[3]);
        var z = parseFloat(fields[4]);
        var d = parseFloat(fields[5]);
        var parent = parseInt(fields[6]);
        this.tmpArray[id] = {
            type: core_1.Neurite.neuriteTypeFromNumber(type),
            node: new core_1.Node3D(x, y, z, d / 2, id),
            parent: parent,
            descCount: 0
        };
        // Neuron is ready
    };
    SWCParser.prototype.countDescs = function () {
        for (var _i = 0, _a = this.tmpArray; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el && el.parent != -1)
                this.tmpArray[el.parent].descCount++;
        }
    };
    SWCParser.prototype.createNeurites = function () {
        this.tmpBranches = {};
        // Count descendants
        this.countDescs();
        for (var _i = 0, _a = this.tmpArray; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el) {
                if (el.descCount != 1 && el.type != core_1.NeuriteType.soma) {
                    var b = this.buildBranch(el);
                    var id = void 0;
                    if (b.rootID() == -1) {
                        id = b.nodeID(0);
                    }
                    else {
                        id = b.rootID();
                    }
                    if (!this.tmpBranches[id]) {
                        this.tmpBranches[id] = [b];
                    }
                    else {
                        this.tmpBranches[id].push(b);
                    }
                }
            }
        }
        // Now look for root branches to create neurites
        for (var _b = 0, _c = this.tmpArray; _b < _c.length; _b++) {
            var el = _c[_b];
            // Root candidate
            if (el) {
                if (el.parent == -1 || el.type == core_1.NeuriteType.soma) {
                    if (this.tmpBranches[el.node.id]) {
                        for (var _d = 0, _e = this.tmpBranches[el.node.id]; _d < _e.length; _d++) {
                            var br = _e[_d];
                            this.buildNeurite(br, el.type);
                        }
                    }
                }
            }
        }
    };
    SWCParser.prototype.buildBranch = function (el) {
        if (el.parent == -1) {
            return new core_1.Branch([], el.node, [el.node]);
        }
        var nodes = [el.node];
        var i = this.tmpArray[el.parent];
        while (i.descCount != 2 && i.type != core_1.NeuriteType.soma && i.parent != -1) {
            nodes.push(i.node);
            i = this.tmpArray[i.parent];
        }
        // Specal case : Orphan (not attached to soma)
        if (i.parent == -1) {
            nodes.push(i.node);
        }
        nodes.reverse();
        return new core_1.Branch([], i.node, nodes);
    };
    SWCParser.prototype.buildNeurite = function (b, type) {
        var neurite = new core_1.Neurite(this.neuron.neuriteCount(), type, undefined, this.neuron);
        b.neurite = neurite;
        // Attach
        this.attachBranches(b);
        // Add root
        neurite.setRoot(b);
        // Update ids
        neurite.reassignBranchIds();
        // Add to neuron
        this.neuron.addNeurite(neurite);
    };
    SWCParser.prototype.attachBranches = function (b) {
        var lastID = b.nodeID(b.size() - 1);
        if (this.tmpBranches[lastID]) {
            for (var _i = 0, _a = this.tmpBranches[lastID]; _i < _a.length; _i++) {
                var br = _a[_i];
                b.appendBranch(br); // This should b b4 to set neurite property
                this.attachBranches(br);
            }
        }
    };
    SWCParser.prototype.addSoma = function () {
        //constructor( nodes:Array<Node3D>, public isContour = false,  m?:MaterialPaletteElement )
        var nodes = [];
        for (var _i = 0, _a = this.tmpArray; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el) {
                if (el.type == core_1.NeuriteType.soma) {
                    nodes.push(el.node);
                }
            }
        }
        var soma = new core_1.Soma(nodes);
        this.neuron.setSoma(soma);
    };
    // Metadata property keys
    SWCParser.property_keys = [
        "original_source", "creature", "region", "field", "layer", "field/layer",
        "type", "contributor", "reference", "raw", "extras", "soma_area",
        "shrinkage_correction", "version_number", "version_date", "scale"
    ];
    return SWCParser;
}());
exports.SWCParser = SWCParser;
//# sourceMappingURL=SWCParser.js.map