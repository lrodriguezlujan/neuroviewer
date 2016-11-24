import { ControlPanel } from "./ControlPanel";
import { Control } from "./NvControl";
/**
 * Drawer control panel
 */
export declare class OptionsControlPanel extends ControlPanel {
    private static options_name;
    constructor(parent: Control);
    /**
     * Camera options section
     */
    private createCameraOptions();
    /**
     * Render options section
     */
    private createRendererOptions();
    /** Animate button function to be added to the render loop */
    private static cameraAnimationFunction(alpha, beta);
    /**
     * animation section
     */
    private createAnimationOptions();
}
