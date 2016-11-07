import { ControlPanel } from "./ControlPanel";
import { Control } from "./NvControl";
export declare class NeuronControlPanel extends ControlPanel {
    private static neuron_name;
    constructor(parent: Control);
    private createContourSection();
    private createReconstructionSection();
    private static createNeuriteBoxes(id, n);
    private static neuriteTypeStr(t);
    private static createBranchBoxes(id, n);
    private static cbox_callback(c, checkId?);
    private static element_callback(c);
    private static element_callback_branch(c);
}
