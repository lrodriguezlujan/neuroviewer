import {Drawer,Reconstruction} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";
import {OptionsControlPanel} from "./OptionsPanel";
import {NeuronControlPanel} from "./NeuronPanel";

/**
 * Control panels for neuroviewer
 */
export class Control {

  // Drawer options panel
  private optionsPanel : OptionsControlPanel;
  // Reconstruction management panel
  private neuronPanel : ControlPanel;

  // Detail panels - TODO
  private detailsPanel : ControlPanel;

  // Control and canvas layers
  private controlLayer: HTMLElement;
  private canvasLayer: HTMLCanvasElement;

  /**
   * control constructor
   * @param  {Drawer}         drawer         Current Drawer (controled by the options panel)
   * @param  {Reconstruction} reconstruction Current reconstruction (controled by the neuron panel)
   * @return {[type]}                              [description]
   */
  public constructor( public drawer: Drawer, public reconstruction: Reconstruction){

    // Create ontrol and canvas layer
    this.createLayer();

    // Create panels
    this.optionsPanel = new OptionsControlPanel(this);
    this.neuronPanel = new NeuronControlPanel(this);
  }

  /**
   * Returns the control div (the control layer)
   */
  public getControlDiv() {
    return this.controlLayer;
  }

  /**
   * Makes all controls visible
   */
  public show(){
    this.showOptions();
    this.showNeuron();
    this.showDetails();
  }

  /**
   * Hides all panels
   */
  public hide(){
    this.hideOptions();
    this.hideNeuron();
    this.hideDetails();
  }

  /**
 * Removes the control layer
 */
  public dispose() {
    this.controlLayer.remove();
  }

  // Changes the current reconstruction
  public attachReconstruction(r:Reconstruction){
    this.reconstruction = r;
  }

  /**
   * Makes the options panel visible
   */
  public showOptions(){
    this.optionsPanel.show();
  }

  /**
   * Hides the option panel
   */
  public hideOptions(){
    this.optionsPanel.hide();
  }

  /**
   * Triggers options panel visibility
   */
  public triggerOptions(){
    return this.optionsPanel.trigger();
  }

  /**
   * Makes the neuron control panel visible
   */
  public showNeuron(){
    this.neuronPanel.show();
  }

  /**
   * Hides the neuron control panel
   */
  public hideNeuron(){
    this.neuronPanel.hide();
  }

  /**
   * Triggers neruon panel visibility
   */
  public triggerNeuron(){
    return this.neuronPanel.trigger();
  }


  //TODO: Detail panel - Intended to be just a container so the user
  //can put in anything.
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

  /**
   * Create control layers ontop of the drawer canvas
   */
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

  /**
   * Auxiliar function that resizes the layers. This will listen to the
   * window resize event
   */
  private canvasResizeListener = () => {
    this.updateDrawerPosition();
    this.updateDrawerSize();
  }

/**
 * Change control layer position to match drawer position
 */
  private updateDrawerPosition(){
    let position  = this.drawer.getCanvasPosition();
    this.controlLayer.style.left = position[0]+"px";
    this.controlLayer.style.top = position[1]+"px";
  }

/**
 * Change control layer size to match drawer size
 */
  private updateDrawerSize(){
    let size  = this.drawer.getCanvasSize();
    this.controlLayer.style.width = size[0]+"px";
    this.controlLayer.style.height = size[1]+"px";
    //this.canvasLayer.style.width = size[0]+"px";
    //this.canvasLayer.style.height = size[1]+"px";
  }
}
