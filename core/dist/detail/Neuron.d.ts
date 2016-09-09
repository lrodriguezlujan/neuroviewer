import { BranchElement } from "./Branch";
import { Soma, SomaJSON } from "./Soma";
import { Neurite, NeuriteJSON } from "./Neurite";
import { Drawer } from "./NvCoreInterfaces";
export interface NeuronJSON {
    id: string;
    soma: SomaJSON;
    neurites: Array<NeuriteJSON>;
    properties?: {
        [key: string]: any;
    };
}
/**
 * Neuron model class
 */
export declare class Neuron {
    id: string;
    private neurites;
    private properties;
    soma: Soma;
    private drawer;
    private cutbox;
    /**
     * Neuron constructor
     *
     * @param  {string} id Neuron unique name
     */
    constructor(id: string);
    /**
     * Adds a neurite
     *
     * @param  {Neurite} n Neurite to add
     */
    addNeurite(n: Neurite): void;
    attachDrawer(drawer: Drawer): void;
    private updateMaterials();
    /**
     * Adds a property to the neuron
     *
     * @param  {string} key  Property name
     * @param  {any} value   Property value (optional)
     */
    addProperty(key: string, value?: any): void;
    /**
     * Number of neurites in the neuron
     *
     */
    neuriteCount(): number;
    /**
     * Adds a soma to the neuron
     *
     * @param  {Soma} s      Neuron soma
     */
    setSoma(s: Soma): void;
    /**
     * Search a node in the neuron by id
     *
     * @param  {number} nodeId   Node id number
     * @param  {number} neurite? Neurite id (optional)
     * @param  {bool} soma   Search only in the soma (default: false)
     * @return {Node3D}
     */
    searchNode(nodeId: number, neurite?: number, soma?: boolean): any;
    /**
     * Draws the neuron
     *
     * @param  {type} drawer: Drawer description
     * @return {type}                description
     */
    draw(): void;
    dispose(): void;
    hasCutbox(): any;
    drawCutbox(): void;
    forEachElement(fn: (item: BranchElement) => void): void;
    /**
     * Creates a neuron instance from a JS object
     *
     * @param  {type} obj : NeuronJSON      description
     * @param  {type} pal : MaterialPalette description
     * @return {type}                       description
     */
    static fromObject(obj: NeuronJSON): Neuron;
}