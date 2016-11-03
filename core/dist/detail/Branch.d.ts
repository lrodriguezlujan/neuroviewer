import { NodeJSON, Node3D } from "./Node3D";
import { Status } from "./Status";
import { Neurite } from "./Neurite";
import { Point3D, Drawer } from "./NvCoreInterfaces";
/**
 * @summary JSON branch definition
 *
 * @public
 */
export interface BranchJSON {
    root: NodeJSON;
    nodes: Array<NodeJSON>;
    children?: Array<BranchJSON>;
}
/**
 * @summary Branch element definition
 *
 * @desc Each of the elements of a branch. Has an status, contains a node and a reference to
 * meshes associated with it.
 *
 * @public
 */
export declare class BranchElement {
    index: number;
    node: Node3D;
    private prevNode;
    branch: Branch;
    /**
     * Branch status
     */
    private status;
    /**
     * Draw method called flag
     */
    private drawn;
    /**
     * Mesh associated with the node
     */
    private nodeMesh;
    /**
     * Mesh associated with the parent segment
     */
    private segmentMesh;
    /**
     * Branch element constructor
     *
     * @param  {number} index Node poisition in the branch
     * @param  {Node3D} node Node3D that marks the segment target point
     * @param  {Node3D} prevNode Previous node (root point in the segment)
     * @param  {Branch} branch Parent branch
     *
     * @public
     */
    constructor(index: number, node: Node3D, prevNode: Node3D, branch: Branch);
    /**
     * Draws the BranchElement in the given drawer
     *
     * @desc The node is drawn as a sphere. The segment is drawn as a cylinder.
     *
     * @param  {Drawer} drawer class
     * @public
     */
    draw(drawer: Drawer, linear?: boolean): void;
    asLine(): Array<Point3D>;
    /**
     * Changes the element status and updates the material in the meshes
     *
     * @param  {Status} status New element status
     *
     * @public
     */
    setStatus(status: Status): void;
    /**
     * Gets current color
     */
    currentColor(): any;
    /**
     * Updates mesh material based on the status
     *
     * @private
     */
    updateMaterial(): void;
    /**
     * Frees resources
     *
     * @public
     */
    dispose(): void;
}
/**
 * Branch class
 */
export declare class Branch {
    id: Array<number>;
    private root;
    parent: Branch;
    neurite: Neurite;
    /**
     * Branch descs.
     */
    private children;
    /**
     * Branch nodes (ordered)
     */
    private nodes;
    /**
     * Branch status
     */
    private status;
    /**
     * Branch root node mesh
     */
    private rootMesh;
    /**
     * Branch constructor method
     *
     * @param  {Array<number>} id Numeric array that identifies the branch
     * @param  {Node3D} root Root node
     * @param  {Array<Node3D>} nodes Array of nodes that are part of the branch
     * @param  {Branch} branch Previous branch (optional)
     * @param  {Neurite} neurite Parent neurite (optional)
     */
    constructor(id: Array<number>, root: Node3D, nodes: Array<Node3D>, parent?: Branch, neurite?: Neurite);
    /**
     * Returns the id of the root node. -1  if it does not exist.
     *
     * @return {number} Root ID
     */
    rootID(): number;
    /**
     * Returns the id of the i-th node
     *
     * @param  {number} i Node index
     * @return {number} node ID.
     */
    nodeID(i: number): number;
    /**
     * Returns the node whose ID is nodeId (or null)
     *
     * @param  {number} nodeId lookup id
     * @return {Node3D}
     */
    searchNode(nodeId: number): any;
    /**
     * Executes a function for each element in the branch
     */
    forEachElement(fn: (item: BranchElement) => void, recursive?: boolean): void;
    /**
     * Number of nodes in the branch (excluding the root)
     *
     * @return {number} Node count
     */
    size(): number;
    /**
     *  Branch id as a string
     *
     * @return {string}  Branch id as string
     */
    idString(): string;
    /**
     * Update the id of the branch and its descendants
     *
     * @param  {Array<number>} id new ID
     */
    updateID(id: Array<number>): void;
    asLineArray(recursive?: boolean): Array<Array<Point3D>>;
    /**
     * Updates the material of every element
     *
     */
    updateMaterial(recursive?: boolean): void;
    /**
     * Changes the status of the branch
     *
     * @param  {Status} status new status
     * @param  {bool} propagate Should status be propagated to nodes and children? (default  = true)
     */
    setStatus(status: Status, propagate?: boolean): void;
    /**
     * Draws the branch and its elements in the given Drawer
     *
     * @param  {Drawer} drawer Class that draws the branch
     * @param  {bool} recursive Should branch descendants be drawn? (default: true)
     */
    draw(drawer: Drawer, recursive?: boolean, linear?: boolean): void;
    /**
     * Draws branch root
     *
     * @param  {Drawer} drawer Class that draws the branch
     */
    drawRoot(drawer: Drawer): void;
    /**
     * Set given branch as child of the current branch
     *
     * @param  {b} b branch to be set as child
     */
    appendBranch(b: Branch): void;
    dispose(recursive?: boolean): void;
    /**
     * Creates a branch from the given object
     *
     * @param  {Array<number>} id  Branch ID
     * @param  {BranchJSON} obj JS object
     * @param  {Neurite} neurite parent neurite (optional)
     * @return {Branch}
     */
    static fromObject(id: Array<number>, obj: BranchJSON, neurite?: Neurite): Branch;
}
