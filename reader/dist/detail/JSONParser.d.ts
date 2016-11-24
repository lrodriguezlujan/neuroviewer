import { ReconstructionJSON, Reconstruction } from "@neuroviewer/core";
import { ParserInterface } from "./Parser";
/**
*  SWCParser class
*  Reads a SWC FILE and produces a Reconstruction
*/
export declare class JSONParser implements ParserInterface {
    rec: Reconstruction;
    error: Error;
    constructor();
    /**
     * JSON Read function
     * @param  {ReconstructionJSON |  string}      data Reconstruction JSON object or a JSON string
     * @param  {fn}                 cb Callback function (Reconstruction,error)
     * @return {Reconstruction}                   Reconstruction object
     */
    read(data: ReconstructionJSON | string, cb: (n: Reconstruction, e?: Error) => void): Reconstruction;
    /**
     * Initializes the reconstruction (Creates an empty one)
     * @return {void}
     */
    private initialize();
    /**
     * Process the JSON data and creates a reconstruction
     * @param  {ReconstructionJSON} data JSON data
     * @return {Reconstruction} Neuron reconstruction
     */
    private process(data);
}
