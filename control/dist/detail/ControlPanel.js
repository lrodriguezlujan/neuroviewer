"use strict";
var ControlPanel = (function () {
    function ControlPanel(panelId, panelName, parentDiv) {
        this.panelId = panelId;
        this.panelName = panelName;
        this.parentDiv = parentDiv;
        this.visible = false;
        this.dragMoveListener = function (event) {
            var target = event.target, 
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx, y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';
            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            // console log
            // console.log("POSITION: " + x + "," + y);
        };
        this.resizeMoveListener = function (event) {
            var target = event.target, x = (parseFloat(target.getAttribute('data-x')) || 0), y = (parseFloat(target.getAttribute('data-y')) || 0);
            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';
            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;
            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        };
        // Create panel
        this.createPanelDiv();
        // Hide it
        this.hide();
        // Make draggable and resizable
        this.makeDraggable();
        this.makeResizable();
    }
    ControlPanel.prototype.move = function (x, y) {
        this.panelDiv.style.left = x + "px";
        this.panelDiv.style.top = y + "px";
    };
    ControlPanel.prototype.resize = function (x, y) {
        this.panelDiv.style.width = x + "px";
        //this.panelDiv.style.height = y + "px";
    };
    ControlPanel.prototype.show = function () {
        this.visible = true;
        this.panelDiv.style.visibility = null;
    };
    ControlPanel.prototype.hide = function () {
        this.visible = false;
        this.panelDiv.style.visibility = "hidden";
    };
    ControlPanel.prototype.trigger = function () {
        this.visible = !this.visible;
        if (!this.visible)
            this.panelDiv.style.visibility = "hidden";
        return this.visible;
    };
    ControlPanel.prototype.add = function (c) {
        this.contentDiv.appendChild(c);
    };
    ControlPanel.prototype.dispose = function () {
        this.panelDiv.remove();
    };
    ControlPanel.prototype.createHeaderDiv = function () {
        // Create div
        this.headerDiv = document.createElement("div");
        this.headerDiv.id = this.panelId + "_header";
        // Add style
        this.headerDiv.classList.add("controlHeader");
        this.headerDiv.appendChild(document.createTextNode(this.panelName));
        // Header collapse content
        this.headerDiv.setAttribute("data-toggle", "collapse");
        this.headerDiv.setAttribute("data-target", "#" + this.panelId + "_content");
        this.headerDiv.setAttribute("cursor", "copy");
    };
    ControlPanel.prototype.createContentDiv = function () {
        // Create div
        this.contentDiv = document.createElement("div");
        this.contentDiv.id = this.panelId + "_content";
        // Add style
        this.contentDiv.classList.add("controlContent");
        this.contentDiv.classList.add("collapse");
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
            inertia: false,
            restrict: {
                restriction: 'parent',
            },
            onmove: this.dragMoveListener
        });
    };
    ControlPanel.prototype.makeResizable = function () {
        interact(this.panelDiv)
            .resizable({
            enabled: true,
            edges: {
                top: false,
                bottom: false,
                left: true,
                right: true
            },
            restrict: {
                restriction: 'parent',
            },
            invert: 'reposition',
            square: false,
            inertia: false,
            axis: 'x'
        })
            .on('resizemove', this.resizeMoveListener);
    };
    // Static functions for the panels
    ControlPanel.createSimpleRadioInput = function (id, name, value, selected, cb) {
        var input = document.createElement("input");
        input.type = "radio";
        input.name = id;
        input.id = id;
        input.name = name;
        input.value = value;
        input.checked = selected;
        input.onchange = cb;
        return input;
    };
    ControlPanel.createSimpleCBInput = function (id, name, selected, cb) {
        var div = document.createElement("div");
        div.classList.add("checkbox");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("styled");
        input.id = id;
        input.checked = selected;
        input.onchange = cb;
        div.appendChild(input);
        div.appendChild(ControlPanel.createLabelTag(id, name));
        return div;
    };
    ControlPanel.createInputBox = function (id, type, cb, value) {
        var input = document.createElement("input");
        input.type = type;
        input.classList.add("form-control");
        input.id = id;
        input.onchange = cb;
        if (value)
            input.value = value;
        return input;
    };
    ControlPanel.createLabelTag = function (id, text) {
        var label = document.createElement("label");
        label.htmlFor = id;
        label.appendChild(document.createTextNode(text));
        return label;
    };
    ControlPanel.createSet = function (id) {
        var div = document.createElement("div");
        div.classList.add("section");
        div.id = id;
        return div;
    };
    ControlPanel.createGlyphicon = function (id) {
        var span = document.createElement("span");
        span.classList.add("glyphicon");
        span.classList.add(id);
        span.setAttribute("aria-hidden", "true");
        return span;
    };
    ControlPanel.createLegend = function (text) {
        var legend = document.createElement("legend");
        legend.appendChild(document.createTextNode(text));
        return legend;
    };
    ControlPanel.createRadioBoxInput = function (id, name, value, label, selected, cb, classes) {
        var parent = document.createElement("div");
        // this is mandatory
        parent.classList.add("checkbox");
        // Add additional classes if needed
        if (classes) {
            for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
                var c = classes_1[_i];
                parent.classList.add(c);
            }
        }
        // Add input
        parent.appendChild(ControlPanel.createSimpleRadioInput(id, name, value, selected, cb));
        parent.appendChild(ControlPanel.createLabelTag(id, label));
        return parent;
    };
    ControlPanel.createRadioBoxSelector = function (label, name, values, cb, selected) {
        var parent = document.createElement("fieldset");
        parent.id = name + "_fs";
        parent.appendChild(ControlPanel.createLabelTag(name + "_fs", label));
        for (var k in values) {
            var sel = selected && selected == k;
            parent.appendChild(ControlPanel.createRadioBoxInput(k, name, k, values[k], sel, cb));
        }
        return parent;
    };
    return ControlPanel;
}());
exports.ControlPanel = ControlPanel;
//# sourceMappingURL=ControlPanel.js.map