import {Drawer,Reconstruction} from "@neuroviewer/core";

export interface ControlInterface{

  new(d: Drawer) : ControlInterface;

  // Change position and size to match drawer
  // position: (x:number, y:number) => void;
  // resize:   (x:number, y:number) => void;

  // Trigger display
  show: () => void;
  hide: () => void;

  // Add drawer to the control panel
  // attachDrawer: (d:Drawer) => void;

  // Add reconstruction
  attachReconstruction: (r:Reconstruction) => void;

  // Dispose (Destroy)
  dispose: () => void;

  // Options panel control
  showOptions: () => void;
  hideOptions: () => void;
  triggerOptions: () => boolean; // Return status

  // Neuron panel
  showNeuron: () => void;
  hideNeuron: () => void;
  triggerNeuron: () => boolean; // Return status

  // Details panel
  showDetails: () => void;
  hideDetails: () => void;
  triggerDetails: () => boolean; // Return status
  addToDetails: (c : HTMLElement) => void;
  emptyDetails: () => void;

  // Callback functions
}
