"use strict";
var core_1 = require("@neuroviewer/core");
exports.default_config_engine = {
    "antialias": true,
    "prserveDrawingBuffer": true
};
;
exports.default_config_camera = {
    "type": core_1.CameraType.pivot,
    "initPos": new BABYLON.Vector3(1, 1, 1),
    "target": BABYLON.Vector3.Zero(),
    "inertia": 0,
    "radius": 1.5,
    "speed": 0.1,
    "alpha": Math.PI / 4,
    "beta": Math.PI / 4
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
    "grid": exports.default_config_grid
};
;
exports.default_config_draw = {
    drawLinear: false,
    sphereNodes: true,
    singleMeshElements: false,
    optLevel: 0,
    segmentsPerCircle: 8
};
;
exports.default_config = {
    engine: exports.default_config_engine,
    camera: exports.default_config_camera,
    scene: exports.default_config_scene,
    draw: exports.default_config_draw
};
//# sourceMappingURL=BabylonConfigs.js.map