"use strict";
var Node3D_1 = require("./Node3D");
var Status_1 = require("./Status");
/**
 * @summary Branch element definition
 *
 * @desc Each of the elements of a branch. Has an status, contains a node and a reference to
 * meshes associated with it.
 *
 * @public
 */
var BranchElement = (function () {
    /**
     * Branch element constructor
     *
     * @param  {number} index Node poisition in the branch
     * @param  {Node3D} node Node3D that marks the segment target point
     * @param  {Node3D} prevNode Previous node (root point in the segment)
     * @param  {Branch} branch Parent branch
     *
     * @public
     */
    function BranchElement(index, node, prevNode, branch) {
        this.index = index;
        this.node = node;
        this.prevNode = prevNode;
        this.branch = branch;
        this.drawn = false;
        this.status = Status_1.Status.none;
    }
    /**
     * Draws the BranchElement in the given drawer
     *
     * @desc The node is drawn as a sphere. The segment is drawn as a cylinder.
     *
     * @param  {Drawer} drawer class
     * @public
     */
    BranchElement.prototype.draw = function (drawer) {
        // Create node
        this.nodeMesh = drawer.drawSphere("N" + this.node.id + "@" + this.branch.idString() + "@" + this.branch.neurite.id, this.node, this.node.r);
        // Create segment
        this.segmentMesh = drawer.drawCylinder("C" + this.node.id + "@" + this.branch.idString() + "}@" + this.branch.neurite.id, this.prevNode, this.node, this.prevNode.r, this.node.r);
        this.drawn = true;
        // Set materials wrt status
        this.updateMaterial();
    };
    /**
     * Changes the element status and updates the material in the meshes
     *
     * @param  {Status} status New element status
     *
     * @public
     */
    BranchElement.prototype.setStatus = function (status) {
        this.status = status;
        this.updateMaterial();
    };
    /**
     * Updates mesh material based on the status
     *
     * @private
     */
    BranchElement.prototype.updateMaterial = function () {
        if (this.drawn && this.branch && this.branch.neurite) {
            var mat = void 0;
            if (this.branch.neurite.material != null) {
                switch (this.status) {
                    case Status_1.Status.none:
                        mat = this.branch.neurite.material.standard;
                        break;
                    case Status_1.Status.invisible:
                        mat = this.branch.neurite.material.hidden;
                        break;
                    case Status_1.Status.selected:
                        mat = this.branch.neurite.material.emmisive;
                        break;
                    case Status_1.Status.hidden:
                        mat = this.branch.neurite.material.disminished;
                        break;
                    case Status_1.Status.highlighted:
                        mat = this.branch.neurite.material.highlight;
                        break;
                }
            }
            else {
                mat = null;
            }
            this.nodeMesh.material = mat;
            this.segmentMesh.material = mat;
        }
    };
    /**
     * Frees resources
     *
     * @public
     */
    BranchElement.prototype.dispose = function () {
        if (this.nodeMesh)
            this.nodeMesh.dispose();
        if (this.segmentMesh)
            this.segmentMesh.dispose();
    };
    return BranchElement;
}());
exports.BranchElement = BranchElement; // Branch element class end
/**
 * Branch class
 */
