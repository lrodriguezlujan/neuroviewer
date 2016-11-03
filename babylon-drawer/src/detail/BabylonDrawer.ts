import * as babylonConfigs from "./BabylonConfigs";
import {Point3D, Drawer} from "@neuroviewer/core";
import {BabylonMaterialPalette} from "./BabylonPalette";

  /**
  * Drawer class - scene management
  */
  export class BabylonDrawer implements Drawer {

    public constructor( protected canvas: HTMLCanvasElement, cfg = babylonConfigs.default_config ){
        // TODO: Expand default config with cfg
        this.config = cfg;

        this.engine = new BABYLON.Engine(this.canvas, this.config.engine.antialias, this.config.engine );
    }

    /**********
     *  Class data members
     **********/
    private config: babylonConfigs.DrawerConfig;
    private initialized : boolean = false;
    public palette: BabylonMaterialPalette;

    // Canvas
    // protected canvas : HTMLCanvasElement;

    // Babylon engine
    protected engine: BABYLON.Engine;

    // Babylon scene
    protected scene: BABYLON.Scene;

    // Octtree
    protected octtree: BABYLON.Octree<BABYLON.AbstractMesh>;

    // Camera (BABYLON.TargetCamera)
    protected camera: BABYLON.TargetCamera;


    // Lights
    protected lights: Array<BABYLON.Light>;

    // Info panel
    public infoPanel: BABYLON.ScreenSpaceCanvas2D;

    // loop callback function
    protected loopCallbackFunction: (instance:Drawer) => void;

    /**
    * Set loop function to be called before rendering
    **/
    public setLoopFunction(fn:(instance:Drawer) => void){
      this.loopCallbackFunction = fn;
    }

    // Scene scaling
    protected sceneScaling = 1;

    // Grid
    //protected grid: BABYLON.AbstractMesh;
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
    public init(){
      this.scene = new BABYLON.Scene(this.engine);

      // Set background color
      this.scene.clearColor = this.config.scene.bgColor;

      // Set ambient color
      this.scene.ambientColor = this.config.scene.ambientColor;

      // Material palette
      this.palette = new BabylonMaterialPalette(this.scene);

      // Scene is initialized
      this.initialized = true;

      // Camera
      this.initCamera();

      // Default light TODO
      this.lights = [];
      let light0 = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), this.scene)
      light0.diffuse = new BABYLON.Color3(1, 1, 1);
      light0.specular = new BABYLON.Color3(1, 1, 1);
      light0.groundColor = new BABYLON.Color3(0, 0, 0);
      this.lights.push(light0);

      var spot = new BABYLON.SpotLight("spot", new BABYLON.Vector3(25, 15, -10), new BABYLON.Vector3(-1, -0.8, 1), 15, 1, this.scene);
      spot.diffuse = new BABYLON.Color3(1, 1, 1);
      spot.specular = new BABYLON.Color3(0, 0, 0);
      spot.intensity = 0.8;
      this.lights.push(spot);

      this.engine.runRenderLoop( () => {
        if(this.loopCallbackFunction) this.loopCallbackFunction(this);
        // Control camera limits
        if(this.config.camera.type == babylonConfigs.CameraType.universal){
          BabylonDrawer.cameraLimits(this.camera);
        }

         this.scene.render();
       });

       // Set up info panel
       if( this.config.scene.info ){
         this.createInfoPanel(this.config.scene.info);
       }
    }

    private static cameraLimits(camera: BABYLON.Camera){
      if(camera.position.x > 3 )
        camera.position.x = 3;
      if(camera.position.x < -3 )
        camera.position.x = -3;

      if(camera.position.y > 3 )
        camera.position.y = 3;
      if(camera.position.y < -3 )
        camera.position.y = -3;

      if(camera.position.z > 3 )
        camera.position.z = 3;
      if(camera.position.z < -3 )
        camera.position.z = -3;
    }

    /**
     * Releases resources allocated by the drawer
     *
     * @todo implement
     *
     * @public
     * @return none
     */
    public dispose() {
      this.camera.dispose();
      for (var l of this.lights)
        l.dispose();
      this.scene.dispose();
      this.engine.dispose();
      this.initialized = false;
    }

    public setBackgroundColor(col: BABYLON.Color3) {
      this.config.scene.bgColor = col;
      if (this.initialized) {
        this.scene.clearColor = col;
      }
    }

    public setAmbientColor(col: BABYLON.Color3) {
      this.config.scene.ambientColor = col;
      if (this.initialized) {
        this.scene.ambientColor = col;
      }
    }

    public setLoadingScreen(loader: BABYLON.ILoadingScreen) {
        this.engine.loadingScreen = loader;
    }

    public updateOcttree() {
      if (this.initialized) {
        this.octtree = this.scene.createOrUpdateSelectionOctree(16, 3); // TODO: CONFIG
      }
    }


    // INFO PANEL
    public createInfoPanel(cfg: babylonConfigs.InfoPanelConfig){

      if(this.infoPanel) this.infoPanel.dispose();

      if(cfg.enable){
        this.infoPanel = new BABYLON.ScreenSpaceCanvas2D(this.scene,
          {id: "infoPanel",
          position: cfg.position,
          size: cfg.size } );
        this.infoPanel.isPickable = false;
      }

      return this.infoPanel;
    }

    // CAMERA
    public setCamera(camera: BABYLON.TargetCamera) {
      this.camera = camera;
    }

    private initCamera() {
      if (this.config.camera.type == babylonConfigs.CameraType.universal) {
        this.initUniversalCamera();
      } else {
        this.initPivotCamera();
      }
      this.setCameraPosition(new BABYLON.Vector3(2.25,2.25,2.25))
      this.camera.minZ = 0;
      this.camera.maxZ = 1E6;
      this.camera.attachControl(this.canvas);

    }

    private initUniversalCamera() {
      this.camera = new BABYLON.UniversalCamera("camera", this.config.camera.initPos, this.scene);
      // Target
      this.setCameraTarget(this.config.camera.target);
      this.setCameraSpeed(this.config.camera.speed);
      this.setCameraInertia(this.config.camera.inertia);
      this.setCameraFOV(this.config.camera.fov);
    }

    private initPivotCamera() {
      let camera = new BABYLON.ArcRotateCamera("camera",
        this.config.camera.alpha,
        this.config.camera.beta,
        this.config.camera.radius,
        this.config.camera.target,
        this.scene);

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
    }

    public resetCamera() {
      this.camera.dispose();
      this.initCamera();
    }

    public setCameraPosition( pos: BABYLON.Vector3) {
      if (pos && this.initialized) {
        this.camera.position = pos;
      }
    }

    public setCameraTarget( target: BABYLON.Vector3) {
      if (target && this.initialized) {
        this.camera.setTarget(target);
      }
    }

    public setCameraSpeed(speed: number) {
      if (speed && this.initialized) {
        this.camera.speed = speed;
      }
    }

    public setCameraInertia(inertia: number) {
      if (inertia && this.initialized) {
        this.camera.inertia = inertia;
      }
    }

    public setCameraFOV(fov: number) {
      if (fov && this.initialized) {
        this.camera.fov = fov;
      }
    }

    // Create scene grid
    public createGrid(cfg:babylonConfigs.GridConfig){

      // Remove previous grid
      if(this.grid){
        for(var g of this.grid)
          g.dispose();
      }

      if (cfg && cfg.enable) {

        // Default grid. TODO: Configure
        let baseGridMaterial = new BABYLON.GridMaterial("gridMaterial", this.scene);
        baseGridMaterial.mainColor = cfg.mainColor;
        baseGridMaterial.opacity = 0.98;
        baseGridMaterial.gridRatio = 0.2;
        baseGridMaterial.backFaceCulling = false;
        baseGridMaterial.majorUnitFrequency = 5;

        // Create a box of size 2
        // this.grid = BABYLON.Mesh.CreateBox("grid",2, this.scene,false,BABYLON.Mesh.DOUBLESIDE);
        this.grid = [];

        // Create planes
        let botPlaneMaterial = baseGridMaterial.clone("botplanematerial");
        botPlaneMaterial.lineColor = cfg.zGridColor;
        let botPlane =  BABYLON.Mesh.CreatePlane("grid_bot",2, this.scene,false);
        botPlane.material = botPlaneMaterial;
        botPlane.position = new BABYLON.Vector3(0,-1,0);
        botPlane.rotation.x = Math.PI/2;
        botPlane.isPickable = false;
        this.grid.push(botPlane);

        let backPlaneMaterial = baseGridMaterial.clone("backplanematerial");
        backPlaneMaterial.lineColor = cfg.xGridColor;
        let backPlane =  BABYLON.Mesh.CreatePlane("grid_back",2, this.scene,false);
        backPlane.material = backPlaneMaterial;
        backPlane.position = new BABYLON.Vector3(0,0,-1);
        backPlane.isPickable = false;
        this.grid.push(backPlane);

        let sidePlaneMaterial = baseGridMaterial.clone("sideplanematerial");
        sidePlaneMaterial.lineColor = cfg.yGridColor
        let sidePlane =  BABYLON.Mesh.CreatePlane("grid_side",2, this.scene,false);
        sidePlane.material = sidePlaneMaterial;
        sidePlane.position = new BABYLON.Vector3(-1,0,0);
        sidePlane.rotation.y = Math.PI/2;
        sidePlane.isPickable = false;
        this.grid.push(sidePlane);

        this.createLabelText("label_x_axis","X",new BABYLON.Vector3(1.2,0,-1),cfg.xGridColor, cfg.mainColor)
        this.createLabelText("label_y_axis","Y",new BABYLON.Vector3(-1,1.2,0),cfg.yGridColor, cfg.mainColor)
        this.createLabelText("label_y_axis","Z",new BABYLON.Vector3(0,-1,1.2),cfg.zGridColor, cfg.mainColor)
      }
    }

    private createLabelText(id : string, text : string, position: BABYLON.Vector3, textColor: BABYLON.Color3, backColor : BABYLON.Color3){

      let outputplane = BABYLON.Mesh.CreatePlane(id, 0.2, this.scene, false);
  	  outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
      outputplane.position = position;
      outputplane.isPickable = false;
      // Scalling if needed to get "not square labels"

      let tex = new BABYLON.DynamicTexture(id+"_texture", 256, this.scene, true);
      let mat =  new BABYLON.StandardMaterial(id+"_material", this.scene);

      tex.hasAlpha = true;
      tex.getAlphaFromRGB = true;
      mat.diffuseTexture = tex;
      mat.specularColor = new BABYLON.Color3(0, 0, 0);
      mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
      mat.backFaceCulling = false;
      outputplane.material = mat;

      tex.drawText(text,null,180,"140px verdana", textColor.toHexString(),`rgba(${backColor.r},${backColor.g},${backColor.b},0.2)`)

      return outputplane;
    }

    public drawSphere(name: string, position: Point3D, radius: number){
      let tmp_sph = BABYLON.Mesh.CreateSphere(name , 8, radius * 2.05, this.scene);

      // Move to location
      tmp_sph.position = new BABYLON.Vector3(position.x,position.y,position.z);

      return tmp_sph;
    }

    public drawCylinder(name: string, from_p: Point3D , to_p: Point3D, initRad: number, endRad: number){

      let from = new BABYLON.Vector3(from_p.x,from_p.y,from_p.z);
      let to = new BABYLON.Vector3(to_p.x,to_p.y,to_p.z);
      let tmp_cyl = BABYLON.Mesh.CreateCylinder(name, BABYLON.Vector3.Distance(from, to), endRad * 2, initRad * 2, 8, 1, this.scene);

      // Compute rotation
      let vec = to.subtract(from);

     // Move to position (midpoint)
     tmp_cyl.position = vec.scale(0.5).add(from);
     vec.normalize();

     let v = new BABYLON.Vector3(0,1,0);
     if(!v.equals(vec)){
       let axis = BABYLON.Vector3.Cross(v,vec);
       if( axis.length() == 0 ){
          tmp_cyl.rotation = new BABYLON.Vector3(Math.PI,0,0); // Special case 180.
       } else {
         axis.normalize();
         let rotation = BABYLON.Quaternion.RotationAxis(axis, Math.acos(BABYLON.Vector3.Dot(vec,v)));
         tmp_cyl.rotationQuaternion = rotation;
       }
     }

     return tmp_cyl;
    }

    public drawLineBox(root_p: Point3D, x: number, y:number, z:number){
      let root = new BABYLON.Vector3(root_p.x,root_p.y,root_p.z);
      let points : Array<BABYLON.Vector3> = [root];
      points.push(root.add(new BABYLON.Vector3(0,0,z)));
      points.push(root.add(new BABYLON.Vector3(0,y,0)));
      points.push(root.add(new BABYLON.Vector3(0,y,z)));
      points.push(root.add(new BABYLON.Vector3(x,0,0)));
      points.push(root.add(new BABYLON.Vector3(x,0,z)));
      points.push(root.add(new BABYLON.Vector3(x,y,0)));
      points.push(root.add(new BABYLON.Vector3(x,y,z)));

      var mesh = BABYLON.MeshBuilder.CreateLineSystem(null,
        {lines: [
            [points[0],points[1]],
            [points[0],points[2]],
            [points[0],points[4]],
            [points[1],points[3]],
            [points[1],points[5]],
            [points[2],points[3]],
            [points[2],points[6]],
            [points[3],points[7]],
            [points[4],points[5]],
            [points[4],points[6]],
            [points[5],points[7]],
            [points[6],points[7]]
          ],
        updatable : false},
        this.scene);

      mesh.color = new BABYLON.Color3(1,1,0);
      return mesh;
    }

    // ATM we ignore fillcolor and opacity
    public drawContour(points: Array<Point3D>, closed: boolean,
      color: string, fillcolor: string, opacity: number) {

        // Points to vector3
        let points_b : Array<BABYLON.Vector3> = [];
        for( let p of points){
          points_b.push(new BABYLON.Vector3(p.x,p.y,p.z));
        }

        let lines : Array<Array<BABYLON.Vector3>> = [];
        for(var i = 1; i<points_b.length; ++i){
          lines.push([points_b[i-1],points_b[i]]);
        }

        let mesh = BABYLON.MeshBuilder.CreateLineSystem(null,
          {lines: lines,
          updatable : false},
          this.scene);
        mesh.color = BABYLON.Color3.FromHexString(color);
        return mesh;
    }

    public drawLines(lines: Array<Array<Point3D>>, color: string) {

        // Points to vector3
        let lines_v : Array<Array<BABYLON.Vector3>> = [];
        for( let l of lines){
            lines_v.push([ new BABYLON.Vector3(l[0].x,l[0].y,l[0].z), new BABYLON.Vector3(l[1].x,l[1].y,l[1].z) ]);
        }

        let mesh = BABYLON.MeshBuilder.CreateLineSystem(null,
          {lines: lines_v,
          updatable : false},
          this.scene);
        mesh.color = BABYLON.Color3.FromHexString(color);
        return mesh;
    }

    public drawLine(id:string, source: Point3D, target: Point3D, color: string){
      let mesh = BABYLON.MeshBuilder.CreateLines(id,
        { points: [new BABYLON.Vector3(source.x,source.y,source.z),
                  new BABYLON.Vector3(target.x,target.y,target.z) ],
        updatable : false},
        this.scene);
      mesh.color = BABYLON.Color3.FromHexString(color);
      return mesh;
    }

    public merge(meshes: Array<BABYLON.Mesh>) {
      return BABYLON.Mesh.MergeMeshes(meshes,true);
    }

    private computeSceneNormalizationScale(){
      let min = new BABYLON.Vector3(1e6,1e6,1e6);
      let max = new BABYLON.Vector3(-1e6,-1e6,-1e6);

      // Get scene bounds
      for( var mesh of this.scene.meshes){
        let binfo = mesh.getBoundingInfo();
        min.MinimizeInPlace(binfo.minimum.add(mesh.position));
        max.MaximizeInPlace(binfo.maximum.add(mesh.position));
      }
      let scale = 1;
      // Lower bound scale
      if(min.x < -1 )
        scale = Math.min(scale, -1/min.x );
      if(min.y < -1 )
          scale = Math.min(scale, -1/min.y );
      if(min.z < -1 )
          scale = Math.min(scale, -1/min.z );
      // Upper bound
      if(max.x > 1 )
        scale = Math.min(scale, 1/max.x );
      if(max.y > 1 )
          scale = Math.min(scale, 1/max.y );
      if(max.z > 1 )
          scale = Math.min(scale, 1/max.z );

      return scale;
    }

    /**
    * Scales the scene
    */
    public scaleScene( scale:number ){
      let scaling = new BABYLON.Vector3(scale,scale,scale);
      for( var mesh of this.scene.meshes){
        mesh.position.multiplyInPlace(scaling);
        mesh.scaling = scaling;
      }
    }

    public normalizeScene(){
        this.sceneScaling = this.computeSceneNormalizationScale();
        this.scaleScene(this.sceneScaling);
    }

    /**
     * Runs the scene optimizer
     *
     * @param {number} level - Optimization level (0-low, 2-high)
     *
     * @return Promise
     */
    public optimize(level: number) {
      if (level <= 0) {
        BABYLON.SceneOptimizerOptions.LowDegradationAllowed();
      } else if (level == 1) {
        BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
      } else {
        BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
      }
      return BABYLON.SceneOptimizer.OptimizeAsync(this.scene);
    }

    public addPointerUpCallback(cb: (        distance: number,
                                       mesh: BABYLON.AbstractMesh,
                                       subMeshID?: number) => void) {
      /*this.scene.onPointerObservable = function(evt, res) {
        cb(res.hit, res.distance, res.pickedMesh);
      }*/
      this.scene.onPointerObservable.add(
        function(l, s) {
          if(l.pickInfo.hit){
              if(l.pickInfo.subMeshId) cb(l.pickInfo.distance, l.pickInfo.pickedMesh,l.pickInfo.subMeshId );
              else  cb(l.pickInfo.distance, l.pickInfo.pickedMesh);
          }
        }, BABYLON.PointerEventTypes.POINTERUP)
    }

  }; // End class Drawer

  class LoadingScreenExample implements BABYLON.ILoadingScreen {
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string

    constructor(public loadingUIText: string) { }

    public displayLoadingUI() {
      alert(this.loadingUIText);
    }

    public hideLoadingUI() {
      alert("Loaded!");
    }
  } // End class LoadingScreenExample
