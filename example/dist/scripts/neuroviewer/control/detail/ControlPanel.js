"use strict";
/**
 * Base control panel class
 */
var ControlPanel = (function () {
    /**
     * Creates a panel
     * @param  {string}  panelId   Panel internal id
     * @param  {string}  panelName Panel name (title)
     * @param  {Control} parent  Parent cotnrol layer
     */
    function ControlPanel(panelId, panelName, parent) {
        this.panelId = panelId;
        this.panelName = panelName;
        this.parent = parent;
        // Panel visibility
        this.visible = false;
        /**
         * Listener function for drag events
         */
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
        };
        /**
         * Resize event listener
         */
        this.resizeMoveListener = function (event) {
            var target = event.target, x = (parseFloat(target.getAttribute('data-x')) || 0), y = (parseFloat(target.getAttribute('data-y')) || 0);
            // update the element's style
            if (event.rect.width >= 150) {
                target.style.width = event.rect.width + 'px';
                //target.style.height = event.rect.height + 'px';
                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;
                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        };
        // Set parent div
        this.parentDiv = parent.getControlDiv();
        // Create panel
        this.createPanelDiv();
        // Hide it
        this.hide();
        // Make draggable and resizable
        this.makeDraggable();
        this.makeResizable();
    }
    /**
     * Moves the panel to the given position
     */
    ControlPanel.prototype.move = function (x, y) {
        this.panelDiv.style.left = x + "px";
        this.panelDiv.style.top = y + "px";
    };
    /**
     * Resizes the panel
     */
    ControlPanel.prototype.resize = function (x, y) {
        this.panelDiv.style.width = x + "px";
    };
    /**
     * Makes the panel visible
     */
    ControlPanel.prototype.show = function () {
        this.visible = true;
        this.panelDiv.style.visibility = null;
    };
    /**
     * Hides the panel
     */
    ControlPanel.prototype.hide = function () {
        this.visible = false;
        this.panelDiv.style.visibility = "hidden";
    };
    /**
     * Triggers panel visibility
     */
    ControlPanel.prototype.trigger = function () {
        this.visible = !this.visible;
        if (!this.visible)
            this.panelDiv.style.visibility = "hidden";
        return this.visible;
    };
    /**
     * Adds a new element to the panel content
     */
    ControlPanel.prototype.add = function (c) {
        this.contentDiv.appendChild(c);
    };
    /**
     * Removes the panel
     */
    ControlPanel.prototype.dispose = function () {
        this.panelDiv.remove();
    };
    /**
     * Creates the panel header div
     */
    ControlPanel.prototype.createHeaderDiv = function () {
        // Create div
        this.headerDiv = document.createElement("div");
        this.headerDiv.id = this.panelId + "_header";
        var icon = ControlPanel.createGlyphicon("glyphicon-plus");
        icon.classList.add("collapse_icon");
        //icon.style.cssFloat="left";
        icon.setAttribute("data-toggle", "collapse");
        icon.setAttribute("data-target", "#" + this.panelId + "_content");
        icon.setAttribute("cursor", "copy");
        // Toggle icon
        icon.onclick = function (ev) {
            var target = (ev.srcElement || ev.target);
            target.classList.toggle("glyphicon-plus");
            target.classList.toggle("glyphicon-minus");
        };
        this.headerDiv.appendChild(icon);
        // Add style
        this.headerDiv.classList.add("controlHeader");
        this.headerDiv.appendChild(document.createTextNode(this.panelName));
    };
    /**
     * Creates the content div
     */
    ControlPanel.prototype.createContentDiv = function () {
        // Create div
        this.contentDiv = document.createElement("div");
        this.contentDiv.id = this.panelId + "_content";
        // Add style
        this.contentDiv.classList.add("controlContent");
        this.contentDiv.classList.add("collapse");
    };
    /**
     * Creates the entire panel. Header and content divs
     */
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
    /**
     * Makes the panel draggable
     */
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
    /**
     * Makes the panel resizable
     */
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
    // These are auxiliar functions to create panel content
    /**
     * Creates a radio input element
     * @param  {string}  id       Radio input id
     * @param  {string}  name     Radio (group) name
     * @param  {string}  value    Radio value (label)
     * @param  {boolean} selected Selected flag
     * @param  {Event}   cb       Callback function on change
     * @return {HTMLElement}      Element
     */
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
    /**
     * Creates a checbox input element
     * @param  {string}  id       Checkbox id
     * @param  {string}  name     Checkbox label
     * @param  {boolean} selected Selected flag
     * @param  {Event}   cb       Callback function onchange
     * @return {HTMLElement}      Element
     */
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
    /**
     * Creates a large button
     * @param  {string} id   Button id
     * @param  {string} text Button label
     * @param  {Event}  cb   Onclick function
     * @return {HTMLElement}      Element
     */
    ControlPanel.createButton = function (id, text, cb, icon) {
        var bt = document.createElement("button");
        bt.type = "button";
        bt.id = id;
        bt.classList.add("btn");
        bt.classList.add("btn-default");
        bt.classList.add("btn-lg");
        if (icon)
            bt.appendChild(ControlPanel.createGlyphicon(icon));
        bt.appendChild(document.createTextNode(text));
        bt.onclick = cb;
        return bt;
    };
    /**
     * Creates an input element
     * @param  {string} id   Input id
     * @param  {string} type Type string
     * @param  {Event}  cb   Onchange callback
     * @return {HTMLElement}      Element
     */
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
    /**
     * Creates a list container
     * @param  {string}             id       List id
     * @param  {Array<HTMLElement>} elements List elements
     * @return {HTMLElement}      Element
     */
    ControlPanel.createBoxList = function (id, elements) {
        var div = document.createElement("div");
        div.classList.add("list-group");
        div.id = id;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var el = elements_1[_i];
            div.appendChild(el);
        }
        return div;
    };
    /**
     * Creates hierarchical list element with checbox attached
     * @param  {string}  id      List id
     * @param  {string}  label   List top label
     * @param  {boolean} checked Checked flag
     * @param  {Event}   box_cb  Onchange callback
     * @param  {Event}   el_cb   Ondblclick callback
     * @param  {HTMLElement}   desc   Inner element
     * @param  {number}   nitems   Number of inner items (badge number)
     * @param  {string}   badgeBgColor   Badge hex color string
      * @return {HTMLElement}      Element
     */
    ControlPanel.createBoxListItem = function (id, label, checked, box_cb, el_cb, desc, nitems, badgeBgColor) {
        var div = document.createElement("div");
        div.classList.add("input-group");
        div.id = id + "_inputgroup";
        // Create left box
        var cb_span = document.createElement("span");
        cb_span.classList.add("input-group-addon");
        //cb_span.classList.add("beautiful");
        // Add checkbox
        var cbox = document.createElement("input");
        cbox.type = "checkbox";
        cbox.id = id;
        cbox.checked = checked;
        cbox.onchange = box_cb;
        //cbox.classList.add("input-list-cbox")
        cb_span.appendChild(cbox);
        div.appendChild(cb_span);
        // Add label + collapse stuff
        var inner_div = document.createElement("div");
        inner_div.classList.add("form-control");
        inner_div.ondblclick = el_cb;
        inner_div.classList.add("list-inner-div");
        if (desc) {
            var expand = ControlPanel.createGlyphicon("glyphicon-plus");
            expand.style.paddingRight = "5px";
            expand.style.cursor = "hand";
            expand.onclick = function (ev) {
                var target = (ev.srcElement || ev.target);
                target.classList.toggle("glyphicon-plus");
                target.classList.toggle("glyphicon-minus");
            };
            expand.setAttribute("data-toggle", "collapse");
            expand.setAttribute("data-target", "#" + desc.id);
            expand.setAttribute("cursor", "copy");
            desc.classList.add("collapse");
            desc.classList.add("inner-list");
            inner_div.appendChild(expand);
            //inner_div.classList.add("collapsible_boxlist_item");
            inner_div.classList.add("list-with-desc");
        }
        // Add text
        inner_div.appendChild(document.createTextNode(label));
        if (nitems != null) {
            var badge = document.createElement("span");
            badge.classList.add("badge");
            badge.appendChild(document.createTextNode(nitems.toString()));
            if (badgeBgColor) {
                badge.style.backgroundColor = badgeBgColor;
                badge.style.color = "#EEE";
                badge.style.border = "1px solid #ccc";
            }
            badge.style.cssFloat = "right";
            inner_div.appendChild(badge);
        }
        div.appendChild(inner_div);
        if (desc) {
            div.appendChild(desc);
        }
        return div;
    };
    /**
     * Creates a label tag for an input
     * @param  {string} id   Input element id
     * @param  {string} text Label
     */
    ControlPanel.createLabelTag = function (id, text) {
        var label = document.createElement("label");
        label.htmlFor = id;
        label.appendChild(document.createTextNode(text));
        return label;
    };
    /**
     * Creates a div section
     * @param  {string} id Div id
     */
    ControlPanel.createSet = function (id) {
        var div = document.createElement("div");
        div.classList.add("section");
        div.id = id;
        return div;
    };
    /**
     * Creates a glyphicon
     * @param  {string} id icon id
     */
    ControlPanel.createGlyphicon = function (id) {
        var span = document.createElement("span");
        span.classList.add("glyphicon");
        span.classList.add(id);
        span.setAttribute("aria-hidden", "true");
        return span;
    };
    /**
     * Creates a legend element
     * @param  {string} text Legend text
     */
    ControlPanel.createLegend = function (text) {
        var legend = document.createElement("legend");
        legend.appendChild(document.createTextNode(text));
        return legend;
    };
    /**
     * Creates a set of radio box input
     * @param  {string}  id       Id
     * @param  {string}  name     Group id
     * @param  {string}  value    Group value
     * @param  {string}  label    label text
     * @param  {boolean} selected selected flag
     * @param  {Event}   cb       Onchange callback
     */
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
    /**
     * Creates a radio box selector
     * @param  {string}  label  Label
     * @param  {string}  name   Set name
     * @param  {string}} values Values (key . value)
     * @param  {Event}   cb     Onchange callback
     */
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