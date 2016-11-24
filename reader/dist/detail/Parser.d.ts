import { ReconstructionJSON, Reconstruction } from "@neuroviewer/core";
/**
 * Basic parser interface
 */
export interface ParserInterface {
    /**
     * Read function interface
     * @type {Reconstruction}
     */
    read: (data: ReconstructionJSON | string, cb?: (n: Reconstruction, e?: Error) => void) => Reconstruction;
    rec: Reconstruction;
    error: Error;
}
