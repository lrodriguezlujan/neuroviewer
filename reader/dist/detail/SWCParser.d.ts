import { Neuron } from "@neuroviewer/core";
import { ParserInterface } from "./Parser";
/**
*  SWCReader class
*  Reads a SWC FILE and produces a Neuron
*/
export declare class SWCParser implements ParserInterface {
    neuron: Neuron;
    error: Error;
    private tmpArray;
    private tmpBranches;
    private static property_keys;
    constructor();
    readAsync(id: string, data: string, cb: (n: Neuron, e?: Error) => void): void;
    readSync(id: string, data: string): Error;
    private initializeNeuron(id);
    private process(id, data);
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
