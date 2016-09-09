import { NeuronJSON, Neuron } from "@neuroviewer/core";
import { ParserInterface } from "./Parser";
/**
*  SWCParser class
*  Reads a SWC FILE and produces a Neuron
*/
export declare class JSONParser implements ParserInterface {
    neuron: Neuron;
    error: Error;
    constructor();
    readAsync(id: string, data: NeuronJSON | string, cb: (n: Neuron, e?: Error) => void): void;
    readSync(id: string, data: NeuronJSON | string): Error;
    private initializeNeuron(id);
    private process(id, data);
}
