import { BranchJSON, Branch, BranchElement } from "./Branch";
import { Neuron } from "./Neuron";
import { Status } from "./Status";
import { Drawer, DrawMaterialSet } from "./NvCoreInterfaces";
/**
 * Neurite Type enum
 */
export declare enum NeuriteType {
    dendrite = 0,
    apical = 1,
    axon = 2,
    unknown = 3,
    soma = 4,
}
/**
 * Neurite as JS Object definition
 */
export interface NeuriteJSON {
    id: number;
    type: number;
    materialIndex: number;
    tree: BranchJSON;
}
/**
 * Neurite model class
 */
export declare class Neurite {
    id: number;
    type: NeuriteType;
    material: DrawMaterialSet;
    neuron: Neuron;
    /**
     * Neurite's first branch
     */
    private firstBranch;
    private lineDrawObj;
    /**
     * Neurite constructor
     *
     * @param  {number} id Neurite numeric id
     * @param  {NeuriteTye} type Neurite type id
     * @param  {MaterialPaletteElement} material Neurite assigned material element
     * @param  {Neuron} neuron      Parent neuron
     */
    constructor(id: number, type: NeuriteType, material?: DrawMaterialSet, neuron?: Neuron);
    /**
     * Changes neurite root branch
     *
     * @param  {Branch}  b Branch to be set as neurite root
     */
    setRoot(b: Branch): void;
    /**
     * Draws the neurite
     *
     * @param  {Drawer} drawer Class that draws the neurite
     */
    draw(drawer: Drawer, linear?: boolean): void;
    lineDraw(drawer: Drawer): void;
    /**
     * Executes a function for each element in the neurite
     */
    forEachElement(fn: (item: BranchElement) => void): void;
    /**
     * Auxiliar method that translates int (SWC) to neurite type
     *
     * @param  {t} t numeric type id
     */
    static neuriteTypeFromNumber(t: number): NeuriteType;
    /**
     * Updates neurite material
     *
     * @param  {MaterialPaletteElement} mat New material
     */
    updateMaterial(mat: DrawMaterialSet): void;
    /**
     * Changes the status
     *
     * @param  {Status} status new status
     * @param  {bool} propagate @see Branch.setStatus (default: true)
     */
    setStatus(status: Status, propagate?: boolean): void;
    /**
     * Creates a new Neurite from a JS object
     *
     * @param  {NeuriteJSON} obj Object
     * @param  {MaterialPalette} pal Material palette to pick the element from
     */
    static fromObject(obj: NeuriteJSON): Neurite;
    /**
     * Returns the node if it is present in the neurite
     *
     * @param  {number} nodeId Node ID
     * @return {Node3D}
     */
    searchNode(nodeId: number): any;
    /**
     * Standarizes branch Ids in the neurite
     *
     */
    reassignBranchIds(): void;
    dispose(): void;
}
