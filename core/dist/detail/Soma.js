"use strict";
var Node3D_1 = require("./Node3D");
var Status_1 = require("./Status");
;
/**
 * Soma model class
 */
var Soma = (function () {
    /**
     * Soma constructor
     *
     * @param  {Array<Node3D>} nodes Nodes that are part of the soma
     * @param  {bool} isContour Are the nodes part of the contour of the soma? (default: false)
     * @param  {MaterialPaletteElement} m Soma material element (optional)
     */
    function Soma(nodes, isContour, mat) {
        if (isContour === void 0) { isContour = false; }
        this.isContour = isContour;
        this.mat = mat;
        this.status = Status_1.Status.none; // Default status: none
        // IF soma is contour we need to compute the convex hull
        if (isContour) {
            this.convexHull3D(nodes);
        }
        else {
            this.nodes = nodes;
        }
    }
    /**
     * Changes soma material
     *
     * @param  {MaterialPaletteElement} m New soma material
     */
    Soma.prototype.setMaterial = function (m) {
        this.mat = m;
        this.updateMaterial();
    };
    /**
     * Looks for the given node in the soma
     *
     * @param  {number} nodeId Node identifier
     * @return {Node3D}
     */
    Soma.prototype.searchNode = function (nodeId) {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.id == nodeId)
                return this;
        }
        return null;
    };
    /**
     * Changes soma status
     *
     * @param  {type} s: Status description
     */
    Soma.prototype.setStatus = function (s) {
        this.status = s;
        this.updateMaterial();
    };
    /**
     * Returns the i-th node in the soma
     *
     * @param  {number} node index
     * @return {Node3D}
     */
    Soma.prototype.node = function (i) {
        return this.nodes[i];
    };
    /**
     * Updates soma mesh material
     *
     */
    Soma.prototype.updateMaterial = function () {
        if (this.mesh) {
            this.mesh.material = Status_1.materialPicker(this.mat, this.status);
            this.mesh.material.markDirty();
        }
    };
    /**
     * Draws the soma in the drawer
     *
     * @param  {Drawer} drawer drawer class
     */
    Soma.prototype.draw = function (drawer) {
        this.enabled = true;
        if (this.mesh) {
            this.mesh.dispose();
        }
        if (this.isContour) {
        }
        else {
            // Just draw spheres and merge them
            var meshes = [];
            for (var i = 0; i < this.nodes.length; ++i) {
                meshes.push(drawer.drawSphere("S" + this.nodes[i].id, this.nodes[i], this.nodes[i].r));
            }
            // Merge
            this.mesh = drawer.merge(meshes);
        }
        // Set mesh material
        this.mesh.material = Status_1.materialPicker(this.mat, this.status);
    };
    Soma.prototype.isEnabled = function () {
        return this.enabled;
    };
    Soma.prototype.setEnabled = function (v, recursive) {
        if (recursive === void 0) { recursive = false; }
        this.enabled = v;
        if (this.mesh) {
            this.mesh.setEnabled(v);
        }
    };
    /**
     * Computes the convex hull of the given contour nodes
     *
     * @param  {Array<Node3D>} nodes Soma contour
     */
    Soma.prototype.convexHull3D = function (nodes) {
        // TODO
        this.nodes = nodes;
    };
    /**
     * Creates a soma class from a JS object
     *
     * @param  {SomaJSON} obj             JS object
     * @param  {MaterialPaletteElement} m Material element
     * @return {Soma}
     */
    Soma.fromObject = function (obj) {
        // Create nodes
        var nodes;
        nodes = [];
        for (var _i = 0, _a = obj.nodes; _i < _a.length; _i++) {
            var n = _a[_i];
            nodes.push(Node3D_1.Node3D.fromObj(n));
        }
        // Check contour property
        var isContour = false;
        if (obj.isContour)
            isContour = true;
        return new Soma(nodes, isContour);
    };
    return Soma;
}());
exports.Soma = Soma; // End soma class
//# sourceMappingURL=Soma.js.map