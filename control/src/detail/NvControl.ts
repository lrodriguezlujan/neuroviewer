import {Drawer,Reconstruction} from "@neuroviewer/core";
import {ControlInterface} from "./NvControlInterface";
import {ControlPanel} from "./ControlPanel";


export class Control {

  private optionsPanel;
  private neuronPanel;
  private detailsPanel;

  private controlLayer: HTMLElement;

  public constructor( private drawer: Drawer){
    this.createLayer();
  }

  private createLayer(){
    this.controlLayer = document.createElement("div");
    this.controlLayer.style.position = "absolute";
    this.controlLayer.style["pointer-events"] = "none";
    this.controlLayer.id = "ControlLayer";

    this.drawer.attachResizeListener(this.canvasResizeListener);
    window.addEventListener("resize",this.canvasResizeListener);

    this.updateDrawerPosition();
    this.updateDrawerSize();
    document.body.appendChild(this.controlLayer);
  }

  private canvasResizeListener = () => {
    this.updateDrawerPosition();
    this.updateDrawerSize();
  }

  private updateDrawerPosition(){
    let position  = this.drawer.getCanvasPosition();
    this.controlLayer.style.left = position[0]+"px";
    this.controlLayer.style.top = position[1]+"px";
  }

  private updateDrawerSize(){
    let size  = this.drawer.getCanvasSize();
    this.controlLayer.style.width = size[0]+"px";
    this.controlLayer.style.height = size[1]+"px";
  }

}
