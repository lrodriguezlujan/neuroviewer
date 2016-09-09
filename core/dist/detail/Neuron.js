"use strict";
var Soma_1 = require("./Soma");
var Neurite_1 = require("./Neurite");
;
/**
 * Neuron model class
 */
var Neuron = (function () {
    /**
     * Neuron constructor
     *
     * @param  {string} id Neuron unique name
     */
    function Neuron(id) {
        this.id = id;
        this.neurites = [];
        this.properties = {};
    }
    /**
     * Adds a neurite
     *
     * @param  {Neurite} n Neurite to add
     */
    Neuron.prototype.addNeurite = function (n) {
        n.neuron = this;
        this.neurites.push(n);
    };
    Neuron.prototype.attachDrawer = function (drawer) {
        if (this.drawer) {
            this.drawer.dispose();
        }
        this.drawer = drawer;
        // Update materials
        this.updateMaterials();
    };
    Neuron.prototype.updateMaterials = function () {
        if (this.soma) {
            this.soma.setMaterial(this.drawer.palette.grey());
        }
        if (this.neurites) {
            for (var _i = 0, _a = this.neurites; _i < _a.length; _i++) {
                var n = _a[_i];
                n.updateMaterial(this.drawer.palette.get(n.id));
            }
        }
    };
    /**
     * Adds a property to the neuron
     *
     * @param  {string} key  Property name
     * @param  {any} value   Property value (optional)
     */
    Neuron.prototype.addProperty = function (key, value) {
        if (value)
            this.properties[key] = value;
        else
            this.properties[key] = [];
    };
    /**
     * Number of neurites in the neuron
     *
     */
    Neuron.prototype.neuriteCount = function () {
        return this.neurites.length;
    };
    /**
     * Adds a soma to the neuron
     *
     * @param  {Soma} s      Neuron soma
     */
    Neuron.prototype.setSoma = function (s) {
        this.soma = s;
    };
    /**
     * Search a node in the neuron by id
     *
     * @param  {number} nodeId   Node id number
     * @param  {number} neurite? Neurite id (optional)
     * @param  {bool} soma   Search only in the soma (default: false)
     * @return {Node3D}
     */
    Neuron.prototype.searchNode = function (nodeId, neurite, soma) {
        if (soma === void 0) { soma = false; }
        if (soma)
            return this.soma.searchNode(nodeId);
        if (neurite != null)
            return this.neurites[neurite].searchNode(nodeId);
        var ret;
        ret = this.soma.searchNode(nodeId);
        if (ret != null)
            return ret;
        else {
            for (var _i = 0, _a = this.neurites; _i < _a.length; _i++) {
                var n = _a[_i];
                ret = n.searchNode(nodeId);
                if (ret != null)
                    return ret;
            }
        }
        return null;
    };
    /**
     * Draws the neuron
     *
     * @param  {type} drawer: Drawer description
     * @return {type}                description
     */
    Neuron.prototype.draw = function () {
        // Draw soma
        if (this.soma) {
            this.soma.draw(this.drawer);
        }
        // Draw each neurite
        if (this.neurites) {
            for (var _i = 0, _a = this.neurites; _i < _a.length; _i++) {
                var n = _a[_i];
                n.draw(this.drawer);
            }
        }
    };
    Neuron.prototype.dispose = function () {
        for (var _i = 0, _a = this.neurites; _i < _a.length; _i++) {
            var n = _a[_i];
            n.dispose();
        }
    };
    Neuron.prototype.hasCutbox = function () {
        if (!this.properties)
            return false;
        else {
            return (this.properties["cutbox_min_x"] && this.properties["cutbox_min_y"] && this.properties["cutbox_min_z"] &&
                this.properties["cutbox_max_x"] && this.properties["cutbox_max_y"] && this.properties["cutbox_max_z"]);
        }
    };
    Neuron.prototype.drawCutbox = function () {
        if (this.hasCutbox()) {
            var min = { x: this.properties["cutbox_min_x"], y: this.properties["cutbox_min_y"], z: this.properties["cutbox_min_z"] };
            var max = { x: this.properties["cutbox_max_x"], y: this.properties["cutbox_max_y"], z: this.properties["cutbox_max_z"] };
            var len_x = max.x - min.x;
            var len_y = max.y - min.y;
            var len_z = max.z - min.z;
            this.drawer.drawLineBox(min, len_x, len_y, len_z);
        }
    };
    Neuron.prototype.forEachElement = function (fn) {
        for (var _i = 0, _a = this.neurites; _i < _a.length; _i++) {
            var neurite = _a[_i];
            neurite.forEachElement(fn);
        }
    };
    /**
     * Creates a neuron instance from a JS object
     *
     * @param  {type} obj : NeuronJSON      description
     * @param  {type} pal : MaterialPalette description
     * @return {type}                       description
     */
    Neuron.fromObject = function (obj) {
        var n = new Neuron(obj.id);
        n.setSoma(Soma_1.Soma.fromObject(obj.soma));
        for (var _i = 0, _a = obj.neurites; _i < _a.length; _i++) {
            var neurite = _a[_i];
            n.addNeurite(Neurite_1.Neurite.fromObject(neurite));
        }
        if (obj.properties) {
            for (var key in obj.properties) {
                n.addProperty(key, obj.properties[key]);
            }
        }
        return n;
    };
    return Neuron;
}());
exports.Neuron = Neuron;
//# sourceMappingURL=Neuron.js.map