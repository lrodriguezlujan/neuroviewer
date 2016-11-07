import { ControlPanel } from "./ControlPanel";
import { Control } from "./NvControl";
export declare class OptionsControlPanel extends ControlPanel {
    private static options_name;
    constructor(parent: Control);
    private createCameraOptions();
    private createRendererOptions();
    private static cameraAnimationFunction(alpha, beta);
    private createAnimationOptions();
}
