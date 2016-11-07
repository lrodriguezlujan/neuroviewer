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
    function OptionsControlPanel(parent) {
        _super.call(this, "options", "Options", parent);
        // Mark panes as options panel
        this.panelDiv.classList.add("optionsPanel");
        this.createCameraOptions();
        this.createRendererOptions();
        // Default size and position
        this.move(10, 10);
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
        if (this.parent.drawer.getCameraType() == core_1.CameraType.pivot) {
            camera_type = "pivot";
        }
        else {
            camera_type = "universal";
        }
        var selector_cb = function (ev) {
            var element = ev.srcElement;
            if (element.value == "pivot") {
                _this.parent.drawer.setCameraType(core_1.CameraType.pivot);
            }
            else if (element.value == "universal") {
                _this.parent.drawer.setCameraType(core_1.CameraType.universal);
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
            _this.parent.drawer.setCameraSpeed(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("camspeed", "Camera speed"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("camspeed", "number", speed_change_cb, this.parent.drawer.getCameraSpeed()));
        var inertia_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.drawer.setCameraInertia(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("caminertia", "Camera inertia"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("caminertia", "number", inertia_change_cb, this.parent.drawer.getCameraInertia()));
        var pansens_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.drawer.setCameraPanSensibility(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("campamsens", "Camera pan sensibility"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("campamsens", "number", pansens_change_cb, this.parent.drawer.getCameraPanSensibility()));
        var wheelsens_change_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.drawer.setCameraWheelSensibility(parseFloat(element.value));
            console.log(parseFloat(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("camwheelsens", "Camera wheel sensibility"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("camwheelsens", "number", wheelsens_change_cb, this.parent.drawer.getCameraWheelSensibility()));
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    OptionsControlPanel.prototype.createRendererOptions = function () {
        var _this = this;
        var parent = ControlPanel_1.ControlPanel.createSet("render_section");
        parent.classList.add("collapse"); // Make section collapsible
        var legend = ControlPanel_1.ControlPanel.createLegend("Render options");
        legend.setAttribute("data-toggle", "collapse");
        legend.setAttribute("data-target", "#" + "render_section");
        legend.setAttribute("cursor", "copy");
        //parent.appendChild(ControlPanel.createLabelTag("plotgrid","Render grid"));
        var ignore_cb = function (ev) { };
        var grid_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.drawer.showGrid(element.checked);
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_grid", "Render grid", this.parent.drawer.visibleGrid(), grid_cb));
        var linear_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.reconstruction.linearDrawing = element.checked;
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_linear", "Linear rendering", this.parent.reconstruction.linearDrawing, linear_cb));
        var node_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.reconstruction.drawNodeSpheres = element.checked;
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_nodes", "Render nodes", this.parent.reconstruction.drawNodeSpheres, node_cb));
        var single_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.reconstruction.singleElementDraw = element.checked;
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createSimpleCBInput("plot_single", "Merge neurite elements", this.parent.reconstruction.singleElementDraw, single_cb));
        var detail_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.drawer.setCircularSegmentsCount(parseInt(element.value));
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createLabelTag("plot_segmentscircle", "Segments per circle"));
        parent.appendChild(ControlPanel_1.ControlPanel.createInputBox("plot_segmentscircle", "number", detail_cb, this.parent.drawer.getCircularSegmentsCount()));
        var optimization_cb = function (ev) {
            var element = ev.srcElement;
            _this.parent.drawer.optimize(parseInt(element.value));
        };
        var selector_opt = ControlPanel_1.ControlPanel.createRadioBoxSelector("Optimization level", "plot_opt", {
            "0": "Low",
            "1": "Medium",
            "2": "High"
        }, optimization_cb, "0");
        parent.appendChild(selector_opt);
        // Redraw button
        var redraw_cb = function (ev) {
            _this.parent.reconstruction.draw();
            _this.parent.drawer.normalizeScene();
            _this.parent.drawer.showGrid(_this.parent.drawer.visibleGrid());
            _this.parent.drawer.optimize();
        };
        parent.appendChild(ControlPanel_1.ControlPanel.createButton("redraw_btn", "Redaw", redraw_cb, "glyphicon-pencil"));
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    OptionsControlPanel.options_name = "Options";
    return OptionsControlPanel;
}(ControlPanel_1.ControlPanel));
exports.OptionsControlPanel = OptionsControlPanel;
//# sourceMappingURL=OptionsPanel.js.map