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
    readAsync(data: ReconstructionJSON | string, cb: (n: Reconstruction, e?: Error) => void): void;
    readSync(data: ReconstructionJSON | string): Error;
    private initialize();
    private process(data);
}
