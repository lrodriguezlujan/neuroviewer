export class ControlPanel {

  private visible = false;

  protected panelDiv: HTMLElement;
  protected headerDiv: HTMLElement;
  protected contentDiv: HTMLElement;

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

  public trigger(){
    this.visible = !this.visible;
    if(!this.visible)
      this.panelDiv.style.visibility = "hidden";
    return this.visible;
  }

  public add(c : HTMLElement){
    this.contentDiv.appendChild(c);
  }

  public dispose() {
    this.panelDiv.remove();
  }

  protected createHeaderDiv(){
    // Create div
    this.headerDiv = document.createElement("div");

    // Add style
    this.headerDiv.classList.add("controlHeader");
    this.headerDiv.appendChild(
      document.createTextNode(this.panelName));
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
      inertia: false,
      restrict: {
        restriction: 'parent',
      },
      onmove: this.dragMoveListener
    })
  }

  private dragMoveListener = (event:any)=>{
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // console log
    // console.log("POSITION: " + x + "," + y);
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
      restrict: {
        restriction: 'parent',
      },
      invert: 'reposition',
      square: false,
      inertia: false
    })
    .on('resizemove',this.resizeMoveListener);
  }

  private resizeMoveListener = (event: any)=>{
    var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
  }

}
