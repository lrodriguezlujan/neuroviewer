import {Drawer,CameraType} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";

export class OptionsControlPanel  extends ControlPanel {

  private static options_name = "Options";

  public constructor(parentDiv: HTMLElement, private drawer: Drawer){
    super("options","Options",parentDiv);

    // Mark panes as options panel
    this.panelDiv.classList.add("optionsPanel");
    this.createCameraOptions();
    this.createRendererOptions();

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

    let selector_cb = (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      if (element.value == "pivot") {
        this.drawer.setCameraType(CameraType.pivot);
      } else if (element.value == "universal") {
        this.drawer.setCameraType(CameraType.universal);
      }
    }

    let selector = ControlPanel.createRadioBoxSelector("Camera type", "camera_type_sel",{
      "pivot" : "Pivot",
      "univeral" : "Universal"
    }, selector_cb, camera_type);


    parent.appendChild(selector);
    // Add...stuff

    let speed_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.drawer.setCameraSpeed(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("camspeed","Camera speed"));
    parent.appendChild(ControlPanel.createInputBox("camspeed","number", speed_change_cb, this.drawer.getCameraSpeed()));

    let inertia_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.drawer.setCameraInertia(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("caminertia","Camera inertia"));
    parent.appendChild(ControlPanel.createInputBox("caminertia","number", inertia_change_cb, this.drawer.getCameraInertia()));

    let pansens_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.drawer.setCameraPanSensibility(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("campamsens","Camera pan sensibility"));
    parent.appendChild(ControlPanel.createInputBox("campamsens","number",pansens_change_cb,this.drawer.getCameraPanSensibility()));


    let wheelsens_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.drawer.setCameraWheelSensibility(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("camwheelsens","Camera wheel sensibility"));
    parent.appendChild(ControlPanel.createInputBox("camwheelsens","number", wheelsens_change_cb,this.drawer.getCameraWheelSensibility()));

    this.contentDiv.appendChild(legend);
    this.contentDiv.appendChild(parent);

  }

  private createRendererOptions(){
    let parent = ControlPanel.createSet("render_section");
    parent.classList.add("collapse"); // Make section collapsible

    let legend = ControlPanel.createLegend("Render options")
    legend.setAttribute("data-toggle","collapse");
    legend.setAttribute("data-target","#" + "render_section");
    legend.setAttribute("cursor","copy");

    //parent.appendChild(ControlPanel.createLabelTag("plotgrid","Render grid"));
    let ignore_cb = (ev:Event) => {};

    parent.appendChild(ControlPanel.createSimpleCBInput("plot_grid","Render grid",true,ignore_cb));
    parent.appendChild(ControlPanel.createSimpleCBInput("plot_linear","Linear rendering",true,ignore_cb));
    parent.appendChild(ControlPanel.createSimpleCBInput("plot_nodes","Render nodes",false,ignore_cb));
    parent.appendChild(ControlPanel.createSimpleCBInput("plot_single","Simplified plot",false,ignore_cb));

    let selector_detail = ControlPanel.createRadioBoxSelector("Detail level", "plot_detail",{
      "low" : "Low",
      "medium" : "Medium",
      "high" : "High"
    },ignore_cb,"low");
    parent.appendChild(selector_detail);

    let selector_opt = ControlPanel.createRadioBoxSelector("Optimization level", "plot_opt",{
      "low" : "Low",
      "medium" : "Medium",
      "high" : "High"
    },ignore_cb,"low");
    parent.appendChild(selector_opt);

    this.contentDiv.appendChild(legend);
    this.contentDiv.appendChild(parent);
  }


}
