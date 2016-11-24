import { Control } from "./NvControl";
/**
 * Base control panel class
 */
export declare class ControlPanel {
    private panelId;
    private panelName;
    protected parent: Control;
    private visible;
    private parentDiv;
    protected panelDiv: HTMLElement;
    protected headerDiv: HTMLElement;
    protected contentDiv: HTMLElement;
    /**
     * Creates a panel
     * @param  {string}  panelId   Panel internal id
     * @param  {string}  panelName Panel name (title)
     * @param  {Control} parent  Parent cotnrol layer
     */
    constructor(panelId: string, panelName: string, parent: Control);
    /**
     * Moves the panel to the given position
     */
    move(x: number, y: number): void;
    /**
     * Resizes the panel
     */
    resize(x: number, y?: number): void;
    /**
     * Makes the panel visible
     */
    show(): void;
    /**
     * Hides the panel
     */
    hide(): void;
    /**
     * Triggers panel visibility
     */
    trigger(): boolean;
    /**
     * Adds a new element to the panel content
     */
    add(c: HTMLElement): void;
    /**
     * Removes the panel
     */
    dispose(): void;
    /**
     * Creates the panel header div
     */
    protected createHeaderDiv(): void;
    /**
     * Creates the content div
     */
    protected createContentDiv(): void;
    /**
     * Creates the entire panel. Header and content divs
     */
    protected createPanelDiv(): void;
    /**
     * Makes the panel draggable
     */
    private makeDraggable();
    /**
     * Listener function for drag events
     */
    private dragMoveListener;
    /**
     * Makes the panel resizable
     */
    private makeResizable();
    /**
     * Resize event listener
     */
    private resizeMoveListener;
    /**
     * Creates a radio input element
     * @param  {string}  id       Radio input id
     * @param  {string}  name     Radio (group) name
     * @param  {string}  value    Radio value (label)
     * @param  {boolean} selected Selected flag
     * @param  {Event}   cb       Callback function on change
     * @return {HTMLElement}      Element
     */
    protected static createSimpleRadioInput(id: string, name: string, value: string, selected: boolean, cb: (ev: Event) => any): HTMLInputElement;
    /**
     * Creates a checbox input element
     * @param  {string}  id       Checkbox id
     * @param  {string}  name     Checkbox label
     * @param  {boolean} selected Selected flag
     * @param  {Event}   cb       Callback function onchange
     * @return {HTMLElement}      Element
     */
    protected static createSimpleCBInput(id: string, name: string, selected: boolean, cb: (ev: Event) => any): HTMLDivElement;
    /**
     * Creates a large button
     * @param  {string} id   Button id
     * @param  {string} text Button label
     * @param  {Event}  cb   Onclick function
     * @return {HTMLElement}      Element
     */
    protected static createButton(id: string, text: string, cb: (ev: Event) => void, icon?: string): HTMLButtonElement;
    /**
     * Creates an input element
     * @param  {string} id   Input id
     * @param  {string} type Type string
     * @param  {Event}  cb   Onchange callback
     * @return {HTMLElement}      Element
     */
    protected static createInputBox(id: string, type: string, cb: (ev: Event) => any, value?: any): HTMLInputElement;
    /**
     * Creates a list container
     * @param  {string}             id       List id
     * @param  {Array<HTMLElement>} elements List elements
     * @return {HTMLElement}      Element
     */
    protected static createBoxList(id: string, elements: Array<HTMLElement>): HTMLDivElement;
    /**
     * Creates hierarchical list element with checbox attached
     * @param  {string}  id      List id
     * @param  {string}  label   List top label
     * @param  {boolean} checked Checked flag
     * @param  {Event}   box_cb  Onchange callback
     * @param  {Event}   el_cb   Ondblclick callback
     * @param  {HTMLElement}   desc   Inner element
     * @param  {number}   nitems   Number of inner items (badge number)
     * @param  {string}   badgeBgColor   Badge hex color string
      * @return {HTMLElement}      Element
     */
    protected static createBoxListItem(id: string, label: string, checked: boolean, box_cb: (ev: Event) => any, el_cb: (ev: Event) => any, desc?: HTMLElement, nitems?: number, badgeBgColor?: string): HTMLDivElement;
    /**
     * Creates a label tag for an input
     * @param  {string} id   Input element id
     * @param  {string} text Label
     */
    protected static createLabelTag(id: string, text: string): HTMLLabelElement;
    /**
     * Creates a div section
     * @param  {string} id Div id
     */
    protected static createSet(id: string): HTMLDivElement;
    /**
     * Creates a glyphicon
     * @param  {string} id icon id
     */
    protected static createGlyphicon(id: string): HTMLSpanElement;
    /**
     * Creates a legend element
     * @param  {string} text Legend text
     */
    protected static createLegend(text: string): HTMLLegendElement;
    /**
     * Creates a set of radio box input
     * @param  {string}  id       Id
     * @param  {string}  name     Group id
     * @param  {string}  value    Group value
     * @param  {string}  label    label text
     * @param  {boolean} selected selected flag
     * @param  {Event}   cb       Onchange callback
     */
    protected static createRadioBoxInput(id: string, name: string, value: string, label: string, selected: boolean, cb: (ev: Event) => any, classes?: Array<string>): HTMLDivElement;
    /**
     * Creates a radio box selector
     * @param  {string}  label  Label
     * @param  {string}  name   Set name
     * @param  {string}} values Values (key . value)
     * @param  {Event}   cb     Onchange callback
     */
    protected static createRadioBoxSelector(label: string, name: string, values: {
        [key: string]: string;
    }, cb: (ev: Event) => any, selected?: string): HTMLFieldSetElement;
}
