"use strict";
exports.default_config_engine = {
    "antialias": true,
    "prserveDrawingBuffer": true
};
(function (CameraType) {
    CameraType[CameraType["universal"] = 0] = "universal";
    CameraType[CameraType["pivot"] = 1] = "pivot";
})(exports.CameraType || (exports.CameraType = {}));
var CameraType = exports.CameraType;
;
;
exports.default_config_camera = {
    "type": CameraType.pivot,
    "initPos": new BABYLON.Vector3(1, 1, 1),
    "target": BABYLON.Vector3.Zero(),
    "inertia": 0,
    "radius": 1.5,
    "speed": 0.1,
    "alpha": Math.PI / 4,
    "beta": Math.PI / 4
};
;
exports.default_config_info = {
    "enable": false
};
;
exports.default_config_grid = {
    "enable": true,
    xGridColor: new BABYLON.Color3(1, 0.75, 0.75),
    yGridColor: new BABYLON.Color3(0.75, 1, 0.75),
    zGridColor: new BABYLON.Color3(0.75, 0.75, 1),
    mainColor: BABYLON.Color3.Black()
};
;
exports.default_config_scene = {
    "bgColor": BABYLON.Color3.Black(),
    "ambientColor": new BABYLON.Color3(0.1, 0.1, 0.1),
    info: exports.default_config_info
};
;
exports.default_config = {
    engine: exports.default_config_engine,
    camera: exports.default_config_camera,
    scene: exports.default_config_scene
};
//# sourceMappingURL=BabylonConfigs.js.map