/**
 * Three dimensional point
 */
  export interface Point3D {
      x: number;
      y: number;
      z: number;
  }

/**
 * Draw objects (usually meshes)
 */
  export interface DrawObject {
      material: DrawMaterial;
      dispose: () => void;
      setEnabled: (value:boolean) => void;
      isEnabled: () => boolean;
      color?: DrawColor;
  }; // Intended: BABYLON.AbstractMesh

/**
 * Camera types
 */
  export enum CameraType{
    universal,
    pivot
  };

/**
 * Drawer interface
 */
  export interface Drawer {
      palette: DrawMaterialPalette;
      drawSphere: (id:string, position:Point3D, radius:number) => DrawObject;
      drawCylinder: (id:string, from:Point3D, to:Point3D, fromRadius:number , toRadius:number) => DrawObject;
      merge: (objs:Array<DrawObject>) => DrawObject;
      drawLineBox: (min: Point3D, lenx:number, leny:number, lenz:number) => DrawObject;
      drawContour: (points: Array<Point3D>, closed:boolean, color: string, fillcolor:string, opacity:number) => DrawObject;
      drawLines: (lines: Array<Array<Point3D>>, color: string) => DrawObject;
      drawLine: (id: string, source: Point3D, target: Point3D, color: string) => DrawObject;
      dispose: () => void;

      // Add loop function
      addLoopFunction: ( fn: (d:Drawer) => void ) => void;
      clearLoopFunctions: () => void;

      // optimize
      optimize: (level?:number,cb?:()=>any) => any;


      // Control adds
      getCanvasPosition: () => Array<number>;
      getCanvasSize: () => Array<number>;
      attachResizeListener: ( fn:() => void ) => void;

      // Camera Control

      getCameraType: () => CameraType;
      setCameraType: (type:CameraType) => void;

      getCameraSpeed: () => number;
      setCameraSpeed: (sp : number) => void;

      getCameraInertia: () => number;
      setCameraInertia: (inertia : number) => void;

      getCameraPanSensibility: () => number;
      setCameraPanSensibility: (v : number) => void;

      getCameraWheelSensibility: () => number;
      setCameraWheelSensibility: (v : number) => void;

      resetCamera : () => void;

      // Rtoate camera (for arc rotate camera)
      cameraAddRotation: (alphaDelta:number,betaDelta:number) => void;

      // Draw Control
      setCircularSegmentsCount: (v:number) => void;
      getCircularSegmentsCount: () => void;
      showGrid: (v:boolean) => void;
      visibleGrid: () => boolean;
      normalizeScene: () => void;

      // Get color from hex
      colorFormHex: (color:string) => DrawColor;

  }; // Intended: NvDraw.BabylonDrawer

/**
 * Color abstract
 */
  export interface DrawColor {
    toHexString: () => string;
  };

/**
 * Material abstract
 */
  export interface DrawMaterial {
    diffuseColor?: DrawColor,

    markDirty(): any;
  };

/**
 * Material set
 */
  export interface DrawMaterialSet{
      standard: DrawMaterial;
      hidden: DrawMaterial;
      emmisive: DrawMaterial;
      disminished: DrawMaterial;
      highlight: DrawMaterial;
      getStandardHexcolor: () => string;
  };

/**
 * Material set pallete
 */
  export interface DrawMaterialPalette{
      grey: () => DrawMaterialSet;
      get: (index:number) => DrawMaterialSet;
      count: () => number;
  };
