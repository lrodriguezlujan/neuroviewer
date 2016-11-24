import { Status } from "./Status";
import { Point3D, Drawer } from "./NvCoreInterfaces";
/**
 *  Contour as JS object
 */
export interface ContourJSON {
    name: string;
    face_color: string;
    back_color: string;
    closed: boolean;
    fill: number;
    resolution: number;
    points: Array<Point3D>;
}
/**
 * Soma model class
 */
export declare class Contour {
    points: Array<Point3D>;
    name: string;
    face_color: string;
    back_color: string;
    closed: boolean;
    fill: number;
    resolution: number;
    status: Status;
    private mesh;
    private enabled;
    private drawer;
    /**
     * Contour constructor
     *
     * @param  {Array<Point3D>} nodes Nodes that are part of the soma
     * @param  {MaterialPaletteElement} m material element (optional)
     */
    constructor(points: Array<Point3D>);
    size(): number;
    /**
     * Changes status
     *
     * @param  {type} s: Status description
     */
    setStatus(s: Status): void;
    updateColor(): void;
    /**
     * Returns the i-th point in the contour
     *
     * @param  {number} node index
     * @return {Point3D}
     */
    node(i: number): Point3D;
    /**
     * Draws the contour in the drawer
     *
     * @param  {Drawer} drawer drawer class
     */
    draw(drawer: Drawer): void;
    /**
     * Returns the enabled/disabled status
     * @return {boolean} True if the contour is visible
     */
    isEnabled(): boolean;
    /**
     * Changes the enabled/disabled status
     * @param  {boolean} v New status
     */
    setEnabled(v: boolean): void;
    /**
     * Frees all allocated resources. disposes the meshes
     */
    dispose(): void;
    /**
     * Creates a soma class from a JS object
     *
     * @param  {ContourJSON} obj             JS object
     * @return {Contour}
     */
    static fromObject(obj: ContourJSON): Contour;
}
