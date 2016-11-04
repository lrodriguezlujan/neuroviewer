"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ControlPanel_1 = require("./ControlPanel");
var NeuronControlPanel = (function (_super) {
    __extends(NeuronControlPanel, _super);
    function NeuronControlPanel(parent) {
        _super.call(this, "neuron", "Reconstruction", parent);
        // Mark panes as options panel
        this.panelDiv.classList.add("neuronPanel");
        //this.createCameraOptions();
        //this.createRendererOptions();
        //
        // // TEST
        this.contentDiv.appendChild(this.createContourSection());
        // Default size and position
        this.move(310, 50);
        this.resize(300);
    }
    NeuronControlPanel.prototype.createContourSection = function () {
        var parent = ControlPanel_1.ControlPanel.createSet("contours");
        parent.appendChild(ControlPanel_1.ControlPanel.createLegend("Contours"));
        var list = ControlPanel_1.ControlPanel.createBoxList("test_list", [
            ControlPanel_1.ControlPanel.createBoxListItem("testA", "Regular item", false, null),
            ControlPanel_1.ControlPanel.createBoxListItem("testB", "Expand", false, null, document.createElement("dummy"), 10, "#880000")
        ]);
        parent.appendChild(list);
        return parent;
    };
    NeuronControlPanel.neuron_name = "Reconstruction";
    return NeuronControlPanel;
}(ControlPanel_1.ControlPanel));
exports.NeuronControlPanel = NeuronControlPanel;
//# sourceMappingURL=NeuronPanel.js.map