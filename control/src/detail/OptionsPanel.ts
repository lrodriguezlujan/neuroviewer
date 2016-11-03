import {Drawer,CameraType} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";

export class OptionsControlPanel  extends ControlPanel {

  private static options_name = "Options";

  public constructor(parentDiv: HTMLElement, private drawer: Drawer){
    super("options","Options",parentDiv);

    // Mark panes as options panel
    this.panelDiv.classList.add("optionsPanel");
    this.createCameraOptions();

    // Default size and position
    this.move(10,50);
    this.resize(300);
  }


  private createCameraOptions(){
    let parent = ControlPanel.createSet("camera_section");
    parent.classList.add("collapse"); // Make section collapsible

    let legend = ControlPanel.createLegend("Camera options")
    legend.setAttribute("data-toggle","collapse");
    legend.setAttribute("data-target","#" + "camera_section");
    legend.setAttribute("cursor","copy");


    let camera_type:string;
    if (this.drawer.getCameraType() == CameraType.pivot){
      camera_type = "pivot";
    } else {
      camera_type = "universal";
    }
    let selector = ControlPanel.createRadioBoxSelector("Camera type", "camera_type_sel",{
      "pivot" : "Pivot",
      "univeral" : "Universal"
    },camera_type);
    parent.appendChild(selector);
    // Add...stuff

    parent.appendChild(ControlPanel.createLabelTag("camspeed","Camera speed"));
    parent.appendChild(ControlPanel.createInputBox("camspeed","number",this.drawer.getCameraSpeed()));

    parent.appendChild(ControlPanel.createLabelTag("caminertia","Camera inertia"));
    parent.appendChild(ControlPanel.createInputBox("caminertia","number",this.drawer.getCameraInertia()));

    parent.appendChild(ControlPanel.createLabelTag("campamsens","Camera pan sensibility"));
    parent.appendChild(ControlPanel.createInputBox("campamsens","number",this.drawer.getCameraPanSensibility()));

    parent.appendChild(ControlPanel.createLabelTag("camwheelsens","Camera wheel sensibility"));
    parent.appendChild(ControlPanel.createInputBox("camwheelsens","number",this.drawer.getCameraWheelSensibility()));

    this.contentDiv.appendChild(legend);
    this.contentDiv.appendChild(parent);

  }


}
