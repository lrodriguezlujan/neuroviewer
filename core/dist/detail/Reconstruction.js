"use strict";
var Contour_1 = require("./Contour");
var Neuron_1 = require("./Neuron");
;
/**
 * Neuron model class
 */
var Reconstruction = (function () {
    /**
     * Neuron constructor
     *
     * @param  {string} id Neuron unique name
     */
    function Reconstruction() {
        this.linearDrawing = false;
        this.singleElementDraw = false;
        this.drawNodeSpheres = true;
        this.neurons = [];
        this.properties = {};
        this.contours = [];
    }
    /**
     * Adds a neruon
     *
     * @param  {Neruon} n Neuron to add
     */
    Reconstruction.prototype.addNeuron = function (n) {
        n.reconstruction = this;
        this.neurons.push(n);
    };
    Reconstruction.prototype.attachDrawer = function (drawer) {
        if (this.drawer) {
            this.drawer.dispose();
        }
        this.drawer = drawer;
        for (var _i = 0, _a = this.neurons; _i < _a.length; _i++) {
            var n = _a[_i];
            n.attachDrawer(drawer);
        }
    };
    /**
     * Adds a property to the reconstruction
     *
     * @param  {string} key  Property name
     * @param  {any} value   Property value (optional)
     */
    Reconstruction.prototype.addProperty = function (key, value) {
        if (value)
            this.properties[key] = value;
        else
            this.properties[key] = [];
    };
    /**
     * Adds a new contour to the neuron
     *
     * @param {Contour} c Contour to be added
     */
    Reconstruction.prototype.addContour = function (c) {
        this.contours.push(c);
    };
    /**
     * Number of neurons in the reconstruction
     *
     */
    Reconstruction.prototype.neuronCount = function () {
        return this.neurons.length;
    };
    /**
     * Number of contours in the reconstruction
     *
     */
    Reconstruction.prototype.contourCount = function () {
        return this.contours.length;
    };
    /**
     * Search a node in the neuron by id
     *
     * @param  {number} nodeId   Node id number
     * @param  {number} neurite? Neurite id (optional)
     * @param  {bool} soma   Search only in the soma (default: false)
     * @return {Node3D}
     */
    Reconstruction.prototype.searchNode = function (nodeId, soma) {
        if (soma === void 0) { soma = false; }
        var ret;
        for (var _i = 0, _a = this.neurons; _i < _a.length; _i++) {
            var n = _a[_i];
            ret = n.searchNode(nodeId, null, soma);
            if (ret != null)
                return ret;
        }
        return null;
    };
    /**
     * Draws the neuron
     *
     */
    Reconstruction.prototype.draw = function () {
        if (this.singleElementDraw) {
            this.drawLinear();
        }
        else {
            // Draw each neuron
            if (this.neurons) {
                for (var _i = 0, _a = this.neurons; _i < _a.length; _i++) {
                    var n = _a[_i];
                    n.draw(this.linearDrawing);
                }
            }
            // Draw contours
            if (this.contours) {
                for (var _b = 0, _c = this.contours; _b < _c.length; _b++) {
                    var c = _c[_b];
                    c.draw(this.drawer);
                }
            }
        }
    };
    Reconstruction.prototype.drawLinear = function () {
        // Draw each neuron
        if (this.neurons) {
            for (var _i = 0, _a = this.neurons; _i < _a.length; _i++) {
                var n = _a[_i];
                n.drawLinear();
            }
        }
        // Draw contours
        if (this.contours) {
            for (var _b = 0, _c = this.contours; _b < _c.length; _b++) {
                var c = _c[_b];
                c.draw(this.drawer);
            }
        }
    };
    Reconstruction.prototype.dispose = function () {
        for (var _i = 0, _a = this.neurons; _i < _a.length; _i++) {
            var n = _a[_i];
            n.dispose();
        }
        for (var _b = 0, _c = this.contours; _b < _c.length; _b++) {
            var c = _c[_b];
            c.dispose();
        }
    };
    Reconstruction.prototype.forEachElement = function (fn) {
        for (var _i = 0, _a = this.neurons; _i < _a.length; _i++) {
            var n = _a[_i];
            n.forEachElement(fn);
        }
    };
    /**
     * Creates a neuron instance from a JS object
     *
     * @param  {type} obj : NeuronJSON      description
     * @param  {type} pal : MaterialPalette description
     * @return {type}                       description
     */
    Reconstruction.fromObject = function (obj) {
        var r = new Reconstruction();
        for (var _i = 0, _a = obj.neurons; _i < _a.length; _i++) {
            var neuron = _a[_i];
            r.addNeuron(Neuron_1.Neuron.fromObject(neuron));
        }
        if (obj.properties) {
            for (var key in obj.properties) {
                r.addProperty(key, obj.properties[key]);
            }
        }
        if (obj.contours) {
            for (var _b = 0, _c = obj.contours; _b < _c.length; _b++) {
                var c = _c[_b];
                r.addContour(Contour_1.Contour.fromObject(c));
            }
            // Sort reconstructions by name
            r.contours.sort(function (a, b) { if (a.name < b.name)
                return -1;
            else if (a.name == b.name)
                return 0;
            else
                return 1; });
        }
        return r;
    };
    return Reconstruction;
}());
exports.Reconstruction = Reconstruction;
//# sourceMappingURL=Reconstruction.js.map