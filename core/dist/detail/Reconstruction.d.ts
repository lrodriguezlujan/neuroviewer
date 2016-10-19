import { Soma } from "./Soma";
import { BranchElement } from "./Branch";
import { Contour, ContourJSON } from "./Contour";
import { Neuron, NeuronJSON } from "./Neuron";
import { Drawer } from "./NvCoreInterfaces";
export interface ReconstructionJSON {
    neurons: Array<NeuronJSON>;
    properties?: {
        [key: string]: any;
    };
    contours?: Array<ContourJSON>;
}
/**
 * Neuron model class
 */
export declare class Reconstruction {
    neurons: Array<Neuron>;
    contours: Array<Contour>;
    private properties;
    private drawer;
    /**
     * Neuron constructor
     *
     * @param  {string} id Neuron unique name
     */
    constructor();
    /**
     * Adds a neruon
     *
     * @param  {Neruon} n Neuron to add
     */
    addNeuron(n: Neuron): void;
    attachDrawer(drawer: Drawer): void;
    /**
     * Adds a property to the reconstruction
     *
     * @param  {string} key  Property name
     * @param  {any} value   Property value (optional)
     */
    addProperty(key: string, value?: any): void;
    /**
     * Adds a new contour to the neuron
     *
     * @param {Contour} c Contour to be added
     */
    addContour(c: Contour): void;
    /**
     * Number of neurons in the reconstruction
     *
     */
    neuronCount(): number;
    /**
     * Number of contours in the reconstruction
     *
     */
    contourCount(): number;
    /**
     * Search a node in the neuron by id
     *
     * @param  {number} nodeId   Node id number
     * @param  {number} neurite? Neurite id (optional)
     * @param  {bool} soma   Search only in the soma (default: false)
     * @return {Node3D}
     */
    searchNode(nodeId: number, soma?: boolean): Soma | BranchElement;
    /**
     * Draws the neuron
     *
     * @param  {type} drawer: Drawer description
     * @return {type}                description
     */
    draw(linear: boolean): void;
    dispose(): void;
    /**
     * Creates a neuron instance from a JS object
     *
     * @param  {type} obj : NeuronJSON      description
     * @param  {type} pal : MaterialPalette description
     * @return {type}                       description
     */
    static fromObject(obj: ReconstructionJSON): Reconstruction;
}
