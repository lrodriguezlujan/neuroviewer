import {Status,Contour,Drawer,CameraType,Reconstruction,Neuron,Neurite,Branch,NeuriteType} from "@neuroviewer/core";
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

    this.createContourSection();
    this.createReconstructionSection();

    // Default size and position
    this.move(this.parent.drawer.getCanvasSize()[0]-410,10);
    this.resize(400);
  }

  private createContourSection(){

    if(this.parent.reconstruction.contours.length == 0) return ;

    let parent = ControlPanel.createSet("contours_section");
    parent.classList.add("collapse"); // Make section collapsible

    let legend = ControlPanel.createLegend("Contours")
    legend.setAttribute("data-toggle","collapse");
    legend.setAttribute("data-target","#" + "contours_section");
    legend.setAttribute("cursor","copy");

    let contour_boxes = [];
    for(var id = 0; id < this.parent.reconstruction.contours.length ; ++id){
      contour_boxes.push(ControlPanel.createBoxListItem("contour_"+id, this.parent.reconstruction.contours[id].name ,true,
                                                         NeuronControlPanel.cbox_callback(this.parent.reconstruction.contours[id]),
                                                         NeuronControlPanel.element_callback (this.parent.reconstruction.contours[id]),
                                                         null,
                                                         this.parent.reconstruction.contours[id].size(), this.parent.reconstruction.contours[id].face_color));
    }

    parent.appendChild( ControlPanel.createBoxList("contour_list",contour_boxes));

    // Add divs
    this.contentDiv.appendChild(legend);
    this.contentDiv.appendChild(parent);
  }

  private createReconstructionSection(){
    if(this.parent.reconstruction.neurons.length == 0) return ;

    let parent = ControlPanel.createSet("reconstruction_section");
    parent.classList.add("collapse"); // Make section collapsible

    let legend = ControlPanel.createLegend("Reconstruction")
    legend.setAttribute("data-toggle","collapse");
    legend.setAttribute("data-target","#" + "reconstruction_section");
    legend.setAttribute("cursor","copy");

    let neuron_boxes = [];
    for(var id = 0; id < this.parent.reconstruction.neurons.length ; ++id){
      neuron_boxes.push(ControlPanel.createBoxListItem("neuron_"+id, this.parent.reconstruction.neurons[id].id ,true,
                                                       NeuronControlPanel.cbox_callback(this.parent.reconstruction.neurons[id], "neuron_"+id+"_neuritelist"),
                                                       NeuronControlPanel.element_callback((this.parent.reconstruction.neurons[id])),
                                                       NeuronControlPanel.createNeuriteBoxes(id, this.parent.reconstruction.neurons[id]), this.parent.reconstruction.neurons[id].neurites.length));
    }

    parent.appendChild( ControlPanel.createBoxList("reconstruction_list",neuron_boxes));

    // Add divs
    this.contentDiv.appendChild(legend);
    this.contentDiv.appendChild(parent);
  }

  private static createNeuriteBoxes(id: number, n:Neuron){

    let neurites = [];
    let neurite_base_id = "neuron_"+id+"_neurite_";

    for(let neurite of n.neurites ){
      let type = NeuronControlPanel.neuriteTypeStr(neurite.type);
      neurites.push(
        ControlPanel.createBoxListItem(neurite_base_id+neurite.id.toString(), "Neurite #"+neurite.id.toString()+" ("+type+")",true,
                                                            NeuronControlPanel.cbox_callback(neurite,neurite_base_id+neurite.id.toString()+"_branchlist"),
                                                            NeuronControlPanel.element_callback(neurite),
                                                           NeuronControlPanel.createBranchBoxes(id, neurite),
                                                           neurite.branchCount(), neurite.getColor()));
    }

    return ControlPanel.createBoxList("neuron_"+id+"_neuritelist",neurites) ;
  }

  private static neuriteTypeStr(t: NeuriteType){
    switch(t){
      case NeuriteType.dendrite: return "dendrite";
      case NeuriteType.apical: return "apical";
      case NeuriteType.axon: return "axon";
      default: return "unknown";
    }
  }

  private static createBranchBoxes(id: number, n:Neurite){

    let branches = n.allBranches();
    let boxes = [];
    let branch_base_id = "neuron_"+id+"_neurite_"+n.id+"_branch_";

    for(let b of branches ){
      boxes.push(
        ControlPanel.createBoxListItem(branch_base_id+b.idString(), b.idString() ,true, NeuronControlPanel.cbox_callback(b),
        NeuronControlPanel.element_callback_branch(b), null, b.size()));
    }

    return ControlPanel.createBoxList("neuron_"+id+"_neurite_"+n.id+"_branchlist",boxes) ;
  }

  private static cbox_callback(c:any, hideId?:string){
   return (ev:Event) =>{
     var element = <HTMLInputElement>ev.srcElement;
     c.setEnabled(element.checked);
     if(hideId){
       let h = document.getElementById(hideId);
       if(h){
         h.classList.toggle("hidden-element");
       }
     }
   }
 }

 private static element_callback(c:any){
  return (ev:Event) =>{
    var element = <HTMLInputElement>ev.srcElement;
    element.classList.toggle("selected-element");
    if(element.classList.contains("selected-element")){
      c.setStatus(Status.highlighted); // need get status or make it public
    } else {
      c.setStatus(Status.none); // need get status or make it public
    }

    // Toggle all descs boxes
    var ch = element.nextElementSibling.getElementsByClassName("list-inner-div");
    for( var i = 0 ; i < ch.length; ++i){
      if(element.classList.contains("selected-element")){
        ch[i].classList.add("selected-element");
      } else {
        ch[i].classList.remove("selected-element");
      }
    }
  }
}

private static element_callback_branch(c:any){
 return (ev:Event) =>{
   var element = <HTMLInputElement>ev.srcElement;
   element.classList.toggle("selected-element");
   if(element.classList.contains("selected-element")){
     c.setStatus(Status.highlighted,false); // need get status or make it public
   } else {
     c.setStatus(Status.none,false); // need get status or make it public
   }
 }
}


}
