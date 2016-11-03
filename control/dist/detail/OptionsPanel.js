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
        _super.call(this, "options", "Options", parentDiv);
        this.drawer = drawer;
        // Mark panes as options panel
        this.panelDiv.classList.add("optionsPanel");
        this.createCameraOptions();
        this.createRendererOptions();
        // Default size and position
        this.move(10, 50);
        this.resize(300);
    }
    OptionsControlPanel.prototype.createCameraOptions = function () {
        var _this = this;
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
        var selector_cb = function (ev) {
            var element = ev.srcElement;
            if (element.value == "pivot") {
                _this.drawer.setCameraType(core_1.CameraType.pivot);
            }
            else if (element.value == "universal") {
                _this.drawer.setCameraType(core_1.CameraType.universal);
            }
        };
        var selector = ControlPanel_1.ControlPanel.createRadioBoxSelector("Camera type", "camera_type_sel", {
            "pivot": "Pivot",
            "univeral": "Universal"
        }, selector_cb, camera_type);
        parent.appendChild(selector);
        // Add...stuff
        var speed_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.drawer.setCameraSpeed(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("camspeed", "Camera speed"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("camspeed", "number", speed_change_cb, this.drawer.getCameraSpeed()));
        var inertia_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.drawer.setCameraInertia(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("caminertia", "Camera inertia"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("caminertia", "number", inertia_change_cb, this.drawer.getCameraInertia()));
        var pansens_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.drawer.setCameraPanSensibility(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("campamsens", "Camera pan sensibility"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("campamsens", "number", pansens_change_cb, this.drawer.getCameraPanSensibility()));
        var wheelsens_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.drawer.setCameraWheelSensibility(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("camwheelsens", "Camera wheel sensibility"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("camwheelsens", "number", wheelsens_change_cb, this.drawer.getCameraWheelSensibility()));
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    OptionsControlPanel.prototype.createRendererOptions = function () {
        var parent = ControlPanel_1.ControlPanel.createSet("render_section");
        parent.classList.add("collapse"); // Make section collapsible
        var legend = ControlPanel_1.ControlPanel.createLegend("Render options");
        legend.setAttribute("data-toggle", "collapse");
        legend.setAttribute("data-target", "#" + "render_section");
        legend.setAttribute("cursor", "copy");
        //parent.appendChild(ControlPanel.createLabelTag("plotgrid","Render grid"));
        var ignore_cb = function (ev) { };
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_grid", "Render grid", true, ignore_cb));
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_linear", "Linear rendering", true, ignore_cb));
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_nodes", "Render nodes", false, ignore_cb));
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_single", "Simplified plot", false, ignore_cb));
        var selector_detail = ControlPanel_1.ControlPanel.createRadioBoxSelector("Detail level", "plot_detail", {
            "low": "Low",
            "medium": "Medium",
            "high": "High"
        }, ignore_cb, "low");
        parent.appendChild(selector_detail);
        var selector_opt = ControlPanel_1.ControlPanel.createRadioBoxSelector("Optimization level", "plot_opt", {
            "low": "Low",
            "medium": "Medium",
            "high": "High"
        }, ignore_cb, "low");
        parent.appendChild(selector_opt);
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    OptionsControlPanel.options_name = "Options";
    return OptionsControlPanel;
}(ControlPanel_1.ControlPanel));
exports.OptionsControlPanel = OptionsControlPanel;
//# sourceMappingURL=OptionsPanel.js.map