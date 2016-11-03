import { Drawer, Reconstruction } from "@neuroviewer/core";
export interface ControlInterface {
    new (d: Drawer): ControlInterface;
    show: () => void;
    hide: () => void;
    attachReconstruction: (r: Reconstruction) => void;
    dispose: () => void;
    showOptions: () => void;
    hideOptions: () => void;
    triggerOptions: () => boolean;
    showNeuron: () => void;
    hideNeuron: () => void;
    triggerNeuron: () => boolean;
    showDetails: () => void;
    hideDetails: () => void;
    triggerDetails: () => boolean;
    addToDetails: (c: HTMLElement) => void;
    emptyDetails: () => void;
}
