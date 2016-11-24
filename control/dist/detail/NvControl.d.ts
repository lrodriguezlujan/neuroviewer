import { Drawer, Reconstruction } from "@neuroviewer/core";
/**
 * Control panels for neuroviewer
 */
export declare class Control {
    drawer: Drawer;
    reconstruction: Reconstruction;
    private optionsPanel;
    private neuronPanel;
    private detailsPanel;
    private controlLayer;
    private canvasLayer;
    /**
     * control constructor
     * @param  {Drawer}         drawer         Current Drawer (controled by the options panel)
     * @param  {Reconstruction} reconstruction Current reconstruction (controled by the neuron panel)
     * @return {[type]}                              [description]
     */
    constructor(drawer: Drawer, reconstruction: Reconstruction);
    /**
     * Returns the control div (the control layer)
     */
    getControlDiv(): HTMLElement;
    /**
     * Makes all controls visible
     */
    show(): void;
    /**
     * Hides all panels
     */
    hide(): void;
    /**
   * Removes the control layer
   */
    dispose(): void;
    attachReconstruction(r: Reconstruction): void;
    /**
     * Makes the options panel visible
     */
    showOptions(): void;
    /**
     * Hides the option panel
     */
    hideOptions(): void;
    /**
     * Triggers options panel visibility
     */
    triggerOptions(): boolean;
    /**
     * Makes the neuron control panel visible
     */
    showNeuron(): void;
    /**
     * Hides the neuron control panel
     */
    hideNeuron(): void;
    /**
     * Triggers neruon panel visibility
     */
    triggerNeuron(): boolean;
    showDetails(): void;
    hideDetails(): void;
    triggerDetails(): boolean;
    addToDetails(c: HTMLElement): void;
    emptyDetails(): void;
    /**
     * Create control layers ontop of the drawer canvas
     */
    private createLayer();
    /**
     * Auxiliar function that resizes the layers. This will listen to the
     * window resize event
     */
    private canvasResizeListener;
    /**
     * Change control layer position to match drawer position
     */
    private updateDrawerPosition();
    /**
     * Change control layer size to match drawer size
     */
    private updateDrawerSize();
}
