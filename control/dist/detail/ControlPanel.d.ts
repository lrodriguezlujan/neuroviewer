export declare class ControlPanel {
    private panelName;
    private parentDiv;
    private visible;
    protected panelDiv: HTMLElement;
    protected headerDiv: HTMLElement;
    protected contentDiv: HTMLElement;
    constructor(panelName: string, parentDiv: HTMLElement);
    move(x: number, y: number): void;
    resize(x: number, y: number): void;
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
}
