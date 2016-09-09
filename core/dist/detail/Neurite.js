"use strict";
var Branch_1 = require("./Branch");
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
    Neurite.prototype.draw = function (drawer) {
        if (this.firstBranch)
            this.firstBranch.draw(drawer, true);
    };
    /**
     * Executes a function for each element in the neurite
     */
    Neurite.prototype.forEachElement = function (fn) {
        if (this.firstBranch)
            this.firstBranch.forEachElement(fn, true);
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
    Neurite.prototype.updateMaterial = function (mat) {
        this.material = mat;
        if (this.firstBranch) {
            this.firstBranch.updateMaterial(true);
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
        this.firstBranch.setStatus(status, propagate);
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
        if (this.firstBranch)
            this.firstBranch.dispose(true);
    };
    return Neurite;
}());
exports.Neurite = Neurite; // Neurite class end
//# sourceMappingURL=Neurite.js.map