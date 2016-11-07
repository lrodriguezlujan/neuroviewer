export interface Point3D {
    x: number;
    y: number;
    z: number;
}
export interface DrawObject {
    material: DrawMaterial;
    dispose: () => void;
    setEnabled: (value: boolean) => void;
    isEnabled: () => boolean;
    color?: DrawColor;
}
export declare enum CameraType {
    universal = 0,
    pivot = 1,
}
export interface Drawer {
    palette: DrawMaterialPalette;
    drawSphere: (id: string, position: Point3D, radius: number) => DrawObject;
    drawCylinder: (id: string, from: Point3D, to: Point3D, fromRadius: number, toRadius: number) => DrawObject;
    merge: (objs: Array<DrawObject>) => DrawObject;
    drawLineBox: (min: Point3D, lenx: number, leny: number, lenz: number) => DrawObject;
    drawContour: (points: Array<Point3D>, closed: boolean, color: string, fillcolor: string, opacity: number) => DrawObject;
    drawLines: (lines: Array<Array<Point3D>>, color: string) => DrawObject;
    drawLine: (id: string, source: Point3D, target: Point3D, color: string) => DrawObject;
    dispose: () => void;
    addLoopFunction: (fn: (d: Drawer) => void) => void;
    clearLoopFunctions: () => void;
    optimize: (level?: number, cb?: () => any) => any;
    getCanvasPosition: () => Array<number>;
    getCanvasSize: () => Array<number>;
    attachResizeListener: (fn: () => void) => void;
    getCameraType: () => CameraType;
    setCameraType: (type: CameraType) => void;
    getCameraSpeed: () => number;
    setCameraSpeed: (sp: number) => void;
    getCameraInertia: () => number;
    setCameraInertia: (inertia: number) => void;
    getCameraPanSensibility: () => number;
    setCameraPanSensibility: (v: number) => void;
    getCameraWheelSensibility: () => number;
    setCameraWheelSensibility: (v: number) => void;
    resetCamera: () => void;
    cameraAddRotation: (alphaDelta: number, betaDelta: number) => void;
    setCircularSegmentsCount: (v: number) => void;
    getCircularSegmentsCount: () => void;
    showGrid: (v: boolean) => void;
    visibleGrid: () => boolean;
    normalizeScene: () => void;
    colorFormHex: (color: string) => DrawColor;
}
export interface DrawColor {
    toHexString: () => string;
}
export interface DrawMaterial {
    diffuseColor?: DrawColor;
    markDirty(): any;
}
export interface DrawMaterialSet {
    standard: DrawMaterial;
    hidden: DrawMaterial;
    emmisive: DrawMaterial;
    disminished: DrawMaterial;
    highlight: DrawMaterial;
    getStandardHexcolor: () => string;
}
export interface DrawMaterialPalette {
    grey: () => DrawMaterialSet;
    get: (index: number) => DrawMaterialSet;
    count: () => number;
}
