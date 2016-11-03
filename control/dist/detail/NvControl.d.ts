import { Drawer } from "@neuroviewer/core";
export declare class Control {
    private drawer;
    private optionsPanel;
    private neuronPanel;
    private detailsPanel;
    private controlLayer;
    constructor(drawer: Drawer);
    private createLayer();
    private canvasResizeListener;
    private updateDrawerPosition();
    private updateDrawerSize();
}
