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
    //
    // // TEST
    this.contentDiv.appendChild(this.createContourSection());

    // Default size and position
    this.move(310,50);
    this.resize(300);
  }

  private createContourSection(){
    let parent = ControlPanel.createSet("contours");
    parent.appendChild(ControlPanel.createLegend("Contours"));

    let list = ControlPanel.createBoxList("test_list",[
      ControlPanel.createBoxListItem("testA","Regular item",false, null),
      ControlPanel.createBoxListItem("testB","Expand",false, null, document.createElement("dummy") , 10, "#880000")
    ])

    parent.appendChild(list);

    return parent;
  }


}
