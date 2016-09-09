  export interface Point3D {
      x: number;
      y: number;
      z: number;
  }

  export interface DrawObject {
      material: DrawMaterial;
      dispose: () => void;
  }; // Intended: BABYLON.AbstractMesh

  export interface Drawer {
      palette: DrawMaterialPalette;
      drawSphere: (id:string, position:Point3D, radius:number) => DrawObject;
      drawCylinder: (id:string, from:Point3D, to:Point3D, fromRadius:number , toRadius:number) => DrawObject;
      merge: (objs:Array<DrawObject>) => DrawObject;
      drawLineBox: (min: Point3D, lenx:number, leny:number, lenz:number) => DrawObject;
      dispose: () => void;
  }; // Intended: NvDraw.BabylonDrawer

  export interface DrawMaterial {
  };

  export interface DrawMaterialSet{
      standard: DrawMaterial;
      hidden: DrawMaterial;
      emmisive: DrawMaterial;
      disminished: DrawMaterial;
      highlight: DrawMaterial;
  };

  export interface DrawMaterialPalette{
      grey: () => DrawMaterialSet;
      get: (index:number) => DrawMaterialSet;
      count: () => number;
  };
