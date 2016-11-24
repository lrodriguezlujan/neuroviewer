import {NodeJSON, Node3D} from "./Node3D";
import {Status,materialPicker,materialColorPicker} from "./Status";
import {Neurite} from "./Neurite";
import {Point3D,Drawer, DrawObject, DrawMaterial} from "./NvCoreInterfaces";


  /**
   * @summary JSON branch definition
   *
   * @public
   */
  export interface BranchJSON{
    root : NodeJSON,
    nodes : Array< NodeJSON >,
    children? : Array< BranchJSON >
  }


  /**
   * @summary Branch element definition
   *
   * @desc Each of the elements of a branch. Has an status, contains a node and a reference to
   * meshes associated with it.
   *
   * @public
   */
  export class BranchElement {


    /**
     * Branch status
     */
    private status : Status;

    private linear : boolean;
    private enabled : boolean;


    /**
     * Draw method called flag
     */
    private drawn : boolean;


    /**
     * Mesh associated with the node
     */
    private nodeMesh : DrawObject;


    /**
     * Mesh associated with the parent segment
     */
    private segmentMesh : DrawObject;


    /**
     * Branch element constructor
     *
     * @param  {number} index Node poisition in the branch
     * @param  {Node3D} node Node3D that marks the segment target point
     * @param  {Node3D} prevNode Previous node (root point in the segment)
     * @param  {Branch} branch Parent branch
     *
     * @public
     */
    constructor(public index:number, public node: Node3D, private prevNode: Node3D, public branch: Branch){
      this.drawn = false;
      this.status = Status.none;
    }


    /**
     * Draws the BranchElement in the given drawer
     *
     * @desc The node is drawn as a sphere. The segment is drawn as a cylinder.
     *
     * @param  {Drawer} drawer class
     * @public
     */
    public draw( drawer: Drawer, linear:boolean = false ) {
        if(this.nodeMesh) {
          this.nodeMesh.dispose();
        }
        if(this.segmentMesh){
          this.segmentMesh.dispose();
        }

        if(linear) {
          this.linear = true;
          if(this.prevNode){
            this.segmentMesh = drawer.drawLine(`C${this.node.id}@${this.branch.idString()}}@${this.branch.neurite.id}`,
                                                this.prevNode, this.node, this.currentColor());
          }
          this.drawn = true;
        } else {
          this.linear = false;
          if(this.branch.neurite.neuron.reconstruction.drawNodeSpheres){
            // Create node
            this.nodeMesh = drawer.drawSphere(`N${this.node.id}@${this.branch.idString()}@${this.branch.neurite.id}`, this.node, this.node.r );
          }

          // Create segment
          if(this.prevNode)
            this.segmentMesh = drawer.drawCylinder(`C${this.node.id}@${this.branch.idString()}}@${this.branch.neurite.id}`,
                                                  this.prevNode, this.node,
                                                  this.prevNode.r,this.node.r );

          // Set materials wrt status
          this.drawn = true;
          this.enabled = true;
          this.updateMaterial();
        }
    }

    /**
     * Returns the current branch element (compartment) as a 3D Line
     * @return {Array<Point3D>} Array with two points. The ends of the segments
     */
    public asLine() : Array<Point3D> {
      if(this.prevNode){
        return [{x: this.prevNode.x, y: this.prevNode.y, z: this.prevNode.z},
                {x: this.node.x, y: this.node.y, z: this.node.z}];
      } else {
        return [];
      }
    }

    /**
     * Changes the element status and updates the material in the meshes
     *
     * @param  {Status} status New element status
     *
     * @public
     */
    public setStatus(status: Status ){
      this.status = status;

      // Change color
      if(this.linear && this.segmentMesh){
        this.segmentMesh.color = this.branch.neurite.neuron.getDrawer().colorFormHex(this.currentColor());
        this.segmentMesh.material.markDirty();
      } else {
        this.updateMaterial();
      }
    }

    /**
     * Checks if the branch element mesh is enabled (visible)
     * @return {boolean} True if the element is enabled
     */
    public isEnabled(){
      if(this.segmentMesh){
        return this.segmentMesh.isEnabled();
      } else{
        return false;
      }
    }

    /**
     * Enables or disables the element meshes
     * @param  {boolean} v Status
     */
    public setEnabled(v:boolean){
      this.enabled=v;
      if(this.segmentMesh){
        this.segmentMesh.setEnabled(v);
        if(!this.linear && this.nodeMesh){
          this.nodeMesh.setEnabled(v);
        }
      }
    }

    /**
     * Gets current color
     */
     public currentColor() {
       if(this.branch && this.branch.neurite){
         return  materialColorPicker(this.branch.neurite.material,this.status);
       } else {
         return "#FFFFFF";
       }
     }



    /**
     * Updates mesh material based on the status
     *
     * @private
     */
    public updateMaterial(){
      if(this.drawn && this.branch && this.branch.neurite){
        let mat = materialPicker(this.branch.neurite.material,this.status);

        if(this.nodeMesh){
          this.nodeMesh.material = mat;
          this.nodeMesh.material.markDirty();
        }

        if(this.segmentMesh)
          this.segmentMesh.material = mat;
          this.segmentMesh.material.markDirty();
      }
    }


    /**
     * Frees resources
     *
     * @public
     */
    public dispose(){
      this.enabled = false;
      if(this.nodeMesh)
        this.nodeMesh.dispose();
      if(this.segmentMesh)
        this.segmentMesh.dispose();
    }
  } // Branch element class end



