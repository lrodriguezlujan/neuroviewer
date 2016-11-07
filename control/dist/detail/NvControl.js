"use strict";
var OptionsPanel_1 = require("./OptionsPanel");
var NeuronPanel_1 = require("./NeuronPanel");
var Control = (function () {
    function Control(drawer, reconstruction) {
        //this.canvasLayer = document.createElement("canvas");
        //this.canvasLayer.classList.add("controlDrawingCanvas");
        var _this = this;
        this.drawer = drawer;
        this.reconstruction = reconstruction;
        this.canvasResizeListener = function () {
            _this.updateDrawerPosition();
            _this.updateDrawerSize();
        };
        this.createLayer();
        //this.controlLayer.appendChild(this.canvasLayer);
        this.optionsPanel = new OptionsPanel_1.OptionsControlPanel(this);
        this.neuronPanel = new NeuronPanel_1.NeuronControlPanel(this);
    }
    Control.prototype.getControlDiv = function () {
        return this.controlLayer;
    };
    // Trigger display
    Control.prototype.show = function () {
        this.showOptions();
        this.showNeuron();
        this.showDetails();
    };
    Control.prototype.hide = function () {
        this.hideOptions();
        this.hideNeuron();
        this.hideDetails();
    };
    Control.prototype.dispose = function () {
        this.controlLayer.remove();
    };
    // Add reconstruction
    Control.prototype.attachReconstruction = function (r) {
        this.reconstruction = r;
        // Add to neuronPanel
        /*if(this.neuronPanel){
          this.neuronPanel.setReconstruction(this.recData);
        }*/
    };
    // Options panel control
    Control.prototype.showOptions = function () {
        this.optionsPanel.show();
    };
    Control.prototype.hideOptions = function () {
        this.optionsPanel.hide();
    };
    Control.prototype.triggerOptions = function () {
        return this.optionsPanel.trigger();
    };
    // Neuron panel
    Control.prototype.showNeuron = function () {
        this.neuronPanel.show();
    };
    Control.prototype.hideNeuron = function () {
        this.neuronPanel.hide();
    };
    Control.prototype.triggerNeuron = function () {
        return this.neuronPanel.trigger();
    };
    // Details panel
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
    Control.prototype.updateDrawerPosition = function () {
        var position = this.drawer.getCanvasPosition();
        this.controlLayer.style.left = position[0] + "px";
        this.controlLayer.style.top = position[1] + "px";
        //this.canvasLayer.style.left = position[0]+"px";
        //this.canvasLayer.style.top = position[1]+"px";
    };
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