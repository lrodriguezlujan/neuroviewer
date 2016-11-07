import {Drawer,Reconstruction} from "@neuroviewer/core";
import {ControlInterface} from "./NvControlInterface";
import {ControlPanel} from "./ControlPanel";
import {OptionsControlPanel} from "./OptionsPanel";
import {NeuronControlPanel} from "./NeuronPanel";


export class Control {

  private optionsPanel : OptionsControlPanel;
  private neuronPanel : ControlPanel;
  private detailsPanel : ControlPanel;

  private controlLayer: HTMLElement;
  private canvasLayer: HTMLCanvasElement;

  public constructor( public drawer: Drawer, public reconstruction: Reconstruction){

    //this.canvasLayer = document.createElement("canvas");
    //this.canvasLayer.classList.add("controlDrawingCanvas");

    this.createLayer();

    //this.controlLayer.appendChild(this.canvasLayer);

    this.optionsPanel = new OptionsControlPanel(this);
    this.neuronPanel = new NeuronControlPanel(this);
  }

  public getControlDiv() {
    return this.controlLayer;
  }

  // Trigger display
  public show(){
    this.showOptions();
    this.showNeuron();
    this.showDetails();
  }

  public hide(){
    this.hideOptions();
    this.hideNeuron();
    this.hideDetails();
  }

  public dispose() {
    this.controlLayer.remove();
  }

  // Add reconstruction
  public attachReconstruction(r:Reconstruction){
    this.reconstruction = r;
    // Add to neuronPanel
    /*if(this.neuronPanel){
      this.neuronPanel.setReconstruction(this.recData);
    }*/
  }

  // Options panel control
  public showOptions(){
    this.optionsPanel.show();
  }

  public hideOptions(){
    this.optionsPanel.hide();
  }

  public triggerOptions(){
    return this.optionsPanel.trigger();
  }

  // Neuron panel
  public showNeuron(){
    this.neuronPanel.show();
  }

  public hideNeuron(){
    this.neuronPanel.hide();
  }

  public triggerNeuron(){
    return this.neuronPanel.trigger();
  }

  // Details panel
  public  showDetails(){
    this.detailsPanel.show();
  }
  public  hideDetails(){
    this.detailsPanel.hide();
  }
  public  triggerDetails(){
    return this.detailsPanel.trigger();
  }
  public  addToDetails(c : HTMLElement){

  }

  public  emptyDetails(){

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
    //this.canvasLayer.style.left = position[0]+"px";
    //this.canvasLayer.style.top = position[1]+"px";
  }

  private updateDrawerSize(){
    let size  = this.drawer.getCanvasSize();
    this.controlLayer.style.width = size[0]+"px";
    this.controlLayer.style.height = size[1]+"px";
    //this.canvasLayer.style.width = size[0]+"px";
    //this.canvasLayer.style.height = size[1]+"px";
  }



}
