"use strict";
var Branch_1 = require("./Branch");
var Status_1 = require("./Status");
/**
 * Neurite Type enum
 */
(function (NeuriteType) {
    NeuriteType[NeuriteType["dendrite"] = 0] = "dendrite";
    NeuriteType[NeuriteType["apical"] = 1] = "apical";
    NeuriteType[NeuriteType["axon"] = 2] = "axon";
    NeuriteType[NeuriteType["unknown"] = 3] = "unknown";
    NeuriteType[NeuriteType["soma"] = 4] = "soma";
})(exports.NeuriteType || (exports.NeuriteType = {}));
var NeuriteType = exports.NeuriteType;
/**
 * Neurite model class
 */
var Neurite = (function () {
    /**
     * Neurite constructor
     *
     * @param  {number} id Neurite numeric id
     * @param  {NeuriteTye} type Neurite type id
     * @param  {MaterialPaletteElement} material Neurite assigned material element
     * @param  {Neuron} neuron      Parent neuron
     */
    function Neurite(id, type, material, neuron) {
        this.id = id;
        this.type = type;
        this.material = material;
        this.neuron = neuron;
        this.singleLine = false;
        this.enabled = false;
        this.status = Status_1.Status.none;
    }
    /**
     * Changes neurite root branch
     *
     * @param  {Branch}  b Branch to be set as neurite root
     */
    Neurite.prototype.setRoot = function (b) {
        b.neurite = this;
        this.firstBranch = b;
    };
    /**
     * Draws the neurite
     *
     * @param  {Drawer} drawer Class that draws the neurite
     */
    Neurite.prototype.draw = function (drawer, linear) {
        if (linear === void 0) { linear = false; }
        this.enabled = true;
        this.singleLine = false;
        if (this.lineDrawObj)
            this.lineDrawObj.dispose();
        if (this.firstBranch)
            this.firstBranch.draw(drawer, true, linear);
    };
    Neurite.prototype.lineDraw = function (drawer) {
        this.enabled = true;
        this.singleLine = true;
        if (this.lineDrawObj)
            this.lineDrawObj.dispose();
        if (this.firstBranch) {
            this.firstBranch.dispose(true);
            // Get neurite as a line array
            var lines = this.firstBranch.asLineArray(true);
            var color = this.material.getStandardHexcolor();
            this.lineDrawObj = drawer.drawLines(lines, color);
        }
    };
    Neurite.prototype.getColor = function () {
        return this.material.getStandardHexcolor();
    };
    /**
     * Executes a function for each element in the neurite
     */
    Neurite.prototype.forEachElement = function (fn) {
        if (this.firstBranch)
            this.firstBranch.forEachElement(fn, true);
    };
    Neurite.prototype.branchCount = function () {
        if (this.firstBranch) {
            return this.firstBranch.subtreeSize();
        }
        else {
            return 0;
        }
    };
    Neurite.prototype.allBranches = function () {
        if (this.firstBranch) {
            return this.firstBranch.subtree();
        }
        else {
            return [];
        }
    };
    Neurite.prototype.isEnabled = function () {
        return this.enabled;
    };
    Neurite.prototype.setEnabled = function (v, recursive) {
        if (recursive === void 0) { recursive = false; }
        this.enabled = v;
        if (this.firstBranch) {
            this.firstBranch.setEnabled(v, true);
        }
        if (this.singleLine) {
            this.lineDrawObj.setEnabled(v);
        }
    };
    /**
     * Auxiliar method that translates int (SWC) to neurite type
     *
     * @param  {t} t numeric type id
     */
    Neurite.neuriteTypeFromNumber = function (t) {
        switch (t) {
            case 0: return NeuriteType.unknown;
            case 1: return NeuriteType.soma; // Soma in SWC
            case 2: return NeuriteType.axon; //
            case 3: return NeuriteType.dendrite;
            case 4: return NeuriteType.apical;
            default: return NeuriteType.unknown; // Anything else
        }
    };
    /**
     * Updates neurite material
     *
     * @param  {MaterialPaletteElement} mat New material
     */
    Neurite.prototype.updateMaterial = function (mat, propagate) {
        if (propagate === void 0) { propagate = true; }
        this.material = mat;
        if (!this.singleLine) {
            if (this.firstBranch && propagate) {
                this.firstBranch.updateMaterial(true);
            }
        }
        else {
            if (this.lineDrawObj) {
                this.lineDrawObj.color = this.neuron.getDrawer().colorFormHex(Status_1.materialColorPicker(this.material, this.status));
                this.lineDrawObj.material.markDirty();
            }
        }
    };
    /**
     * Changes the status
     *
     * @param  {Status} status new status
     * @param  {bool} propagate @see Branch.setStatus (default: true)
     */
    Neurite.prototype.setStatus = function (status, propagate) {
        if (propagate === void 0) { propagate = true; }
        this.status = status;
        if ((!this.singleLine) && this.firstBranch)
            this.firstBranch.setStatus(status, propagate);
        this.updateMaterial(this.material, false);
    };
    /**
     * Creates a new Neurite from a JS object
     *
     * @param  {NeuriteJSON} obj Object
     * @param  {MaterialPalette} pal Material palette to pick the element from
     */
    Neurite.fromObject = function (obj) {
        var type;
        type = Neurite.neuriteTypeFromNumber(obj.type);
        var n = new Neurite(obj.id, type);
        n.setRoot(Branch_1.Branch.fromObject([1], obj.tree, n));
        return n;
    };
    /**
     * Returns the node if it is present in the neurite
     *
     * @param  {number} nodeId Node ID
     * @return {Node3D}
     */
    Neurite.prototype.searchNode = function (nodeId) {
        return this.firstBranch.searchNode(nodeId);
    };
    /**
     * Standarizes branch Ids in the neurite
     *
     */
    Neurite.prototype.reassignBranchIds = function () {
        this.firstBranch.updateID([0]);
    };
    Neurite.prototype.dispose = function () {
        this.enabled = false;
        if (this.firstBranch)
            this.firstBranch.dispose(true);
        if (this.lineDrawObj)
            this.lineDrawObj.dispose();
    };
    return Neurite;
}());
exports.Neurite = Neurite; // Neurite class end
//# sourceMappingURL=Neurite.js.map