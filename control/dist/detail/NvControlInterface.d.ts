import { Drawer } from "@neuroviewer/core";
export interface ControlInterface {
    new (d: Drawer): ControlInterface;
    position: (x: number, y: number) => void;
    resize: (x: number, y: number) => void;
    show: () => void;
    hide: () => void;
    attachDrawer: (d: Drawer) => void;
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
