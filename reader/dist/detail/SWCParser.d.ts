import { Neuron, Reconstruction } from "@neuroviewer/core";
import { ParserInterface } from "./Parser";
/**
*  SWCReader class
*  Reads a SWC FILE and produces a Neuron
*/
export declare class SWCParser implements ParserInterface {
    rec: Reconstruction;
    neuron: Neuron;
    error: Error;
    private tmpArray;
    private tmpBranches;
    private static property_keys;
    constructor();
    readAsync(data: string, cb: (n: Reconstruction, e?: Error) => void): void;
    readSync(data: string): Error;
    private initializeNeuron(id);
    private process(data);
    private static isHeader(s);
    private processHeader(s);
    private processData(s);
    private countDescs();
    private createNeurites();
    private buildBranch(el);
    private buildNeurite(b, type);
    private attachBranches(b);
    private addSoma();
}
