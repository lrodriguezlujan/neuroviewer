"use strict";
var OptionsPanel_1 = require("./OptionsPanel");
var NeuronPanel_1 = require("./NeuronPanel");
/**
 * Control panels for neuroviewer
 */
var Control = (function () {
    /**
     * control constructor
     * @param  {Drawer}         drawer         Current Drawer (controled by the options panel)
     * @param  {Reconstruction} reconstruction Current reconstruction (controled by the neuron panel)
     * @return {[type]}                              [description]
     */
    function Control(drawer, reconstruction) {
        var _this = this;
        this.drawer = drawer;
        this.reconstruction = reconstruction;
        /**
         * Auxiliar function that resizes the layers. This will listen to the
         * window resize event
         */
        this.canvasResizeListener = function () {
            _this.updateDrawerPosition();
            _this.updateDrawerSize();
        };
        // Create ontrol and canvas layer
        this.createLayer();
        // Create panels
        this.optionsPanel = new OptionsPanel_1.OptionsControlPanel(this);
        this.neuronPanel = new NeuronPanel_1.NeuronControlPanel(this);
    }
    /**
     * Returns the control div (the control layer)
     */
    Control.prototype.getControlDiv = function () {
        return this.controlLayer;
    };
    /**
     * Makes all controls visible
     */
    Control.prototype.show = function () {
        this.showOptions();
        this.showNeuron();
        this.showDetails();
    };
    /**
     * Hides all panels
     */
    Control.prototype.hide = function () {
        this.hideOptions();
        this.hideNeuron();
        this.hideDetails();
    };
    /**
   * Removes the control layer
   */
    Control.prototype.dispose = function () {
        this.controlLayer.remove();
    };
    // Changes the current reconstruction
    Control.prototype.attachReconstruction = function (r) {
        this.reconstruction = r;
    };
    /**
     * Makes the options panel visible
     */
    Control.prototype.showOptions = function () {
        this.optionsPanel.show();
    };
    /**
     * Hides the option panel
     */
    Control.prototype.hideOptions = function () {
        this.optionsPanel.hide();
    };
    /**
     * Triggers options panel visibility
     */
    Control.prototype.triggerOptions = function () {
        return this.optionsPanel.trigger();
    };
    /**
     * Makes the neuron control panel visible
     */
    Control.prototype.showNeuron = function () {
        this.neuronPanel.show();
    };
    /**
     * Hides the neuron control panel
     */
    Control.prototype.hideNeuron = function () {
        this.neuronPanel.hide();
    };
    /**
     * Triggers neruon panel visibility
     */
    Control.prototype.triggerNeuron = function () {
        return this.neuronPanel.trigger();
    };
    //TODO: Detail panel - Intended to be just a container so the user
    //can put in anything.
    Control.prototype.showDetails = function () {
        this.detailsPanel.show();
    };
    Control.prototype.hideDetails = function () {
        this.detailsPanel.hide();
    };
    Control.prototype.triggerDetails = function () {
        return this.detailsPanel.trigger();
    };
    Control.prototype.addToDetails = function (c) {
    };
    Control.prototype.emptyDetails = function () {
    };
    /**
     * Create control layers ontop of the drawer canvas
     */
    Control.prototype.createLayer = function () {
        this.controlLayer = document.createElement("div");
        this.controlLayer.style.position = "absolute";
        this.controlLayer.style["pointer-events"] = "none";
        this.controlLayer.id = "ControlLayer";
        this.drawer.attachResizeListener(this.canvasResizeListener);
        window.addEventListener("resize", this.canvasResizeListener);
        this.updateDrawerPosition();
        this.updateDrawerSize();
        document.body.appendChild(this.controlLayer);
    };
    /**
     * Change control layer position to match drawer position
     */
    Control.prototype.updateDrawerPosition = function () {
        var position = this.drawer.getCanvasPosition();
        this.controlLayer.style.left = position[0] + "px";
        this.controlLayer.style.top = position[1] + "px";
    };
    /**
     * Change control layer size to match drawer size
     */
    Control.prototype.updateDrawerSize = function () {
        var size = this.drawer.getCanvasSize();
        this.controlLayer.style.width = size[0] + "px";
        this.controlLayer.style.height = size[1] + "px";
        //this.canvasLayer.style.width = size[0]+"px";
        //this.canvasLayer.style.height = size[1]+"px";
    };
    return Control;
}());
exports.Control = Control;
//# sourceMappingURL=NvControl.js.map