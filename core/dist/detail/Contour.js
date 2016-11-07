"use strict";
var Status_1 = require("./Status");
;
/**
 * Soma model class
 */
var Contour = (function () {
    /**
     * Contour constructor
     *
     * @param  {Array<Point3D>} nodes Nodes that are part of the soma
     * @param  {MaterialPaletteElement} m material element (optional)
     */
    function Contour(points) {
        this.points = points;
        this.status = Status_1.Status.none; // Default status: none
        this.name = "";
        this.face_color = "#ffffff";
        this.back_color = "#000000";
        this.closed = false;
        this.fill = 0;
        this.resolution = 1;
    }
    Contour.prototype.size = function () {
        return this.points.length;
    };
    /**
     * Changes status
     *
     * @param  {type} s: Status description
     */
    Contour.prototype.setStatus = function (s) {
        this.status = s;
        this.updateColor();
    };
    Contour.prototype.updateColor = function () {
        if (this.drawer) {
            if (this.status == Status_1.Status.highlighted) {
                this.mesh.color = this.drawer.colorFormHex("#FFFF00");
            }
            else {
                this.mesh.color = this.drawer.colorFormHex(this.face_color);
            }
        }
    };
    /**
     * Returns the i-th point in the contour
     *
     * @param  {number} node index
     * @return {Point3D}
     */
    Contour.prototype.node = function (i) {
        return this.points[i];
    };
    /**
     * Draws the contour in the drawer
     *
     * @param  {Drawer} drawer drawer class
     */
    Contour.prototype.draw = function (drawer) {
        if (this.mesh)
            this.mesh.dispose();
        this.drawer = drawer;
        // Just draw spheres and merge them
        this.enabled = true;
        this.mesh = drawer.drawContour(this.points, this.closed, this.face_color, this.back_color, this.fill);
    };
    Contour.prototype.isEnabled = function () {
        return this.enabled;
    };
    Contour.prototype.setEnabled = function (v) {
        this.enabled = v;
        if (this.mesh) {
            this.mesh.setEnabled(v);
        }
    };
    Contour.prototype.dispose = function () {
        this.enabled = false;
        this.mesh.dispose();
    };
    /**
     * Creates a soma class from a JS object
     *
     * @param  {ContourJSON} obj             JS object
     * @return {Contour}
     */
    Contour.fromObject = function (obj) {
        // Create base contour
        var c = new Contour(obj.points);
        // Set properties
        c.name = obj.name;
        c.face_color = obj.face_color;
        c.back_color = obj.back_color;
        c.closed = obj.closed;
        c.fill = obj.fill;
        c.resolution = obj.resolution;
        // Return contour
        return c;
    };
    return Contour;
}());
exports.Contour = Contour; // End soma class
//# sourceMappingURL=Contour.js.map