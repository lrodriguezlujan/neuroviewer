import {DrawMaterial, DrawMaterialSet, DrawMaterialPalette} from "@neuroviewer/core";

/**
* Palette Element for the babylon drawer
*/
export class BabylonMaterialPaletteElement implements DrawMaterialSet {

    // Material palette
    public hidden: BABYLON.StandardMaterial;
    public disminished: BABYLON.StandardMaterial;
    public standard: BABYLON.StandardMaterial;
    public emmisive: BABYLON.StandardMaterial;
    public highlight: BABYLON.StandardMaterial;

    constructor( name:string, color: BABYLON.Color3, scene: BABYLON.Scene){
      this.standard = new BABYLON.StandardMaterial(name+"_standard",scene);
      this.standard.diffuseColor = color;
      this.standard.alpha = 1;
      this.standard.backFaceCulling = false;

      // Hidden
      this.hidden = this.standard.clone(name+"_hidden");
      this.hidden.alpha = 0;

      // disminished
      this.disminished = this.standard.clone(name+"_disminished");
      this.disminished.alpha = 0.25;

      // emmisive
      this.emmisive = this.standard.clone(name+"_emmisive");
      this.emmisive.diffuseColor = color.clone().scale(1.3);
      this.emmisive.ambientColor = BABYLON.Color3.White();

      // Highlight
      this.highlight = this.standard.clone(name+"_highlight");
      this.highlight.diffuseColor = new BABYLON.Color3(1,1,0);
      this.highlight.ambientColor = new BABYLON.Color3(0.7,0.7,0.7);
    }

    public getStandardHexcolor() {
      return this.standard.diffuseColor.toHexString();
    }

    public getHighlightHexcolor() {
      return this.highlight.diffuseColor.toHexString();
    }
}


/**
* Material Palette class
*/
export class BabylonMaterialPalette implements DrawMaterialPalette{
    private elements:Array<BabylonMaterialPaletteElement>;

    constructor(scene: BABYLON.Scene){
      this.elements = [];
      // http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
      this.elements.push(new BabylonMaterialPaletteElement("grey" ,BABYLON.Color3.FromHexString("#888888"), scene ) ) // Grey
      this.elements.push(new BabylonMaterialPaletteElement("blue" ,BABYLON.Color3.FromHexString("#1f78b4"), scene ) ) // Blue
      this.elements.push(new BabylonMaterialPaletteElement("green" ,BABYLON.Color3.FromHexString("#33a02c"), scene ) ) // Green
      this.elements.push(new BabylonMaterialPaletteElement("red" ,BABYLON.Color3.FromHexString("#e31a1c"), scene ) ) // Red
      this.elements.push(new BabylonMaterialPaletteElement("orange" ,BABYLON.Color3.FromHexString("#ff7f00"), scene ) ) // Orange
      this.elements.push(new BabylonMaterialPaletteElement("purple" ,BABYLON.Color3.FromHexString("#6a3d9a"), scene ) ) // Purple
      this.elements.push(new BabylonMaterialPaletteElement("brown" ,BABYLON.Color3.FromHexString("#b15928"), scene ) ) // Brown
      this.elements.push(new BabylonMaterialPaletteElement("yellow" ,BABYLON.Color3.FromHexString("#FFFF99"), scene ) ) // Yellow
      // Light
      this.elements.push(new BabylonMaterialPaletteElement("lblue" ,BABYLON.Color3.FromHexString("#a6cee3"), scene ) ) // Blue
      this.elements.push(new BabylonMaterialPaletteElement("lgreen" ,BABYLON.Color3.FromHexString("#b2df8a"), scene ) ) // Green
      this.elements.push(new BabylonMaterialPaletteElement("lred" ,BABYLON.Color3.FromHexString("#fb9a99"), scene ) ) // Red
      this.elements.push(new BabylonMaterialPaletteElement("lorange" ,BABYLON.Color3.FromHexString("#fdbf6f"), scene ) ) // Orange
      this.elements.push(new BabylonMaterialPaletteElement("lpurple" ,BABYLON.Color3.FromHexString("#cab2d6"), scene ) ) // Purple
    }

    public get(index:number){
      return this.elements[ index%(this.elements.length-1) + 1]; // Grey is special
    }

    public grey() {
      return this.elements[0];
    }

    public count() {
      return this.elements.length - 1 ; // Do not count grey
    }
} // MaterialPalette
