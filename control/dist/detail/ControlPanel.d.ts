import { Control } from "./NvControl";
export declare class ControlPanel {
    private panelId;
    private panelName;
    protected parent: Control;
    private visible;
    private parentDiv;
    protected panelDiv: HTMLElement;
    protected headerDiv: HTMLElement;
    protected contentDiv: HTMLElement;
    constructor(panelId: string, panelName: string, parent: Control);
    move(x: number, y: number): void;
    resize(x: number, y?: number): void;
    show(): void;
    hide(): void;
    trigger(): boolean;
    add(c: HTMLElement): void;
    dispose(): void;
    protected createHeaderDiv(): void;
    protected createContentDiv(): void;
    protected createPanelDiv(): void;
    private makeDraggable();
    private dragMoveListener;
    private makeResizable();
    private resizeMoveListener;
    protected static createSimpleRadioInput(id: string, name: string, value: string, selected: boolean, cb: (ev: Event) => any): HTMLInputElement;
    protected static createSimpleCBInput(id: string, name: string, selected: boolean, cb: (ev: Event) => any): HTMLDivElement;
    protected static createButton(id: string, text: string, cb: (ev: Event) => void, icon?: string): HTMLButtonElement;
    protected static createInputBox(id: string, type: string, cb: (ev: Event) => any, value?: any): HTMLInputElement;
    protected static createLabelTag(id: string, text: string): HTMLLabelElement;
    protected static createSet(id: string): HTMLDivElement;
    protected static createGlyphicon(id: string): HTMLSpanElement;
    protected static createLegend(text: string): HTMLLegendElement;
    protected static createRadioBoxInput(id: string, name: string, value: string, label: string, selected: boolean, cb: (ev: Event) => any, classes?: Array<string>): HTMLDivElement;
    protected static createRadioBoxSelector(label: string, name: string, values: {
        [key: string]: string;
    }, cb: (ev: Event) => any, selected?: string): HTMLFieldSetElement;
}
