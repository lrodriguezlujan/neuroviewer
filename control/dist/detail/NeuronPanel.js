"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("@neuroviewer/core");
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
        this.createContourSection();
        this.createReconstructionSection();
        // Default size and position
        this.move(this.parent.drawer.getCanvasSize()[0] - 410, 10);
        this.resize(400);
    }
    NeuronControlPanel.prototype.createContourSection = function () {
        if (this.parent.reconstruction.contours.length == 0)
            return;
        var parent = ControlPanel_1.ControlPanel.createSet("contours_section");
        parent.classList.add("collapse"); // Make section collapsible
        var legend = ControlPanel_1.ControlPanel.createLegend("Contours");
        legend.setAttribute("data-toggle", "collapse");
        legend.setAttribute("data-target", "#" + "contours_section");
        legend.setAttribute("cursor", "copy");
        var contour_boxes = [];
        for (var id = 0; id < this.parent.reconstruction.contours.length; ++id) {
            contour_boxes.push(ControlPanel_1.ControlPanel.createBoxListItem("contour_" + id, this.parent.reconstruction.contours[id].name, true, NeuronControlPanel.cbox_callback(this.parent.reconstruction.contours[id]), NeuronControlPanel.element_callback(this.parent.reconstruction.contours[id]), null, this.parent.reconstruction.contours[id].size(), this.parent.reconstruction.contours[id].face_color));
        }
        parent.appendChild(ControlPanel_1.ControlPanel.createBoxList("contour_list", contour_boxes));
        // Add divs
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    NeuronControlPanel.prototype.createReconstructionSection = function () {
        if (this.parent.reconstruction.neurons.length == 0)
            return;
        var parent = ControlPanel_1.ControlPanel.createSet("reconstruction_section");
        parent.classList.add("collapse"); // Make section collapsible
        var legend = ControlPanel_1.ControlPanel.createLegend("Reconstruction");
        legend.setAttribute("data-toggle", "collapse");
        legend.setAttribute("data-target", "#" + "reconstruction_section");
        legend.setAttribute("cursor", "copy");
        var neuron_boxes = [];
        for (var id = 0; id < this.parent.reconstruction.neurons.length; ++id) {
            neuron_boxes.push(ControlPanel_1.ControlPanel.createBoxListItem("neuron_" + id, this.parent.reconstruction.neurons[id].id, true, NeuronControlPanel.cbox_callback(this.parent.reconstruction.neurons[id], "neuron_" + id + "_neuritelist"), NeuronControlPanel.element_callback((this.parent.reconstruction.neurons[id])), NeuronControlPanel.createNeuriteBoxes(id, this.parent.reconstruction.neurons[id]), this.parent.reconstruction.neurons[id].neurites.length));
        }
        parent.appendChild(ControlPanel_1.ControlPanel.createBoxList("reconstruction_list", neuron_boxes));
        // Add divs
        this.contentDiv.appendChild(legend);
        this.contentDiv.appendChild(parent);
    };
    NeuronControlPanel.createNeuriteBoxes = function (id, n) {
        var neurites = [];
        var neurite_base_id = "neuron_" + id + "_neurite_";
        for (var _i = 0, _a = n.neurites; _i < _a.length; _i++) {
            var neurite = _a[_i];
            var type = NeuronControlPanel.neuriteTypeStr(neurite.type);
            neurites.push(ControlPanel_1.ControlPanel.createBoxListItem(neurite_base_id + neurite.id.toString(), "Neurite #" + neurite.id.toString() + " (" + type + ")", true, NeuronControlPanel.cbox_callback(neurite, neurite_base_id + neurite.id.toString() + "_branchlist"), NeuronControlPanel.element_callback(neurite), NeuronControlPanel.createBranchBoxes(id, neurite), neurite.branchCount(), neurite.getColor()));
        }
        return ControlPanel_1.ControlPanel.createBoxList("neuron_" + id + "_neuritelist", neurites);
    };
    NeuronControlPanel.neuriteTypeStr = function (t) {
        switch (t) {
            case core_1.NeuriteType.dendrite: return "dendrite";
            case core_1.NeuriteType.apical: return "apical";
            case core_1.NeuriteType.axon: return "axon";
            default: return "unknown";
        }
    };
    NeuronControlPanel.createBranchBoxes = function (id, n) {
        var branches = n.allBranches();
        var boxes = [];
        var branch_base_id = "neuron_" + id + "_neurite_" + n.id + "_branch_";
        for (var _i = 0, branches_1 = branches; _i < branches_1.length; _i++) {
            var b = branches_1[_i];
            boxes.push(ControlPanel_1.ControlPanel.createBoxListItem(branch_base_id + b.idString(), b.idString(), true, NeuronControlPanel.cbox_callback(b), NeuronControlPanel.element_callback_branch(b), null, b.size()));
        }
        return ControlPanel_1.ControlPanel.createBoxList("neuron_" + id + "_neurite_" + n.id + "_branchlist", boxes);
    };
    NeuronControlPanel.cbox_callback = function (c, checkId) {
        return function (ev) {
            var element = ev.srcElement;
            c.setEnabled(element.checked);
            if (checkId) {
                var els = document.getElementById(checkId).getElementsByTagName("input");
                for (var i = 0; i < els.length; ++i) {
                    els[i].checked = element.checked;
                }
            }
        };
    };
    NeuronControlPanel.element_callback = function (c) {
        return function (ev) {
            var element = ev.srcElement;
            element.classList.toggle("selected-element");
            if (element.classList.contains("selected-element")) {
                c.setStatus(core_1.Status.highlighted); // need get status or make it public
            }
            else {
                c.setStatus(core_1.Status.none); // need get status or make it public
            }
            // Toggle all descs boxes
            var ch = element.nextElementSibling.getElementsByClassName("list-inner-div");
            for (var i = 0; i < ch.length; ++i) {
                if (element.classList.contains("selected-element")) {
                    ch[i].classList.add("selected-element");
                }
                else {
                    ch[i].classList.remove("selected-element");
                }
            }
        };
    };
    NeuronControlPanel.element_callback_branch = function (c) {
        return function (ev) {
            var element = ev.srcElement;
            element.classList.toggle("selected-element");
            if (element.classList.contains("selected-element")) {
                c.setStatus(core_1.Status.highlighted, false); // need get status or make it public
            }
            else {
                c.setStatus(core_1.Status.none, false); // need get status or make it public
            }
        };
    };
    NeuronControlPanel.neuron_name = "Reconstruction";
    return NeuronControlPanel;
}(ControlPanel_1.ControlPanel));
exports.NeuronControlPanel = NeuronControlPanel;
//# sourceMappingURL=NeuronPanel.js.map