import { Reconstruction } from "@neuroviewer/core";
import { ControlPanel } from "./ControlPanel";
export declare class NeuronControlPanel extends ControlPanel {
    private recData;
    private static neuron_name;
    constructor(parentDiv: HTMLElement, recData: Reconstruction);
}
