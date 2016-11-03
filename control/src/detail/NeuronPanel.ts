import {Drawer,CameraType,Reconstruction} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";

export class NeuronControlPanel  extends ControlPanel {

  private static neuron_name = "Reconstruction";

  public constructor(parentDiv: HTMLElement, private recData: Reconstruction){
    super("neuron","Reconstruction",parentDiv);

    // Mark panes as options panel
    this.panelDiv.classList.add("neuronPanel");

    //this.createCameraOptions();
    //this.createRendererOptions();

    // Default size and position
    this.move(310,50);
    this.resize(300);
  }


}
