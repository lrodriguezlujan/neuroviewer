import { Drawer } from "@neuroviewer/core";
import { ControlPanel } from "./ControlPanel";
export declare class OptionsControlPanel extends ControlPanel {
    private drawer;
    private static options_name;
    constructor(parentDiv: HTMLElement, drawer: Drawer);
    private createCameraOptions();
}
