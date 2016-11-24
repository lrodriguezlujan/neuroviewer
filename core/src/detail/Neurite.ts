import{BranchJSON, Branch, BranchElement} from "./Branch";
import{Node3D} from "./Node3D";
import{Neuron} from "./Neuron";
import{Status,materialColorPicker} from "./Status";
import{Drawer, DrawMaterialSet, DrawObject} from "./NvCoreInterfaces";


  /**
   * Neurite Type enum
   */
  export enum NeuriteType{
    dendrite = 0,
    apical,
    axon,
    unknown,
    soma
  }

  /**
   * Neurite as JS Object definition
   */
  export interface NeuriteJSON {
    id : number,
    type : number,
    materialIndex: number,
    tree: BranchJSON
  }


  /**
   * Neurite model class
   */
  export class Neurite {


  /**
   * Neurite's first branch
   */
  private firstBranch: Branch;
  private lineDrawObj : DrawObject;

  private singleLine = false;
  private enabled = false;
  private status = Status.none;


  /**
   * Neurite constructor
   *
   * @param  {number} id Neurite numeric id
   * @param  {NeuriteTye} type Neurite type id
   * @param  {MaterialPaletteElement} material Neurite assigned material element
   * @param  {Neuron} neuron      Parent neuron
   */
  constructor(public id:number, public type:NeuriteType, public material?: DrawMaterialSet, public neuron?: Neuron){}


  /**
   * Changes neurite root branch
   *
   * @param  {Branch}  b Branch to be set as neurite root
   */
  public setRoot( b:Branch){
    b.neurite = this;
    this.firstBranch = b;
  }


  /**
   * Draws the neurite
   *
   * @param  {Drawer} drawer Class that draws the neurite
   */
  public draw(drawer:Drawer, linear:boolean = false){
    this.enabled = true;
    this.singleLine = false;

    if(this.lineDrawObj)
      this.lineDrawObj.dispose();

    if(this.firstBranch)
      this.firstBranch.draw(drawer,true, linear);
  }

  /**
   * Draws the neurite as a single line element
   * This disables the ability to select branches, but has a great great
   * impact in performance
   * @param  {Drawer} drawer
   */
  public lineDraw(drawer:Drawer){
    this.enabled = true;
    this.singleLine = true;
    if(this.lineDrawObj)
      this.lineDrawObj.dispose();

    if(this.firstBranch){
      this.firstBranch.dispose(true);
      // Get neurite as a line array
      let lines = this.firstBranch.asLineArray(true);
      let color = this.material.getStandardHexcolor();
      this.lineDrawObj = drawer.drawLines(lines, color);
    }
  }

  /**
   * Get current neurite color as a hex string
   * @return {String} Neurite color
   */
  public getColor(){
    return this.material.getStandardHexcolor();
  }


  /**
   * Executes a function for each element in the neurite
   */
  public forEachElement( fn:(item:BranchElement) => void){
    if(this.firstBranch)
      this.firstBranch.forEachElement(fn,true);
  }

  /**
   * Count number of branches in the neurite
   */
  public branchCount(){
    if(this.firstBranch){
      return this.firstBranch.subtreeSize();
    } else {
      return 0;
    }
  }

  /**
   * Returns all neurite branches in an Array
   */
  public allBranches(){
    if(this.firstBranch){
      return this.firstBranch.subtree();
    } else {
      return [];
    }
  }

  /**
   * Checks enable status
   */
  public isEnabled(){
    return this.enabled;
  }

  /**
   * Set enabled/disabled status
   * @param  {boolean} v               [description]
   * @param  {[type]}  recursive=false [description]
   */
  public setEnabled(v:boolean, recursive = false){
    this.enabled=v;
    if(this.firstBranch){
      this.firstBranch.setEnabled(v,true);
    }

    if(this.singleLine){
      this.lineDrawObj.setEnabled(v);
    }

  }


  /**
   * Auxiliar method that translates int (SWC) to neurite type
   *
   * @param  {t} t numeric type id
   */
  public static neuriteTypeFromNumber(t : number ){
    switch(t){
      case 0 : return NeuriteType.unknown;
      case 1:  return NeuriteType.soma;  // Soma in SWC
      case 2:  return NeuriteType.axon;  //
      case 3:  return NeuriteType.dendrite;
      case 4:  return NeuriteType.apical;
      default: return NeuriteType.unknown;  // Anything else
    }
  }


  /**
   * Updates neurite material
   *
   * @param  {MaterialPaletteElement} mat New material
   */
  public updateMaterial(mat:DrawMaterialSet, propagate = true){
    this.material = mat;
    if(!this.singleLine){
      if(this.firstBranch && propagate){
        this.firstBranch.updateMaterial(true);
      }
    } else {
      if(this.lineDrawObj){
        this.lineDrawObj.color = this.neuron.getDrawer().colorFormHex(materialColorPicker(this.material, this.status));
        this.lineDrawObj.material.markDirty();
      }
    }
  }


  /**
   * Changes the status
   *
   * @param  {Status} status new status
   * @param  {bool} propagate @see Branch.setStatus (default: true)
   */
  public setStatus(status: Status, propagate = true ){
    this.status = status;
    if ( (!this.singleLine) && this.firstBranch)
      this.firstBranch.setStatus(status,propagate);

    this.updateMaterial(this.material,false);
  }


  /**
   * Creates a new Neurite from a JS object
   *
   * @param  {NeuriteJSON} obj Object
   * @param  {MaterialPalette} pal Material palette to pick the element from
   */
  public static fromObject(obj : NeuriteJSON){
    let type : NeuriteType;
    type = Neurite.neuriteTypeFromNumber(obj.type);
    let n = new Neurite(obj.id, type);
    n.setRoot( Branch.fromObject([1],obj.tree, n));

    return n;
  }


  /**
   * Returns the node if it is present in the neurite
   *
   * @param  {number} nodeId Node ID
   * @return {Node3D}
   */
  public searchNode(nodeId: number){
    return this.firstBranch.searchNode(nodeId);
  }


  /**
   * Standarizes branch Ids in the neurite
   *
   */
  public reassignBranchIds(){
    this.firstBranch.updateID([0]);
  }

  public dispose(){
    this.enabled = false;
    if(this.firstBranch) this.firstBranch.dispose(true);
    if(this.lineDrawObj) this.lineDrawObj.dispose();
  }

} // Neurite class end
