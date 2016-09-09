import * as babylonConfigs from "./BabylonConfigs";
import { Point3D, Drawer } from "@neuroviewer/core";
import { BabylonMaterialPalette } from "./BabylonPalette";
/**
* Drawer class - scene management
*/
export declare class BabylonDrawer implements Drawer {
    protected canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement, cfg?: babylonConfigs.DrawerConfig);
    /**********
     *  Class data members
     **********/
    private config;
    private initialized;
    palette: BabylonMaterialPalette;
    protected engine: BABYLON.Engine;
    protected scene: BABYLON.Scene;
    protected octtree: BABYLON.Octree<BABYLON.AbstractMesh>;
    protected camera: BABYLON.TargetCamera;
    protected lights: Array<BABYLON.Light>;
    infoPanel: BABYLON.ScreenSpaceCanvas2D;
    protected loopCallbackFunction: (instance: Drawer) => void;
    /**
    * Set loop function to be called before rendering
    **/
    setLoopFunction(fn: (instance: Drawer) => void): void;
    protected sceneScaling: number;
    protected grid: Array<BABYLON.AbstractMesh>;
    /**
    * Initialize the drawer. Note that the object can be constructer but not initialized
    * Initialization blocks some config params.
    *
    * @todo implement
    *
    * @public
    * @return none
    */
    init(): void;
    private static cameraLimits(camera);
    /**
     * Releases resources allocated by the drawer
     *
     * @todo implement
     *
     * @public
     * @return none
     */
    dispose(): void;
    setBackgroundColor(col: BABYLON.Color3): void;
    setAmbientColor(col: BABYLON.Color3): void;
    setLoadingScreen(loader: BABYLON.ILoadingScreen): void;
    updateOcttree(): void;
    createInfoPanel(cfg: babylonConfigs.InfoPanelConfig): BABYLON.ScreenSpaceCanvas2D;
    setCamera(camera: BABYLON.TargetCamera): void;
    private initCamera();
    private initUniversalCamera();
    private initPivotCamera();
    resetCamera(): void;
    setCameraPosition(pos: BABYLON.Vector3): void;
    setCameraTarget(target: BABYLON.Vector3): void;
    setCameraSpeed(speed: number): void;
    setCameraInertia(inertia: number): void;
    setCameraFOV(fov: number): void;
    createGrid(cfg: babylonConfigs.GridConfig): void;
    private createLabelText(id, text, position, textColor, backColor);
    drawSphere(name: string, position: Point3D, radius: number): BABYLON.Mesh;
    drawCylinder(name: string, from_p: Point3D, to_p: Point3D, initRad: number, endRad: number): BABYLON.Mesh;
    drawLineBox(root_p: Point3D, x: number, y: number, z: number): BABYLON.LinesMesh;
    merge(meshes: Array<BABYLON.Mesh>): BABYLON.Mesh;
    private computeSceneNormalizationScale();
    /**
    * Scales the scene
    */
    scaleScene(scale: number): void;
    normalizeScene(): void;
    /**
     * Runs the scene optimizer
     *
     * @param {number} level - Optimization level (0-low, 2-high)
     *
     * @return Promise
     */
    optimize(level: number): void;
    addPointerUpCallback(cb: (distance: number, mesh: BABYLON.AbstractMesh, subMeshID?: number) => void): void;
}