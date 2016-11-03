"use strict";
var Control = (function () {
    function Control(drawer) {
        var _this = this;
        this.drawer = drawer;
        this.canvasResizeListener = function () {
            _this.updateDrawerPosition();
            _this.updateDrawerSize();
        };
        this.createLayer();
    }
    Control.prototype.createLayer = function () {
        this.controlLayer = document.createElement("div");
        this.controlLayer.style.position = "absolute";
        this.controlLayer.style["pointer-events"] = "none";
        this.controlLayer.id = "ControlLayer";
        this.drawer.attachResizeListener(this.canvasResizeListener);
        window.addEventListener("resize", this.canvasResizeListener);
        this.updateDrawerPosition();
        this.updateDrawerSize();
        document.body.appendChild(this.controlLayer);
    };
    Control.prototype.updateDrawerPosition = function () {
        var position = this.drawer.getCanvasPosition();
        this.controlLayer.style.left = position[0] + "px";
        this.controlLayer.style.top = position[1] + "px";
    };
    Control.prototype.updateDrawerSize = function () {
        var size = this.drawer.getCanvasSize();
        this.controlLayer.style.width = size[0] + "px";
        this.controlLayer.style.height = size[1] + "px";
    };
    return Control;
}());
exports.Control = Control;
//# sourceMappingURL=NvControl.js.map