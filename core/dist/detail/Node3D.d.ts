import { Point3D } from "./NvCoreInterfaces";
/**
 * @author luis rodriguez-lujan
 *
 * @summary Node definition as JS object
 * @public
 *
 **/
export interface NodeJSON {
    id: number;
    x: number;
    y: number;
    z: number;
    r: number;
    properties?: {
        [k: string]: any;
    };
}
/**
 * @author luis rodriguez-lujan
 *
 * @summary 3D node class extended from Vector3
 * @public
 **/
export declare class Node3D implements Point3D {
    x: number;
    y: number;
    z: number;
    r: number;
    id: number;
    /**
     * Node property map
     **/
    properties: {
        [k: string]: any;
    };
    /**
     * Node3D Constructor
     *
     * @param  {number} x    X coordinate
     * @param  {number} y    Y coordinate
     * @param  {number} z    Z coordinate
     * @param  {number} r    Node radius
     * @param  {number} id   Node ID (optional)
     */
    constructor(x: number, y: number, z: number, r: number, id?: number);
    /**
     * Creates a Node3D object from a JS object
     *
     * @see NodeJSON
     *
     * @param  {NodeJSON} obj source object
     * @return {Node3D}
     */
    static fromObj(obj: NodeJSON): Node3D;
}