var Branch = (function () {
    /**
     * Branch constructor method
     *
     * @param  {Array<number>} id Numeric array that identifies the branch
     * @param  {Node3D} root Root node
     * @param  {Array<Node3D>} nodes Array of nodes that are part of the branch
     * @param  {Branch} branch Previous branch (optional)
     * @param  {Neurite} neurite Parent neurite (optional)
     */
    function Branch(id, root, nodes, parent, neurite) {
        this.id = id;
        this.root = root;
        this.parent = parent;
        this.neurite = neurite;
        // Initialize children
        this.children = [];
        // Create Branch elements
        this.nodes = [];
        // First node is special (root)
        this.nodes.push(new BranchElement(1, nodes[0], root, this));
        // Now continue
        for (var i = 1; i < nodes.length; ++i) {
            this.nodes.push(new BranchElement(i + 1, nodes[i], nodes[i - 1], this));
        }
        this.status = Status_1.Status.none;
    }
    /**
     * Returns the id of the root node. -1  if it does not exist.
     *
     * @return {number} Root ID
     */
    Branch.prototype.rootID = function () {
        if (this.root)
            return this.root.id;
        else
            return -1;
    };
    /**
     * Returns the id of the i-th node
     *
     * @param  {number} i Node index
     * @return {number} node ID.
     */
    Branch.prototype.nodeID = function (i) {
        return this.nodes[i].node.id;
    };
    /**
     * Returns the node whose ID is nodeId (or null)
     *
     * @param  {number} nodeId lookup id
     * @return {Node3D}
     */
    Branch.prototype.searchNode = function (nodeId) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.node.id == nodeId)
                return n;
        }
        if (this.children) {
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var c = _c[_b];
                var res = c.searchNode(nodeId);
                if (res != null)
                    return res;
            }
        }
        return null;
    };
    /**
     * Executes a function for each element in the branch
     */
    Branch.prototype.forEachElement = function (fn, recursive) {
        if (recursive === void 0) { recursive = true; }
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var n = _a[_i];
            fn(n);
        }
        if (this.children && recursive) {
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var c = _c[_b];
                c.forEachElement(fn, true);
            }
        }
    };
    /**
     * Number of nodes in the branch (excluding the root)
     *
     * @return {number} Node count
     */
    Branch.prototype.size = function () {
        return this.nodes.length;
    };
    /**
     *  Branch id as a string
     *
     * @return {string}  Branch id as string
     */
    Branch.prototype.idString = function () {
        var idstr = "";
        idstr += this.id[0];
        for (var i = 1; i < this.id.length; ++i)
            idstr += "_" + this.id[i];
        return idstr;
    };
    /**
     * Update the id of the branch and its descendants
     *
     * @param  {Array<number>} id new ID
     */
    Branch.prototype.updateID = function (id) {
        this.id = id.slice(0);
        if (this.children) {
            for (var i = 0; i < this.children.length; ++i) {
                var chID = id.slice(0);
                chID.push(i + 1);
                this.children[i].updateID(chID);
            }
        }
    };
    /**
     * Updates the material of every element
     *
     */
    Branch.prototype.updateMaterial = function (recursive) {
        if (recursive === void 0) { recursive = true; }
        if (this.neurite) {
            this.forEachElement(function (it) { return it.updateMaterial(); }, recursive);
        }
    };
    /**
     * Changes the status of the branch
     *
     * @param  {Status} status new status
     * @param  {bool} propagate Should status be propagated to nodes and children? (default  = true)
     */
    Branch.prototype.setStatus = function (status, propagate) {
        if (propagate === void 0) { propagate = true; }
        this.status = status;
        if (propagate)
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var el = _a[_i];
                el.setStatus(status);
                if (this.children) {
                    for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                        var c = _c[_b];
                        c.setStatus(status, propagate);
                    }
                }
            }
    };
    /**
     * Draws the branch and its elements in the given Drawer
     *
     * @param  {Drawer} drawer Class that draws the branch
     * @param  {bool} recursive Should branch descendants be drawn? (default: true)
     */
    Branch.prototype.draw = function (drawer, recursive) {
        if (recursive === void 0) { recursive = false; }
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var el = _a[_i];
            el.draw(drawer);
        }
        if (recursive) {
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var ch = _c[_b];
                ch.draw(drawer, true);
            }
        }
    };
    /**
     * Draws branch root
     *
     * @param  {Drawer} drawer Class that draws the branch
     */
    Branch.prototype.drawRoot = function (drawer) {
        this.rootMesh = drawer.drawSphere("N0@" + this.idString(), this.root, this.root.r);
    };
    /**
     * Set given branch as child of the current branch
     *
     * @param  {b} b branch to be set as child
     */
    Branch.prototype.appendBranch = function (b) {
        b.parent = this;
        b.neurite = this.neurite;
        b.root = this.nodes[this.nodes.length - 1].node; // Set child. branch root
        this.children.push(b);
    };
    Branch.prototype.dispose = function (recursive) {
        if (recursive === void 0) { recursive = true; }
        if (this.rootMesh)
            this.rootMesh.dispose();
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var el = _a[_i];
            el.dispose();
        }
        if (recursive) {
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var ch = _c[_b];
                ch.dispose(true);
            }
        }
    };
    /**
     * Creates a branch from the given object
     *
     * @param  {Array<number>} id  Branch ID
     * @param  {BranchJSON} obj JS object
     * @param  {Neurite} neurite parent neurite (optional)
     * @return {Branch}
     */
    Branch.fromObject = function (id, obj, neurite) {
        // Create nodes
        var root = Node3D_1.Node3D.fromObj(obj.root);
        var nodes;
        nodes = [];
        for (var _i = 0, _a = obj.nodes; _i < _a.length; _i++) {
            var n = _a[_i];
            nodes.push(Node3D_1.Node3D.fromObj(n));
        }
        // Create Branch and their descs
        var branch = new Branch(id, root, nodes);
        if (neurite)
            branch.neurite = neurite;
        // Process its descendants
        if (obj.children) {
            for (var i = 0; i < obj.children.length; ++i) {
                // Children id
                var chID = id.slice(0);
                chID.push(i + 1);
                branch.appendBranch(Branch.fromObject(chID, obj.children[i], neurite));
            }
        }
        return branch;
    };
    return Branch;
}());
exports.Branch = Branch;
//# sourceMappingURL=Branch.js.map