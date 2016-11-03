"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("@neuroviewer/core");
var ControlPanel_1 = require("./ControlPanel");
var OptionsControlPanel = (function (_super) {
    __extends(OptionsControlPanel, _super);
    function OptionsControlPanel(parentDiv, drawer) {
        _super.call(this, "Options", "options", parentDiv);
        this.drawer = drawer;
        // Mark panes as options panel
        this.panelDiv.classList.add("optionsPanel");
        this.createCameraOptions();
        // Default size and position
        this.move(10, 50);
        this.resize(300);
    }
    OptionsControlPanel.prototype.createCameraOptions = function () {
        var parent = ControlPanel_1.ControlPanel.createSet("camera_section");
        parent.classList.add("collapse"); // Make section collapsible
        var legend = ControlPanel_1.ControlPanel.createLegend("Camera options");
        legend.setAttribute("data-toggle", "collapse");
        legend.setAttribute("data-target", "#" + "camera_section");
        legend.setAttribute("cursor", "copy");
        var camera_type;
        if (this.drawer.getCameraType() == core_1.CameraType.pivot) {
            camera_type = "pivot";
        }
        else {
            camera_type = "universal";
        }
        var selector = ControlPanel_1.ControlPanel.createRadioBoxSelector("Camera type", "camera_type_sel", {
            "pivot": "Pivot",
            "univeral": "Universal"
        }, camera_type);
        parent.appendChild(selector);
        // Add...stuff
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("camspeed", "Camera speed"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("camspeed", "number", this.drawer.getCameraSpeed()));
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("caminertia", "Camera inertia"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("caminertia", "number", this.drawer.getCameraInertia()));
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("campamsens", "Camera pan sensibility"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("campamsens", "number", this.drawer.getCameraPanSensibility()));
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("camwheelsens", "Camera wheel sensibility"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("camwheelsens", "number", this.drawer.getCameraWheelSensibility()));
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    OptionsControlPanel.options_name = "Options";
    return OptionsControlPanel;
}(ControlPanel_1.ControlPanel));
exports.OptionsControlPanel = OptionsControlPanel;
//# sourceMappingURL=OptionsPanel.js.map