/**
 * Branch class
 */
export class Branch {


  /**
   * Branch descs.
   */
  private children: Array<Branch>;
  private enabled : boolean;


  /**
   * Branch nodes (ordered)
   */
  private nodes: Array<BranchElement>;


  /**
   * Branch status
   */
  private status : Status;


  /**
   * Branch root node mesh
   */
  private rootMesh : DrawObject;


  /**
   * Branch constructor method
   *
   * @param  {Array<number>} id Numeric array that identifies the branch
   * @param  {Node3D} root Root node
   * @param  {Array<Node3D>} nodes Array of nodes that are part of the branch
   * @param  {Branch} branch Previous branch (optional)
   * @param  {Neurite} neurite Parent neurite (optional)
   */
  constructor(public id:Array<number>,private root: Node3D, nodes: Array<Node3D>, public parent?:Branch, public neurite?:Neurite){
    // Initialize children
    this.children = [];

    // Create Branch elements
    this.nodes = [];
    // First node is special (root)
    this.nodes.push(new BranchElement(1,nodes[0], root, this));
    // Now continue
    for( var i = 1 ; i < nodes.length ; ++i){
      this.nodes.push(new BranchElement(i+1,nodes[i], nodes[i-1], this));
    }

    this.status = Status.none;
  }


  /**
   * Returns the id of the root node. -1  if it does not exist.
   *
   * @return {number} Root ID
   */
  public rootID(){
    if(this.root)
      return this.root.id;
    else
      return -1;
  }

  /**
   * Returns the id of the i-th node
   *
   * @param  {number} i Node index
   * @return {number} node ID.
   */
  public nodeID(i:number){
    return this.nodes[i].node.id;
  }


  /**
   * Returns the node whose ID is nodeId (or null)
   *
   * @param  {number} nodeId lookup id
   * @return {Node3D}
   */
  public searchNode(nodeId: number){
    for(let n of this.nodes){
      if(n.node.id == nodeId) return n;
    }

    if(this.children){
      for(let c of this.children){
        let res = c.searchNode(nodeId);
        if(res != null) return res;
      }
    }
    return null;
  }

  /**
   * Returns the current status of the branch
   * @return {boolean} Enabled/disabled status
   */
  public isEnabled(){
    return this.enabled;
  }

  /**
   * Changes the status of the current branch and its descendants
   * @param  {boolean} v               New status
   * @param  {boolean}  recursive=false If true, descendants are called
   */
  public setEnabled(v:boolean, recursive = false){
    this.enabled=v;
    if(this.rootMesh)
      this.rootMesh.setEnabled(v);

    this.forEachElement( function(i){i.setEnabled(v);} ,recursive );
  }


  /**
   * Executes a function for each element in the branch
   */
  public forEachElement( fn:(item:BranchElement) => void, recursive = true){
    for(let n of this.nodes ){
      fn(n);
    }

    if(this.children && recursive){
      for(let c of this.children){
        c.forEachElement(fn,true);
      }
    }
  }


  /**
   * Number of nodes in the branch (excluding the root)
   *
   * @return {number} Node count
   */
  public size(){
    return this.nodes.length;
  }


  /**
   *  Branch id as a string
   *
   * @return {string}  Branch id as string
   */
  public idString(){
    let idstr = "";
    idstr+= this.id[0];
    for( let i = 1; i < this.id.length ; ++i )
      idstr += "-" + this.id[i];
    return idstr;
  }

  /**
   * Returns the total nomber of descendants of the given branch
   * @return {number} Sbutree size
   */
  public subtreeSize(){
    let acum = 1;
    if(this.children){
      for(let c of this.children){
        acum += c.subtreeSize();
      }
    }
    return acum;
  }

