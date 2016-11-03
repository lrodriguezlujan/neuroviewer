"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ControlPanel_1 = require("./ControlPanel");
var OptionsControlPanel = (function (_super) {
    __extends(OptionsControlPanel, _super);
    function OptionsControlPanel(parentDiv, d) {
        _super.call(this, "Options", parentDiv);
        // Mark panes as options panel
        this.panelDiv.classList.add("optionsPanel");
        // Default size and position
        this.move(10, 50);
        this.resize(100, 500);
    }
    OptionsControlPanel.options_name = "Options";
    return OptionsControlPanel;
}(ControlPanel_1.ControlPanel));
exports.OptionsControlPanel = OptionsControlPanel;
//# sourceMappingURL=OptionsPanel.js.map