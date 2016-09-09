"use strict";
;
/**
 * @author luis rodriguez-lujan
 *
 * @summary 3D node class extended from Vector3
 * @public
 **/
var Node3D = (function () {
    /**
     * Node3D Constructor
     *
     * @param  {number} x    X coordinate
     * @param  {number} y    Y coordinate
     * @param  {number} z    Z coordinate
     * @param  {number} r    Node radius
     * @param  {number} id   Node ID (optional)
     */
    function Node3D(x, y, z, r, id) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.id = id;
        this.properties = {};
    }
    /**
     * Creates a Node3D object from a JS object
     *
     * @see NodeJSON
     *
     * @param  {NodeJSON} obj source object
     * @return {Node3D}
     */
    Node3D.fromObj = function (obj) {
        var node = new Node3D(obj.x, obj.y, obj.z, obj.r, obj.id);
        if (obj.properties) {
            for (var prop in obj.properties) {
                node.properties[prop] = obj.properties[prop];
            }
        }
        return node;
    };
    return Node3D;
}());
exports.Node3D = Node3D;
; // End node3D
//# sourceMappingURL=Node3D.js.map