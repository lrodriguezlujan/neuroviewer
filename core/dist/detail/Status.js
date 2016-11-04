"use strict";
(function (Status) {
    Status[Status["none"] = 0] = "none";
    Status[Status["invisible"] = 1] = "invisible";
    Status[Status["selected"] = 2] = "selected";
    Status[Status["hidden"] = 3] = "hidden";
    Status[Status["highlighted"] = 4] = "highlighted";
})(exports.Status || (exports.Status = {}));
var Status = exports.Status;
;
function materialPicker(pal, s) {
    if (pal != null) {
        switch (s) {
            case Status.none:
                return this.branch.neurite.material.standard;
            case Status.invisible:
                return this.branch.neurite.material.hidden;
            case Status.selected:
                return this.branch.neurite.material.emmisive;
            case Status.hidden:
                return this.branch.neurite.material.disminished;
            case Status.highlighted:
                return this.branch.neurite.material.highlight;
        }
    }
    else {
        return null;
    }
}
exports.materialPicker = materialPicker;
function materialColorPicker(pal, s) {
    var m = materialPicker(pal, s);
    if (m != null) {
        return m.diffuseColor.toHexString();
    }
    else {
        return "#FFFFFF";
    }
}
exports.materialColorPicker = materialColorPicker;
//# sourceMappingURL=Status.js.map