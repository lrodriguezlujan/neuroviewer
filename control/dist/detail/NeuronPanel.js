"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ControlPanel_1 = require("./ControlPanel");
var NeuronControlPanel = (function (_super) {
    __extends(NeuronControlPanel, _super);
    function NeuronControlPanel(parentDiv, recData) {
        _super.call(this, "neuron", "Reconstruction", parentDiv);
        this.recData = recData;
        // Mark panes as options panel
        this.panelDiv.classList.add("neuronPanel");
        //this.createCameraOptions();
        //this.createRendererOptions();
        // Default size and position
        this.move(310, 50);
        this.resize(300);
    }
    NeuronControlPanel.neuron_name = "Reconstruction";
    return NeuronControlPanel;
}(ControlPanel_1.ControlPanel));
exports.NeuronControlPanel = NeuronControlPanel;
//# sourceMappingURL=NeuronPanel.js.map