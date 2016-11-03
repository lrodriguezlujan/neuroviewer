export class ControlPanel {

  private visible = false;

  protected panelDiv: HTMLElement;
  protected headerDiv: HTMLElement;
  protected contentDiv: HTMLElement;

  public constructor(
    private panelId: string,
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
    this.panelDiv.style.left = x + "px";
    this.panelDiv.style.top = y + "px";
  }

  public resize(x: number, y?:number){
    this.panelDiv.style.width = x + "px";
    //this.panelDiv.style.height = y + "px";
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
    this.headerDiv.id = this.panelId + "_header";

    // Add style
    this.headerDiv.classList.add("controlHeader");
    this.headerDiv.appendChild(
      document.createTextNode(this.panelName));

    // Header collapse content
    this.headerDiv.setAttribute("data-toggle","collapse");
    this.headerDiv.setAttribute("data-target","#" + this.panelId + "_content");
    this.headerDiv.setAttribute("cursor","copy");

  }

  protected createContentDiv(){
    // Create div
    this.contentDiv = document.createElement("div");
    this.contentDiv.id = this.panelId + "_content";

    // Add style
    this.contentDiv.classList.add("controlContent");
    this.contentDiv.classList.add("collapse");
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
        bottom: false,
        left: true,
        right: true
      },
      restrict: {
        restriction: 'parent',
      },
      invert: 'reposition',
      square: false,
      inertia: false,
      axis: 'x'
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

  // Static functions for the panels
  protected static createSimpleRadioInput(id:string, name:string, value:string, selected:boolean, cb : (ev:Event) => any){
    let input = document.createElement("input");
    input.type = "radio";
    input.name = id;
    input.id = id;
    input.name = name;
    input.value = value
    input.checked = selected;
    input.onchange = cb;
    return input;
  }

  protected static createSimpleCBInput(id:string, name:string, selected:boolean, cb : (ev:Event) => any){

    let div = document.createElement("div");
    div.classList.add("checkbox");

    let input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("styled");
    input.id = id;
    input.checked = selected;
    input.onchange = cb;
    div.appendChild(input);
    div.appendChild(ControlPanel.createLabelTag(id,name) );
    return div;
  }

  protected static createInputBox(id:string, type:string,  cb : (ev:Event) => any, value?:any){
    let input = document.createElement("input");
    input.type = type;
    input.classList.add("form-control");
    input.id = id;
    input.onchange = cb;
    if(value)
      input.value=value;
    return input;
  }

  protected static createLabelTag(id:string, text:string){
    let label = document.createElement("label");
    label.htmlFor = id;
    label.appendChild(document.createTextNode(text));
    return label;
  }

  protected static createSet(id:string){
    let div = document.createElement("div");
    div.classList.add("section");
    div.id = id;

    return div;
  }

  protected static createGlyphicon(id:string){
    let span = document.createElement("span");
    span.classList.add("glyphicon");
    span.classList.add(id);
    span.setAttribute("aria-hidden","true");
    return span;
  }

  protected static createLegend(text:string){
    let legend = document.createElement("legend") ;
    legend.appendChild(document.createTextNode(text));
    return legend;
  }

  protected static createRadioBoxInput(id:string, name:string, value:string, label:string, selected:boolean, cb : (ev:Event) => any, classes?:Array<string>){
    let parent = document.createElement("div");
    // this is mandatory
    parent.classList.add("checkbox");
    // Add additional classes if needed
    if(classes){
      for(let c of classes){
        parent.classList.add(c);
      }
    }
    // Add input
    parent.appendChild(ControlPanel.createSimpleRadioInput(id,name,value,selected,cb));
    parent.appendChild(ControlPanel.createLabelTag(id,label));
    return parent;
  }

  protected static createRadioBoxSelector(label: string, name:string, values:{[key:string]:string}, cb : (ev:Event) => any, selected?: string){
    let parent = document.createElement("fieldset");
    parent.id = name+"_fs";

    parent.appendChild(ControlPanel.createLabelTag(name+"_fs",label))
    for(let k in values){
      let sel = selected && selected == k;
      parent.appendChild(ControlPanel.createRadioBoxInput(k,name,k,values[k],sel,cb));
    }

    return parent;
  }

}
