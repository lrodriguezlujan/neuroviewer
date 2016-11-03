export declare class ControlPanel {
    private panelId;
    private panelName;
    private parentDiv;
    private visible;
    protected panelDiv: HTMLElement;
    protected headerDiv: HTMLElement;
    protected contentDiv: HTMLElement;
    constructor(panelId: string, panelName: string, parentDiv: HTMLElement);
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
    protected static createSimpleRadioInput(id: string, name: string, value: string, selected: boolean): HTMLInputElement;
    protected static createInputBox(id: string, type: string, value?: any): HTMLInputElement;
    protected static createLabelTag(id: string, text: string): HTMLLabelElement;
    protected static createSet(id: string): HTMLDivElement;
    protected static createGlyphicon(id: string): HTMLSpanElement;
    protected static createLegend(text: string): HTMLLegendElement;
    protected static createRadioBoxInput(id: string, name: string, value: string, label: string, selected: boolean, classes?: Array<string>): HTMLDivElement;
    protected static createRadioBoxSelector(label: string, name: string, values: {
        [key: string]: string;
    }, selected?: string): HTMLFieldSetElement;
}
