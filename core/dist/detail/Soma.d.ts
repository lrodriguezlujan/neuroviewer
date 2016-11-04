import { NodeJSON, Node3D } from "./Node3D";
import { Status } from "./Status";
import { Drawer, DrawMaterialSet } from "./NvCoreInterfaces";
/**
 *  Soma as JS object
 */
export interface SomaJSON {
    nodes: Array<NodeJSON>;
    isContour?: boolean;
    status?: number;
}
/**
 * Soma model class
 */
export declare class Soma {
    isContour: boolean;
    private mat;
    nodes: Array<Node3D>;
    status: Status;
    private mesh;
    private enabled;
    /**
     * Soma constructor
     *
     * @param  {Array<Node3D>} nodes Nodes that are part of the soma
     * @param  {bool} isContour Are the nodes part of the contour of the soma? (default: false)
     * @param  {MaterialPaletteElement} m Soma material element (optional)
     */
    constructor(nodes: Array<Node3D>, isContour?: boolean, mat?: DrawMaterialSet);
    /**
     * Changes soma material
     *
     * @param  {MaterialPaletteElement} m New soma material
     */
    setMaterial(m: DrawMaterialSet): void;
    /**
     * Looks for the given node in the soma
     *
     * @param  {number} nodeId Node identifier
     * @return {Node3D}
     */
    searchNode(nodeId: number): this;
    /**
     * Changes soma status
     *
     * @param  {type} s: Status description
     */
    setStatus(s: Status): void;
    /**
     * Returns the i-th node in the soma
     *
     * @param  {number} node index
     * @return {Node3D}
     */
    node(i: number): Node3D;
    /**
     * Updates soma mesh material
     *
     */
    private updateMaterial();
    /**
     * Draws the soma in the drawer
     *
     * @param  {Drawer} drawer drawer class
     */
    draw(drawer: Drawer): void;
    isEnabled(): boolean;
    setEnabled(v: boolean, recursive?: boolean): void;
    /**
     * Computes the convex hull of the given contour nodes
     *
     * @param  {Array<Node3D>} nodes Soma contour
     */
    private convexHull3D(nodes);
    /**
     * Selects the material based on teh status
     *
     * @return {type}  description
     */
    private pickMaterial();
    /**
     * Creates a soma class from a JS object
     *
     * @param  {SomaJSON} obj             JS object
     * @param  {MaterialPaletteElement} m Material element
     * @return {Soma}
     */
    static fromObject(obj: SomaJSON): Soma;
}
