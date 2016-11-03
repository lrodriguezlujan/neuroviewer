export declare class ControlPanel {
    private panelName;
    private parentDiv;
    private visible;
    private position;
    private size;
    private panelDiv;
    private headerDiv;
    private contentDiv;
    constructor(panelName: string, parentDiv: HTMLElement);
    move(x: number, y: number): void;
    resize(x: number, y: number): void;
    show(): void;
    hide(): void;
    add(c: HTMLElement): void;
    protected createHeaderDiv(): void;
    protected createContentDiv(): void;
    protected createPanelDiv(): void;
    private makeDraggable();
    private makeResizable();
}
