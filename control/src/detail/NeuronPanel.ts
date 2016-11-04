import {Drawer,CameraType,Reconstruction} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";
import{Control} from "./NvControl";

export class NeuronControlPanel  extends ControlPanel {

  private static neuron_name = "Reconstruction";

  public constructor(parent : Control){
    super("neuron","Reconstruction",parent);

    // Mark panes as options panel
    this.panelDiv.classList.add("neuronPanel");

    //this.createCameraOptions();
    //this.createRendererOptions();

    // Default size and position
    this.move(310,50);
    this.resize(300);
  }


}
