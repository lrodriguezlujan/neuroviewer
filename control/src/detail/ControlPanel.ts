export class ControlPanel {

  private visible = false;

  private position: Position;
  private size: Position;

  private panelDiv: HTMLElement;
  private headerDiv: HTMLElement;
  private contentDiv: HTMLElement;

  public constructor(
    private panelName: string,
    private parentDiv: HTMLElement) {

      // Create panel
      this.createPanelDiv();

      // Hide it
      this.hide();

      // Make draggable and resizable
      this.makeDraggable();
      this.makeResizable();
    }

  public move(x: number, y:number){
    this.panelDiv.style.top = x + "px";
    this.panelDiv.style.left = y + "px";
  }

  public resize(x: number, y:number){
    this.panelDiv.style.width = x + "px";
    this.panelDiv.style.height = y + "px";
  }

  public show(){
    this.visible = true;
    this.panelDiv.style.visibility = null;

  }

  public hide(){
    this.visible = false;
    this.panelDiv.style.visibility = "hidden";
  }

  public add(c : HTMLElement){
    this.contentDiv.appendChild(c);
  }

  protected createHeaderDiv(){
    // Create div
    this.headerDiv = document.createElement("div");

    // Add style
    this.headerDiv.classList.add("controlHeader");
  }

  protected createContentDiv(){
    // Create div
    this.contentDiv = document.createElement("div");

    // Add style
    this.contentDiv.classList.add("controlContent");
  }

  protected createPanelDiv(){
    // Create content and header div
    this.createHeaderDiv();
    this.createContentDiv();

    // Create div
    this.panelDiv = document.createElement("div");
    this.panelDiv.classList.add("controlPanel");

    // Add to panel- order is importante
    this.panelDiv.appendChild(this.headerDiv)
    this.panelDiv.appendChild(this.contentDiv)
    this.parentDiv.appendChild(this.panelDiv);


  }

  private makeDraggable(){
    interact(this.panelDiv)
    .draggable({
      enabled: true,
      inertia: false,
      restrict: {
        restriction: 'parent'
      }
    })
  }

  private makeResizable(){
    interact(this.panelDiv)
    .resizable({
      enabled : true,
      edges: {
        top: false,
        bottom: true,
        left: false,
        right: true
      },
      invert: 'reposition',
      restrict: {
        restriction: 'parent'
      },
      square: false,
      inertia: false
    })
  }

}
