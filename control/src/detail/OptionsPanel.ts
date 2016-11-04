import {Drawer,CameraType} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";
import{Control} from "./NvControl";

export class OptionsControlPanel  extends ControlPanel {

  private static options_name = "Options";

  public constructor(parent: Control){
    super("options","Options",parent);

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
    if (this.parent.drawer.getCameraType() == CameraType.pivot){
      camera_type = "pivot";
    } else {
      camera_type = "universal";
    }

    let selector_cb = (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      if (element.value == "pivot") {
        this.parent.drawer.setCameraType(CameraType.pivot);
      } else if (element.value == "universal") {
        this.parent.drawer.setCameraType(CameraType.universal);
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
      this.parent.drawer.setCameraSpeed(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("camspeed","Camera speed"));
    parent.appendChild(ControlPanel.createInputBox("camspeed","number", speed_change_cb, this.parent.drawer.getCameraSpeed()));

    let inertia_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.drawer.setCameraInertia(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("caminertia","Camera inertia"));
    parent.appendChild(ControlPanel.createInputBox("caminertia","number", inertia_change_cb, this.parent.drawer.getCameraInertia()));

    let pansens_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.drawer.setCameraPanSensibility(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("campamsens","Camera pan sensibility"));
    parent.appendChild(ControlPanel.createInputBox("campamsens","number",pansens_change_cb,this.parent.drawer.getCameraPanSensibility()));


    let wheelsens_change_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.drawer.setCameraWheelSensibility(parseFloat(element.value));
      console.log(parseFloat(element.value));
    };

    parent.appendChild(ControlPanel.createLabelTag("camwheelsens","Camera wheel sensibility"));
    parent.appendChild(ControlPanel.createInputBox("camwheelsens","number", wheelsens_change_cb,this.parent.drawer.getCameraWheelSensibility()));

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

    let grid_cb = (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.drawer.showGrid(element.checked);
    }
    parent.appendChild(ControlPanel.createSimpleCBInput("plot_grid","Render grid",this.parent.drawer.visibleGrid(),grid_cb));

    let linear_cb = (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.reconstruction.linearDrawing = element.checked;
    }

    parent.appendChild(ControlPanel.createSimpleCBInput("plot_linear","Linear rendering",this.parent.reconstruction.linearDrawing,linear_cb));

    let node_cb = (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.reconstruction.drawNodeSpheres = element.checked;
    }

    parent.appendChild(ControlPanel.createSimpleCBInput("plot_nodes","Render nodes",this.parent.reconstruction.drawNodeSpheres,node_cb));

    let single_cb = (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.reconstruction.singleElementDraw = element.checked;
    }

    parent.appendChild(ControlPanel.createSimpleCBInput("plot_single","Merge neurite elements",this.parent.reconstruction.singleElementDraw,single_cb));


    let detail_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.drawer.setCircularSegmentsCount(parseInt(element.value));
    };
    parent.appendChild(ControlPanel.createLabelTag("plot_segmentscircle","Segments per circle"));
    parent.appendChild(ControlPanel.createInputBox("plot_segmentscircle","number", detail_cb,this.parent.drawer.getCircularSegmentsCount()));

    let optimization_cb =  (ev:Event) => {
      var element = <HTMLInputElement>ev.srcElement;
      this.parent.drawer.optimize(parseInt(element.value));
    };

    let selector_opt = ControlPanel.createRadioBoxSelector("Optimization level", "plot_opt",{
      "0" : "Low",
      "1" : "Medium",
      "2" : "High"
    },optimization_cb,"0");
    parent.appendChild(selector_opt);

    // Redraw button
    let redraw_cb = (ev:Event) => {
      this.parent.reconstruction.draw();
      this.parent.drawer.normalizeScene();
      this.parent.drawer.showGrid(this.parent.drawer.visibleGrid())
      this.parent.drawer.optimize();
    };
    parent.appendChild( ControlPanel.createButton("redraw_btn", "Redaw", redraw_cb, "glyphicon-pencil"));

    this.contentDiv.appendChild(legend);
    this.contentDiv.appendChild(parent);
  }


}
