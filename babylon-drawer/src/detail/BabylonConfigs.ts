
  export interface EngineConfig {
    antialias?: boolean;
    prserveDrawingBuffer?: boolean;
    limitDeviceRatio?: number;
  }

  export const default_config_engine : EngineConfig = {
    "antialias": true,
    "prserveDrawingBuffer": true
  };

  export enum CameraType{
    universal,
    pivot
  };

  export interface CameraConfig {
    type: CameraType,
    initPos?: BABYLON.Vector3,
    target?: BABYLON.Vector3,
    speed?: number,
    inertia?: number,
    fov?: number,
    radius?: number,
    alpha?: number,
    beta?: number
  };

  export const default_config_camera: CameraConfig = {
    "type": CameraType.pivot,
    "initPos": new BABYLON.Vector3(1,1,1),
    "target": BABYLON.Vector3.Zero(),
    "inertia": 0,
    "radius": 1.5,
    "speed" : 0.1,
    "alpha": Math.PI/4,
    "beta" :Math.PI/4
  };

  export interface InfoPanelConfig {
    enable: boolean,
    position?: BABYLON.Vector2,
    size?: BABYLON.Size;
  };

  export const default_config_info : InfoPanelConfig = {
    "enable" : false
  };

  export interface GridConfig {
    enable: boolean,
    xGridColor?: BABYLON.Color3,
    yGridColor?: BABYLON.Color3,
    zGridColor?: BABYLON.Color3,
    mainColor?: BABYLON.Color3
  };

  export const default_config_grid : GridConfig = {
    "enable" : true,
    xGridColor: new BABYLON.Color3(1,0.75,0.75),
    yGridColor: new BABYLON.Color3(0.75,1,0.75),
    zGridColor: new BABYLON.Color3(0.75,0.75,1),
    mainColor: BABYLON.Color3.Black()
  };

  export interface SceneConfig {
    bgColor?: BABYLON.Color3,
    ambientColor?: BABYLON.Color3,
    info?: InfoPanelConfig,
    grid?: GridConfig
  };

  export const default_config_scene : SceneConfig = {
    "bgColor": BABYLON.Color3.Black(),
    "ambientColor": new BABYLON.Color3(0.1,0.1,0.1),
    info: default_config_info
  };

  export interface DrawerConfig {
    engine?: EngineConfig;
    camera?: CameraConfig;
    scene?: SceneConfig;
  };


  export const default_config : DrawerConfig = {
    engine: default_config_engine,
    camera: default_config_camera,
    scene: default_config_scene
  };
