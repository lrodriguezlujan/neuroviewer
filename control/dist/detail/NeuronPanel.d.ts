import { ControlPanel } from "./ControlPanel";
import { Control } from "./NvControl";
/**
 * Neuron management
 */
export declare class NeuronControlPanel extends ControlPanel {
    private static neuron_name;
    constructor(parent: Control);
    /**
     * Creates contour section controls
     */
    private createContourSection();
    /**
     * Creates reconstruction section controls
     */
    private createReconstructionSection();
    /**
     * Creates box list items for each neurite in the neuron
     */
    private static createNeuriteBoxes(id, n);
    /**
     * Neurite type to string
     */
    private static neuriteTypeStr(t);
    /**
     * Creates box list items for each branch in the neurite
     */
    private static createBranchBoxes(id, n);
    /**
     * Onchange checkbox listener (hides/shows)
     */
    private static cbox_callback(c, checkId?);
    /**
     * Ondblclick checkbox listener (selects)
     */
    private static element_callback(c);
    /**
     * Ondblclick checkbox listener  for branches - no descend
     */
    private static element_callback_branch(c);
}
