import { CameraType } from "@neuroviewer/core";
export interface EngineConfig {
    antialias?: boolean;
    prserveDrawingBuffer?: boolean;
    limitDeviceRatio?: number;
}
export declare const default_config_engine: EngineConfig;
export interface CameraConfig {
    type: CameraType;
    initPos?: BABYLON.Vector3;
    target?: BABYLON.Vector3;
    speed?: number;
    inertia?: number;
    fov?: number;
    radius?: number;
    alpha?: number;
    beta?: number;
}
export declare const default_config_camera: CameraConfig;
export interface InfoPanelConfig {
    enable: boolean;
    position?: BABYLON.Vector2;
    size?: BABYLON.Size;
}
export declare const default_config_info: InfoPanelConfig;
export interface GridConfig {
    enable: boolean;
    xGridColor?: BABYLON.Color3;
    yGridColor?: BABYLON.Color3;
    zGridColor?: BABYLON.Color3;
    mainColor?: BABYLON.Color3;
}
export declare const default_config_grid: GridConfig;
export interface SceneConfig {
    bgColor?: BABYLON.Color3;
    ambientColor?: BABYLON.Color3;
    info?: InfoPanelConfig;
    grid?: GridConfig;
}
export declare const default_config_scene: SceneConfig;
export interface DrawerConfig {
    engine?: EngineConfig;
    camera?: CameraConfig;
    scene?: SceneConfig;
}
export declare const default_config: DrawerConfig;
