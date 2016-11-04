import{Control} from "./NvControl";

export class ControlPanel {

  private visible = false;

  private   parentDiv: HTMLElement;
  protected panelDiv: HTMLElement;
  protected headerDiv: HTMLElement;
  protected contentDiv: HTMLElement;

  public constructor(
    private panelId: string,
    private panelName: string,
    protected parent: Control) {

      // Set parent div
      this.parentDiv = parent.getControlDiv();

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

    let icon = ControlPanel.createGlyphicon("glyphicon-plus");
    icon.classList.add("collapse_icon");
    //icon.style.cssFloat="left";
    icon.setAttribute("data-toggle","collapse");
    icon.setAttribute("data-target","#" + this.panelId + "_content");
    icon.setAttribute("cursor","copy");

    // Toggle icon
    icon.onclick = function(ev:Event){
      ev.srcElement.classList.toggle("glyphicon-plus");
      ev.srcElement.classList.toggle("glyphicon-minus");
    };


    this.headerDiv.appendChild(icon);

    // Add style
    this.headerDiv.classList.add("controlHeader");
    this.headerDiv.appendChild(
      document.createTextNode(this.panelName));


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
        if(event.rect.width >= 150){
          target.style.width  = event.rect.width + 'px';

          //target.style.height = event.rect.height + 'px';

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.webkitTransform = target.style.transform =
              'translate(' + x + 'px,' + y + 'px)';

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
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

  protected static createButton(id:string, text:string, cb: (ev:Event)=>void, icon?:string){
    /*<button type="button" class="btn btn-default btn-lg">
  <span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star
</button>*/
    let bt = document.createElement("button");
    bt.type = "button";
    bt.id = id;
    bt.classList.add("btn");
    bt.classList.add("btn-default");
    bt.classList.add("btn-lg");

    if(icon)
      bt.appendChild(ControlPanel.createGlyphicon(icon));

    bt.appendChild(document.createTextNode(text));

    bt.onclick = cb;

    return bt;
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

  protected static createBoxList(id:string, elements : Array<HTMLElement> ){
    let div = document.createElement("div");
    div.classList.add("list-group");

    for( let el of elements ){
      div.appendChild(el);
    }

    return div;
  }

  protected static createBoxListItem(id: string, label:string, checked: boolean, cb : (ev:Event) => any, desc?:HTMLElement, nitems?:number, badgeBgColor?: string){
    let div = document.createElement("div");
    div.classList.add("input-group");
    div.id = id+"_inputgroup";

    // Create left box
    let cb_span = document.createElement("span");
    cb_span.classList.add("input-group-addon");
    //cb_span.classList.add("beautiful");

    // Add checkbox
    let cbox = document.createElement("input");
    cbox.type="checkbox";
    cbox.id = id;
    cbox.checked=checked;
    cbox.onchange=cb;
    cb_span.appendChild(cbox);
    div.appendChild(cb_span);

    // Add label + collapse stuff
    let inner_div = document.createElement("div");
    inner_div.classList.add("form-control");



    if(desc){
      let expand = ControlPanel.createGlyphicon("glyphicon-plus");
      expand.style.paddingRight = "5px";
      expand.style.cursor = "hand";
      inner_div.appendChild(expand)
      inner_div.classList.add("collapsible_boxlist_item");

      //TODO
    }
    // Add text
    inner_div.appendChild( document.createTextNode(label) );

    if(nitems){
      let badge = document.createElement("span");
      badge.classList.add("badge")
      badge.appendChild(document.createTextNode(nitems.toString()));
      if(badgeBgColor){
        badge.style.backgroundColor = badgeBgColor;
      }
      badge.style.cssFloat = "right";
      inner_div.appendChild(badge);
    }

    div.appendChild(inner_div);
    return div;
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
