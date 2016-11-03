"use strict";
var babylonConfigs = require("./BabylonConfigs");
var BabylonPalette_1 = require("./BabylonPalette");
/**
* Drawer class - scene management
*/
var BabylonDrawer = (function () {
    function BabylonDrawer(canvas, cfg) {
        if (cfg === void 0) { cfg = babylonConfigs.default_config; }
        this.canvas = canvas;
        this.initialized = false;
        // Scene scaling
        this.sceneScaling = 1;
        // TODO: Expand default config with cfg
        this.config = cfg;
        this.engine = new BABYLON.Engine(this.canvas, this.config.engine.antialias, this.config.engine);
    }
    /**
    * Set loop function to be called before rendering
    **/
    BabylonDrawer.prototype.setLoopFunction = function (fn) {
        this.loopCallbackFunction = fn;
    };
    /**
    * Initialize the drawer. Note that the object can be constructer but not initialized
    * Initialization blocks some config params.
    *
    * @todo implement
    *
    * @public
    * @return none
    */
    BabylonDrawer.prototype.init = function () {
        var _this = this;
        this.scene = new BABYLON.Scene(this.engine);
        // Set background color
        this.scene.clearColor = this.config.scene.bgColor;
        // Set ambient color
        this.scene.ambientColor = this.config.scene.ambientColor;
        // Material palette
        this.palette = new BabylonPalette_1.BabylonMaterialPalette(this.scene);
        // Scene is initialized
        this.initialized = true;
        // Camera
        this.initCamera();
        // Default light TODO
        this.lights = [];
        var light0 = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), this.scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(1, 1, 1);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);
        this.lights.push(light0);
        var spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(25, 15, -10), new BABYLON.Vector3(-1, -0.8, 1), 15, 1, this.scene);
        spot.diffuse = new BABYLON.Color3(1, 1, 1);
        spot.specular = new BABYLON.Color3(0, 0, 0);
        spot.intensity = 0.8;
        this.lights.push(spot);
        this.engine.runRenderLoop(function () {
            if (_this.loopCallbackFunction)
                _this.loopCallbackFunction(_this);
            // Control camera limits
            if (_this.config.camera.type == babylonConfigs.CameraType.universal) {
                BabylonDrawer.cameraLimits(_this.camera);
            }
            _this.scene.render();
        });
        // Set up info panel
        if (this.config.scene.info) {
            this.createInfoPanel(this.config.scene.info);
        }
    };
    BabylonDrawer.cameraLimits = function (camera) {
        if (camera.position.x > 3)
            camera.position.x = 3;
        if (camera.position.x < -3)
            camera.position.x = -3;
        if (camera.position.y > 3)
            camera.position.y = 3;
        if (camera.position.y < -3)
            camera.position.y = -3;
        if (camera.position.z > 3)
            camera.position.z = 3;
        if (camera.position.z < -3)
            camera.position.z = -3;
    };
    /**
     * Releases resources allocated by the drawer
     *
     * @todo implement
     *
     * @public
     * @return none
     */
    BabylonDrawer.prototype.dispose = function () {
        this.camera.dispose();
        for (var _i = 0, _a = this.lights; _i < _a.length; _i++) {
            var l = _a[_i];
            l.dispose();
        }
        this.scene.dispose();
        this.engine.dispose();
        this.initialized = false;
    };
    BabylonDrawer.prototype.setBackgroundColor = function (col) {
        this.config.scene.bgColor = col;
        if (this.initialized) {
            this.scene.clearColor = col;
        }
    };
    BabylonDrawer.prototype.setAmbientColor = function (col) {
        this.config.scene.ambientColor = col;
        if (this.initialized) {
            this.scene.ambientColor = col;
        }
    };
    BabylonDrawer.prototype.setLoadingScreen = function (loader) {
        this.engine.loadingScreen = loader;
    };
    BabylonDrawer.prototype.updateOcttree = function () {
        if (this.initialized) {
            this.octtree = this.scene.createOrUpdateSelectionOctree(16, 3); // TODO: CONFIG
        }
    };
    // INFO PANEL
    BabylonDrawer.prototype.createInfoPanel = function (cfg) {
        if (this.infoPanel)
            this.infoPanel.dispose();
        if (cfg.enable) {
            this.infoPanel = new BABYLON.ScreenSpaceCanvas2D(this.scene, { id: "infoPanel",
                position: cfg.position,
                size: cfg.size });
            this.infoPanel.isPickable = false;
        }
        return this.infoPanel;
    };
    // CAMERA
    BabylonDrawer.prototype.setCamera = function (camera) {
        this.camera = camera;
    };
    BabylonDrawer.prototype.initCamera = function () {
        if (this.config.camera.type == babylonConfigs.CameraType.universal) {
            this.initUniversalCamera();
        }
        else {
            this.initPivotCamera();
        }
        this.setCameraPosition(new BABYLON.Vector3(2.25, 2.25, 2.25));
        this.camera.minZ = 0;
        this.camera.maxZ = 1E6;
        this.camera.attachControl(this.canvas);
    };
    BabylonDrawer.prototype.initUniversalCamera = function () {
        this.camera = new BABYLON.UniversalCamera("camera", this.config.camera.initPos, this.scene);
        // Target
        this.setCameraTarget(this.config.camera.target);
        this.setCameraSpeed(this.config.camera.speed);
        this.setCameraInertia(this.config.camera.inertia);
        this.setCameraFOV(this.config.camera.fov);
    };
    BabylonDrawer.prototype.initPivotCamera = function () {
        var camera = new BABYLON.ArcRotateCamera("camera", this.config.camera.alpha, this.config.camera.beta, this.config.camera.radius, this.config.camera.target, this.scene);
        camera.lowerRadiusLimit = 0;
        camera.upperRadiusLimit = 3;
        camera.panningSensibility = 500;
        camera.wheelPrecision = 200;
        camera.inertialPanningX = 0;
        camera.inertialPanningY = 0;
        this.camera = camera;
        // Target
        // this.setCameraSpeed(this.config.camera.speed);
        // this.setCameraInertia(this.config.camera.inertia);
        this.setCameraFOV(this.config.camera.fov);
    };
    BabylonDrawer.prototype.resetCamera = function () {
        this.camera.dispose();
        this.initCamera();
    };
    BabylonDrawer.prototype.setCameraPosition = function (pos) {
        if (pos && this.initialized) {
            this.camera.position = pos;
        }
    };
    BabylonDrawer.prototype.setCameraTarget = function (target) {
        if (target && this.initialized) {
            this.camera.setTarget(target);
        }
    };
    BabylonDrawer.prototype.setCameraSpeed = function (speed) {
        if (speed && this.initialized) {
            this.camera.speed = speed;
        }
    };
    BabylonDrawer.prototype.setCameraInertia = function (inertia) {
        if (inertia && this.initialized) {
            this.camera.inertia = inertia;
        }
    };
    BabylonDrawer.prototype.setCameraFOV = function (fov) {
        if (fov && this.initialized) {
            this.camera.fov = fov;
        }
    };
    // Create scene grid
    BabylonDrawer.prototype.createGrid = function (cfg) {
        // Remove previous grid
        if (this.grid) {
            for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
                var g = _a[_i];
                g.dispose();
            }
        }
        if (cfg && cfg.enable) {
            // Default grid. TODO: Configure
            var baseGridMaterial = new BABYLON.GridMaterial("gridMaterial", this.scene);
            baseGridMaterial.mainColor = cfg.mainColor;
            baseGridMaterial.opacity = 0.98;
            baseGridMaterial.gridRatio = 0.2;
            baseGridMaterial.backFaceCulling = false;
            baseGridMaterial.majorUnitFrequency = 5;
            // Create a box of size 2
            // this.grid = BABYLON.Mesh.CreateBox("grid",2, this.scene,false,BABYLON.Mesh.DOUBLESIDE);
            this.grid = [];
            // Create planes
            var botPlaneMaterial = baseGridMaterial.clone("botplanematerial");
            botPlaneMaterial.lineColor = cfg.zGridColor;
            var botPlane = BABYLON.Mesh.CreatePlane("grid_bot", 2, this.scene, false);
            botPlane.material = botPlaneMaterial;
            botPlane.position = new BABYLON.Vector3(0, -1, 0);
            botPlane.rotation.x = Math.PI / 2;
            botPlane.isPickable = false;
            this.grid.push(botPlane);
            var backPlaneMaterial = baseGridMaterial.clone("backplanematerial");
            backPlaneMaterial.lineColor = cfg.xGridColor;
            var backPlane = BABYLON.Mesh.CreatePlane("grid_back", 2, this.scene, false);
            backPlane.material = backPlaneMaterial;
            backPlane.position = new BABYLON.Vector3(0, 0, -1);
            backPlane.isPickable = false;
            this.grid.push(backPlane);
            var sidePlaneMaterial = baseGridMaterial.clone("sideplanematerial");
            sidePlaneMaterial.lineColor = cfg.yGridColor;
            var sidePlane = BABYLON.Mesh.CreatePlane("grid_side", 2, this.scene, false);
            sidePlane.material = sidePlaneMaterial;
            sidePlane.position = new BABYLON.Vector3(-1, 0, 0);
            sidePlane.rotation.y = Math.PI / 2;
            sidePlane.isPickable = false;
            this.grid.push(sidePlane);
            this.createLabelText("label_x_axis", "X", new BABYLON.Vector3(1.2, 0, -1), cfg.xGridColor, cfg.mainColor);
            this.createLabelText("label_y_axis", "Y", new BABYLON.Vector3(-1, 1.2, 0), cfg.yGridColor, cfg.mainColor);
            this.createLabelText("label_y_axis", "Z", new BABYLON.Vector3(0, -1, 1.2), cfg.zGridColor, cfg.mainColor);
        }
    };
    BabylonDrawer.prototype.createLabelText = function (id, text, position, textColor, backColor) {
        var outputplane = BABYLON.Mesh.CreatePlane(id, 0.2, this.scene, false);
        outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane.position = position;
        outputplane.isPickable = false;
        // Scalling if needed to get "not square labels"
        var tex = new BABYLON.DynamicTexture(id + "_texture", 256, this.scene, true);
        var mat = new BABYLON.StandardMaterial(id + "_material", this.scene);
        tex.hasAlpha = true;
        tex.getAlphaFromRGB = true;
        mat.diffuseTexture = tex;
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        mat.backFaceCulling = false;
        outputplane.material = mat;
        tex.drawText(text, null, 180, "140px verdana", textColor.toHexString(), "rgba(" + backColor.r + "," + backColor.g + "," + backColor.b + ",0.2)");
        return outputplane;
    };
    BabylonDrawer.prototype.drawSphere = function (name, position, radius) {
        var tmp_sph = BABYLON.Mesh.CreateSphere(name, 8, radius * 2.05, this.scene);
        // Move to location
        tmp_sph.position = new BABYLON.Vector3(position.x, position.y, position.z);
        return tmp_sph;
    };
    BabylonDrawer.prototype.drawCylinder = function (name, from_p, to_p, initRad, endRad) {
        var from = new BABYLON.Vector3(from_p.x, from_p.y, from_p.z);
        var to = new BABYLON.Vector3(to_p.x, to_p.y, to_p.z);
        var tmp_cyl = BABYLON.Mesh.CreateCylinder(name, BABYLON.Vector3.Distance(from, to), endRad * 2, initRad * 2, 8, 1, this.scene);
        // Compute rotation
        var vec = to.subtract(from);
        // Move to position (midpoint)
        tmp_cyl.position = vec.scale(0.5).add(from);
        vec.normalize();
        var v = new BABYLON.Vector3(0, 1, 0);
        if (!v.equals(vec)) {
            var axis = BABYLON.Vector3.Cross(v, vec);
            if (axis.length() == 0) {
                tmp_cyl.rotation = new BABYLON.Vector3(Math.PI, 0, 0); // Special case 180.
            }
            else {
                axis.normalize();
                var rotation = BABYLON.Quaternion.RotationAxis(axis, Math.acos(BABYLON.Vector3.Dot(vec, v)));
                tmp_cyl.rotationQuaternion = rotation;
            }
        }
        return tmp_cyl;
    };
    BabylonDrawer.prototype.drawLineBox = function (root_p, x, y, z) {
        var root = new BABYLON.Vector3(root_p.x, root_p.y, root_p.z);
        var points = [root];
        points.push(root.add(new BABYLON.Vector3(0, 0, z)));
        points.push(root.add(new BABYLON.Vector3(0, y, 0)));
        points.push(root.add(new BABYLON.Vector3(0, y, z)));
        points.push(root.add(new BABYLON.Vector3(x, 0, 0)));
        points.push(root.add(new BABYLON.Vector3(x, 0, z)));
        points.push(root.add(new BABYLON.Vector3(x, y, 0)));
        points.push(root.add(new BABYLON.Vector3(x, y, z)));
        var mesh = BABYLON.MeshBuilder.CreateLineSystem(null, { lines: [
                [points[0], points[1]],
                [points[0], points[2]],
                [points[0], points[4]],
                [points[1], points[3]],
                [points[1], points[5]],
                [points[2], points[3]],
                [points[2], points[6]],
                [points[3], points[7]],
                [points[4], points[5]],
                [points[4], points[6]],
                [points[5], points[7]],
                [points[6], points[7]]
            ],
            updatable: false }, this.scene);
        mesh.color = new BABYLON.Color3(1, 1, 0);
        return mesh;
    };
    // ATM we ignore fillcolor and opacity
    BabylonDrawer.prototype.drawContour = function (points, closed, color, fillcolor, opacity) {
        // Points to vector3
        var points_b = [];
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            points_b.push(new BABYLON.Vector3(p.x, p.y, p.z));
        }
        var lines = [];
        for (var i = 1; i < points_b.length; ++i) {
            lines.push([points_b[i - 1], points_b[i]]);
        }
        var mesh = BABYLON.MeshBuilder.CreateLineSystem(null, { lines: lines,
            updatable: false }, this.scene);
        mesh.color = BABYLON.Color3.FromHexString(color);
        return mesh;
    };
    BabylonDrawer.prototype.drawLines = function (lines, color) {
        // Points to vector3
        var lines_v = [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var l = lines_1[_i];
            lines_v.push([new BABYLON.Vector3(l[0].x, l[0].y, l[0].z), new BABYLON.Vector3(l[1].x, l[1].y, l[1].z)]);
        }
        var mesh = BABYLON.MeshBuilder.CreateLineSystem(null, { lines: lines_v,
            updatable: false }, this.scene);
        mesh.color = BABYLON.Color3.FromHexString(color);
        return mesh;
    };
    BabylonDrawer.prototype.drawLine = function (id, source, target, color) {
        var mesh = BABYLON.MeshBuilder.CreateLines(id, { points: [new BABYLON.Vector3(source.x, source.y, source.z),
                new BABYLON.Vector3(target.x, target.y, target.z)],
            updatable: false }, this.scene);
        mesh.color = BABYLON.Color3.FromHexString(color);
        return mesh;
    };
    BabylonDrawer.prototype.merge = function (meshes) {
        return BABYLON.Mesh.MergeMeshes(meshes, true);
    };
    BabylonDrawer.prototype.computeSceneNormalizationScale = function () {
        var min = new BABYLON.Vector3(1e6, 1e6, 1e6);
        var max = new BABYLON.Vector3(-1e6, -1e6, -1e6);
        // Get scene bounds
        for (var _i = 0, _a = this.scene.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            var binfo = mesh.getBoundingInfo();
            min.MinimizeInPlace(binfo.minimum.add(mesh.position));
            max.MaximizeInPlace(binfo.maximum.add(mesh.position));
        }
        var scale = 1;
        // Lower bound scale
        if (min.x < -1)
            scale = Math.min(scale, -1 / min.x);
        if (min.y < -1)
            scale = Math.min(scale, -1 / min.y);
        if (min.z < -1)
            scale = Math.min(scale, -1 / min.z);
        // Upper bound
        if (max.x > 1)
            scale = Math.min(scale, 1 / max.x);
        if (max.y > 1)
            scale = Math.min(scale, 1 / max.y);
        if (max.z > 1)
            scale = Math.min(scale, 1 / max.z);
        return scale;
    };
    /**
    * Scales the scene
    */
    BabylonDrawer.prototype.scaleScene = function (scale) {
        var scaling = new BABYLON.Vector3(scale, scale, scale);
        for (var _i = 0, _a = this.scene.meshes; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh.position.multiplyInPlace(scaling);
            mesh.scaling = scaling;
        }
    };
    BabylonDrawer.prototype.normalizeScene = function () {
        this.sceneScaling = this.computeSceneNormalizationScale();
        this.scaleScene(this.sceneScaling);
    };
    /**
     * Runs the scene optimizer
     *
     * @param {number} level - Optimization level (0-low, 2-high)
     *
     * @return Promise
     */
    BabylonDrawer.prototype.optimize = function (level) {
        if (level <= 0) {
            BABYLON.SceneOptimizerOptions.LowDegradationAllowed();
        }
        else if (level == 1) {
            BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
        }
        else {
            BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
        }
        return BABYLON.SceneOptimizer.OptimizeAsync(this.scene);
    };
    BabylonDrawer.prototype.addPointerUpCallback = function (cb) {
        /*this.scene.onPointerObservable = function(evt, res) {
          cb(res.hit, res.distance, res.pickedMesh);
        }*/
        this.scene.onPointerObservable.add(function (l, s) {
            if (l.pickInfo.hit) {
                if (l.pickInfo.subMeshId)
                    cb(l.pickInfo.distance, l.pickInfo.pickedMesh, l.pickInfo.subMeshId);
                else
                    cb(l.pickInfo.distance, l.pickInfo.pickedMesh);
            }
        }, BABYLON.PointerEventTypes.POINTERUP);
    };
    return BabylonDrawer;
}());
exports.BabylonDrawer = BabylonDrawer;
; // End class Drawer
var LoadingScreenExample = (function () {
    function LoadingScreenExample(loadingUIText) {
        this.loadingUIText = loadingUIText;
    }
    LoadingScreenExample.prototype.displayLoadingUI = function () {
        alert(this.loadingUIText);
    };
    LoadingScreenExample.prototype.hideLoadingUI = function () {
        alert("Loaded!");
    };
    return LoadingScreenExample;
}()); // End class LoadingScreenExample
//# sourceMappingURL=BabylonDrawer.js.map