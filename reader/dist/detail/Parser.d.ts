import { ReconstructionJSON, Reconstruction } from "@neuroviewer/core";
/**
 * Basic parser interface
 */
export interface ParserInterface {
    readAsync: (data: ReconstructionJSON | string, cb: (n: Reconstruction, e?: Error) => void) => void;
    readSync: (data: ReconstructionJSON | string) => Error;
    rec: Reconstruction;
    error: Error;
}
