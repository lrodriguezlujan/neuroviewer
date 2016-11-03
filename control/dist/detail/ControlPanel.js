"use strict";
var ControlPanel = (function () {
    function ControlPanel(panelName, parentDiv) {
        this.panelName = panelName;
        this.parentDiv = parentDiv;
        this.visible = false;
        // Create panel
        this.createPanelDiv();
        // Hide it
        this.hide();
        // Make draggable and resizable
        this.makeDraggable();
        this.makeResizable();
    }
    ControlPanel.prototype.move = function (x, y) {
        this.panelDiv.style.top = x + "px";
        this.panelDiv.style.left = y + "px";
    };
    ControlPanel.prototype.resize = function (x, y) {
        this.panelDiv.style.width = x + "px";
        this.panelDiv.style.height = y + "px";
    };
    ControlPanel.prototype.show = function () {
        this.visible = true;
        this.panelDiv.style.visibility = null;
    };
    ControlPanel.prototype.hide = function () {
        this.visible = false;
        this.panelDiv.style.visibility = "hidden";
    };
    ControlPanel.prototype.add = function (c) {
        this.contentDiv.appendChild(c);
    };
    ControlPanel.prototype.createHeaderDiv = function () {
        // Create div
        this.headerDiv = document.createElement("div");
        // Add style
        this.headerDiv.classList.add("controlHeader");
    };
    ControlPanel.prototype.createContentDiv = function () {
        // Create div
        this.contentDiv = document.createElement("div");
        // Add style
        this.contentDiv.classList.add("controlContent");
    };
    ControlPanel.prototype.createPanelDiv = function () {
        // Create content and header div
        this.createHeaderDiv();
        this.createContentDiv();
        // Create div
        this.panelDiv = document.createElement("div");
        this.panelDiv.classList.add("controlPanel");
        // Add to panel- order is importante
        this.panelDiv.appendChild(this.headerDiv);
        this.panelDiv.appendChild(this.contentDiv);
        this.parentDiv.appendChild(this.panelDiv);
    };
    ControlPanel.prototype.makeDraggable = function () {
        interact(this.panelDiv)
            .draggable({
            enabled: true,
            inertia: false,
            restrict: {
                restriction: 'parent'
            }
        });
    };
    ControlPanel.prototype.makeResizable = function () {
        interact(this.panelDiv)
            .resizable({
            enabled: true,
            edges: {
                top: false,
                bottom: true,
                left: false,
                right: true
            },
            invert: 'reposition',
            restrict: {
                restriction: 'parent'
            },
            square: false,
            inertia: false
        });
    };
    return ControlPanel;
}());
exports.ControlPanel = ControlPanel;
//# sourceMappingURL=ControlPanel.js.map