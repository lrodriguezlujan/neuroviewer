"use strict";
var core_1 = require("@neuroviewer/core");
;
/**
*  SWCReader class
*  Reads a SWC FILE and produces a Reconstruction
*/
var SWCParser = (function () {
    /**
     * Empty constructor
     */
    function SWCParser() {
    }
    /**
     * SWC Read function
     * @param  {string} data SWC File as a single string
     * @param  {fn}  cb   Callback function
     * @return {Reconstruction}  Single neuron reconstruction object
     */
    SWCParser.prototype.read = function (data, cb) {
        // Split the data in lines and process it line by line
        this.process(data.split(/\r\n|\n/));
        // Call the callback function
        if (cb)
            cb(this.rec, this.error);
        // Return the reconstruction
        return this.rec;
    };
    ;
    /**
     * Creates an empty neuron with given id
     * @param  {string} id Neuron id
     */
    SWCParser.prototype.initializeNeuron = function (id) {
        this.neuron = new core_1.Neuron(id);
    };
    /**
     * Process a SWC file as an array of lines and creates a Reconstruction object
     * @param  {Array<string>} data SWC file data (line by line)
     */
    SWCParser.prototype.process = function (data) {
        // Create empty neuron
        this.initializeNeuron("");
        // Initialize array
        this.tmpArray = [];
        try {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var line = data_1[_i];
                // Remove spaces
                line.trim();
                if (SWCParser.isHeader(line)) {
                    // Process as header line (process properties)
                    this.processHeader(line);
                }
                else {
                    // Process data line
                    this.processData(line);
                }
            }
            // Create Neurites
            this.createNeurites();
            // Fill soma
            this.addSoma();
            // Put neuron in the rec
            this.rec = new core_1.Reconstruction();
            this.rec.addNeuron(this.neuron);
        }
        catch (e) {
            this.error = e;
        }
    };
    /**
     * Checks if the given string is a header line
     * @param  {string} s Trimmed imput stream
     * @return {bool}   True if string is a header line
     */
    SWCParser.isHeader = function (s) {
        return s[0] == '#';
    };
    /**
     * Process a SWC header line, extracting any matching property
     * @param  {string} s Header line
     */
    SWCParser.prototype.processHeader = function (s) {
        // Remove leading #
        var tmp = s.slice(1);
        tmp.trim();
        // Split by whitespace and/or tabs
        var fields = s.split(/\s+/);
        // We have something to process
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
    /**
     * Process a data line and stores the node in a temporal array
     * @param  {string} s Data line
     */
    SWCParser.prototype.processData = function (s) {
        s.trim();
        var fields = s.split(/\s+/);
        // Get node fields
        var id = parseInt(fields[0]);
        var type = parseInt(fields[1]);
        var x = parseFloat(fields[2]);
        var y = parseFloat(fields[3]);
        var z = parseFloat(fields[4]);
        var d = parseFloat(fields[5]);
        var parent = parseInt(fields[6]);
        // Store by id
        this.tmpArray[id] = {
            type: core_1.Neurite.neuriteTypeFromNumber(type),
            node: new core_1.Node3D(x, y, z, d / 2, id),
            parent: parent,
            descCount: 0
        };
    };
    /**
     * Updates the desc count of the nodes in the temporal array
     */
    SWCParser.prototype.countDescs = function () {
        for (var _i = 0, _a = this.tmpArray; _i < _a.length; _i++) {
            var el = _a[_i];
            // For each node we increment the desc count of the parent node
            if (el && el.parent != -1)
                this.tmpArray[el.parent].descCount++;
        }
    };
    /**
     * Creates the neurites based on the temporal array nodes
     */
    SWCParser.prototype.createNeurites = function () {
        // Temporal branch storage
        this.tmpBranches = {};
        // Update descount
        this.countDescs();
        // For each node...
        for (var _i = 0, _a = this.tmpArray; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el) {
                // If its not a soma node and has 0 or more than 1 descs
                // is the last node of a branch...
                if (el.descCount != 1 && el.type != core_1.NeuriteType.soma) {
                    // Create a branch with terminal node el
                    var b = this.buildBranch(el);
                    var id = void 0;
                    // Get root node id to index the branches
                    if (b.rootID() == -1) {
                        id = b.nodeID(0);
                    }
                    else {
                        id = b.rootID();
                    }
                    // Store the branches by id
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
            // Find a root and then rebuild the rest of the branches
            if (el) {
                if (el.parent == -1 || el.type == core_1.NeuriteType.soma) {
                    // This is a root
                    if (this.tmpBranches[el.node.id]) {
                        for (var _d = 0, _e = this.tmpBranches[el.node.id]; _d < _e.length; _d++) {
                            var br = _e[_d];
                            // Build a neurite with root branch br
                            if (el.type != core_1.NeuriteType.soma)
                                this.buildNeurite(br, el.type);
                            else
                                this.buildNeurite(br, this.tmpArray[br.nodeID(0)].type);
                        }
                    }
                }
            }
        }
    };
    /**
     * Creates a branch with last node el. It goes backwards until
     * it finds a node with more than one desc, a soma node o a node with no parent
     * @param  {SWCDataRow} el Last node element
     * @return {Branch}
     */
    SWCParser.prototype.buildBranch = function (el) {
        // Single node branch
        if (el.parent == -1) {
            return new core_1.Branch([], el.node, [el.node]);
        }
        // Branch nodes
        var nodes = [el.node];
        // Current candidate
        var i = this.tmpArray[el.parent];
        // Go "upwards" untill we find a root node
        while (i.descCount != 2 && i.type != core_1.NeuriteType.soma && i.parent != -1) {
            nodes.push(i.node);
            i = this.tmpArray[i.parent];
        }
        // Specal case : Orphan (not attached to soma)
        if (i.parent == -1) {
            nodes.push(i.node);
        }
        // Reverse the order of the nodes to match the real order
        nodes.reverse();
        // Create the branch
        return new core_1.Branch([], i.node, nodes);
    };
    /**
     * Creates a neurite with root branch b and adds it to the neuron
     * @param  {Branch}      b    Root branch
     * @param  {NeuriteType} type Neurite type
     */
    SWCParser.prototype.buildNeurite = function (b, type) {
        // Create an empty neurite
        var neurite = new core_1.Neurite(this.neuron.neuriteCount(), type, undefined, this.neuron);
        // Set branch neuirte reference
        b.neurite = neurite;
        // Attach branches (this creates the structure)
        this.attachBranches(b);
        // Add neurite root
        neurite.setRoot(b);
        // Update branch ids
        neurite.reassignBranchIds();
        // Add to neuron
        this.neuron.addNeurite(neurite);
    };
    /**
     * Given a branch looks for its daughter branches and attach them recursively
     * @param  {Branch} b Current branch
     */
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
    /**
     * Sets the neuron soma
     */
    SWCParser.prototype.addSoma = function () {
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