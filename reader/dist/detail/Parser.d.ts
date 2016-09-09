import { NeuronJSON, Neuron } from "@neuroviewer/core";
/**
 * Basic parser interface
 */
export interface ParserInterface {
    readAsync: (id: string, data: NeuronJSON | string, cb: (n: Neuron, e?: Error) => void) => void;
    readSync: (id: string, data: NeuronJSON | string) => Error;
    neuron: Neuron;
    error: Error;
}
