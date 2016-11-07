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
                return pal.standard;
            case Status.invisible:
                return pal.hidden;
            case Status.selected:
                return pal.emmisive;
            case Status.hidden:
                return pal.disminished;
            case Status.highlighted:
                return pal.highlight;
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