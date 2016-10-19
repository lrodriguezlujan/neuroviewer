import { DrawMaterialSet, DrawMaterialPalette } from "@neuroviewer/core";
/**
* Palette Element
*/
export declare class BabylonMaterialPaletteElement implements DrawMaterialSet {
    hidden: BABYLON.StandardMaterial;
    disminished: BABYLON.StandardMaterial;
    standard: BABYLON.StandardMaterial;
    emmisive: BABYLON.StandardMaterial;
    highlight: BABYLON.StandardMaterial;
    constructor(name: string, color: BABYLON.Color3, scene: BABYLON.Scene);
    getStandardHexcolor(): string;
    getHighlightHexcolor(): string;
}
/**
* Material Palette class
*/
export declare class BabylonMaterialPalette implements DrawMaterialPalette {
    private elements;
    constructor(scene: BABYLON.Scene);
    get(index: number): BabylonMaterialPaletteElement;
    grey(): BabylonMaterialPaletteElement;
    count(): number;
}