  /**
   * Returns all the descendant branches of the given branch
   * @return {Array<Branch>} Subtree
   */
  public subtree(){
    let arr =[]

    arr.push(this);
    if(this.children){
      for(let c of this.children){
        arr=arr.concat(c.subtree());
      }
    }

    return arr;
  }


  /**
   * Update the id of the branch and its descendants
   *
   * @param  {Array<number>} id new ID
   */
  public updateID(id:Array<number>){
    this.id = id.slice(0);
    if(this.children){
      for(let i = 0 ; i< this.children.length; ++i){
          let chID = id.slice(0);
          chID.push(i+1);
          this.children[i].updateID(chID);
      }
    }
  }

  /**
   * Returns the branch and its descendants as an array of lines
   * @param  {boolean} recursive=true If true, daughter branches are also processed
   * @return {Array}                 Array of 3D points. The 3D lines
   */
  public asLineArray(recursive = true) : Array<Array<Point3D>> {
    let lines :  Array<Array<Point3D>> = [];

    for(let el of this.nodes){
      let aux = el.asLine();
      if(aux.length != 0)
        lines.push(aux);
    }

    if(recursive && this.children){
      for(let ch of this.children){
        let aux = ch.asLineArray();
        if(aux.length != 0){
          lines = lines.concat(aux);
        }
      }
    }
    return lines;
  }


  /**
   * Updates the material of every element
   *
   */
  public updateMaterial(recursive = true) {
    if (this.neurite){
      this.forEachElement( (it) => it.updateMaterial(),recursive);
    }
    if(this.rootMesh && this.neurite){
      this.rootMesh.material = materialPicker(this.neurite.material,this.status);
      this.rootMesh.material.markDirty();
    }
  }


  /**
   * Changes the status of the branch
   *
   * @param  {Status} status new status
   * @param  {bool} propagate Should status be propagated to nodes and children? (default  = true)
   */
  public setStatus(status: Status, propagate = true ){
    this.status = status;
    for(let el of this.nodes){
      el.setStatus(status)
    }

    if(propagate)
      if(this.children){
        for(let c of this.children){
          c.setStatus(status,propagate)
      }
    }

    if(this.rootMesh && this.neurite){
      this.rootMesh.material = materialPicker(this.neurite.material,this.status);
    }
  }


  /**
   * Draws the branch and its elements in the given Drawer
   *
   * @param  {Drawer} drawer Class that draws the branch
   * @param  {bool} recursive Should branch descendants be drawn? (default: true)
   */
  public draw(drawer : Drawer, recursive = false, linear:boolean = false ){
    this.enabled = true;
    for(let el of this.nodes){
      el.draw(drawer,linear)
    }
    if(recursive){
      for( let ch of this.children){
        ch.draw(drawer,true,linear);
      }
    }
  }


  /**
   * Draws branch root
   *
   * @param  {Drawer} drawer Class that draws the branch
   */
  public drawRoot(drawer : Drawer){
    if(this.rootMesh)
      this.rootMesh.dispose();

    if(this.root)
     this.rootMesh = drawer.drawSphere(`N0@${this.idString()}`,this.root, this.root.r );
  }


  /**
   * Set given branch as child of the current branch
   *
   * @param  {b} b branch to be set as child
   */
  public appendBranch(b:Branch){
    b.parent = this;
    b.neurite = this.neurite;
    b.root = this.nodes[ this.nodes.length - 1].node; // Set child. branch root
    this.children.push(b)
  }

  public dispose(recursive = true){
    this.enabled = false;
    if(this.rootMesh) this.rootMesh.dispose();
    for(let el of this.nodes){
      el.dispose()
    }
    if(recursive){
      for( let ch of this.children){
        ch.dispose(true);
      }
    }
  }


  /**
   * Creates a branch from the given object
   *
   * @param  {Array<number>} id  Branch ID
   * @param  {BranchJSON} obj JS object
   * @param  {Neurite} neurite parent neurite (optional)
   * @return {Branch}
   */
  public static fromObject( id:Array<number>, obj : BranchJSON, neurite?: Neurite ) {
    // Create nodes
    let root : Node3D = null;
    if(obj.root){
      root=Node3D.fromObj(obj.root);
    }
    let nodes: Array<Node3D>;
    nodes = [];

    for( let n of obj.nodes ){
      nodes.push(Node3D.fromObj(n));
    }

    // Create Branch and their descs
    let branch = new Branch(id,root,nodes);
    if(neurite)
      branch.neurite = neurite;

    // Process its descendants
    if(obj.children){
      for( let i = 0; i < obj.children.length ; ++i){
        // Children id
        let chID = id.slice(0);
        chID.push(i+1);
        branch.appendBranch( Branch.fromObject(chID, obj.children[i], neurite));
      }
    }

    return branch;
  }
}
