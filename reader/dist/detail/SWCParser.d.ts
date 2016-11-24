import { Neuron, Reconstruction } from "@neuroviewer/core";
import { ParserInterface } from "./Parser";
/**
*  SWCReader class
*  Reads a SWC FILE and produces a Reconstruction
*/
export declare class SWCParser implements ParserInterface {
    rec: Reconstruction;
    neuron: Neuron;
    error: Error;
    private tmpArray;
    private tmpBranches;
    private static property_keys;
    /**
     * Empty constructor
     */
    constructor();
    /**
     * SWC Read function
     * @param  {string} data SWC File as a single string
     * @param  {fn}  cb   Callback function
     * @return {Reconstruction}  Single neuron reconstruction object
     */
    read(data: string, cb: (n: Reconstruction, e?: Error) => void): Reconstruction;
    /**
     * Creates an empty neuron with given id
     * @param  {string} id Neuron id
     */
    private initializeNeuron(id);
    /**
     * Process a SWC file as an array of lines and creates a Reconstruction object
     * @param  {Array<string>} data SWC file data (line by line)
     */
    private process(data);
    /**
     * Checks if the given string is a header line
     * @param  {string} s Trimmed imput stream
     * @return {bool}   True if string is a header line
     */
    private static isHeader(s);
    /**
     * Process a SWC header line, extracting any matching property
     * @param  {string} s Header line
     */
    private processHeader(s);
    /**
     * Process a data line and stores the node in a temporal array
     * @param  {string} s Data line
     */
    private processData(s);
    /**
     * Updates the desc count of the nodes in the temporal array
     */
    private countDescs();
    /**
     * Creates the neurites based on the temporal array nodes
     */
    private createNeurites();
    /**
     * Creates a branch with last node el. It goes backwards until
     * it finds a node with more than one desc, a soma node o a node with no parent
     * @param  {SWCDataRow} el Last node element
     * @return {Branch}
     */
    private buildBranch(el);
    /**
     * Creates a neurite with root branch b and adds it to the neuron
     * @param  {Branch}      b    Root branch
     * @param  {NeuriteType} type Neurite type
     */
    private buildNeurite(b, type);
    /**
     * Given a branch looks for its daughter branches and attach them recursively
     * @param  {Branch} b Current branch
     */
    private attachBranches(b);
    /**
     * Sets the neuron soma
     */
    private addSoma();
}
