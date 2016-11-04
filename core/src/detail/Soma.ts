
import{NodeJSON, Node3D} from "./Node3D";
import{Status} from "./Status";
import{Drawer, DrawObject ,DrawMaterialSet} from "./NvCoreInterfaces";

  /**
   *  Soma as JS object
   */
  export interface SomaJSON {
    nodes : Array< NodeJSON >,
    isContour? : boolean,
    status? : number // 0 for none, 1 for highlighted, 2 for hidden 3 for invisible
  };


/**
 * Soma model class
 */
export class Soma {

// Nodes in the soma
  public nodes: Array<Node3D>;

  // Soma status
  public status: Status;

  // Soma associated mesh
  private mesh : DrawObject;

  /**
   * Soma constructor
   *
   * @param  {Array<Node3D>} nodes Nodes that are part of the soma
   * @param  {bool} isContour Are the nodes part of the contour of the soma? (default: false)
   * @param  {MaterialPaletteElement} m Soma material element (optional)
   */
  constructor( nodes:Array<Node3D>, public isContour = false,  private mat?:DrawMaterialSet ) {

    this.status = Status.none; // Default status: none

    // IF soma is contour we need to compute the convex hull
    if(isContour){
      this.convexHull3D(nodes)
    }
    else{
      this.nodes = nodes;
    }
  }


  /**
   * Changes soma material
   *
   * @param  {MaterialPaletteElement} m New soma material
   */
  public setMaterial( m:DrawMaterialSet){
    this.mat = m;
    this.updateMaterial();
  }


  /**
   * Looks for the given node in the soma
   *
   * @param  {number} nodeId Node identifier
   * @return {Node3D}
   */
  public searchNode(nodeId: number){
    for( let n of this.nodes){
      if(n.id == nodeId) return this;
    }
    return null;
  }


  /**
   * Changes soma status
   *
   * @param  {type} s: Status description
   */
  public setStatus( s: Status ){
    this.status = s;
    this.updateMaterial();
  }


  /**
   * Returns the i-th node in the soma
   *
   * @param  {number} node index
   * @return {Node3D}
   */
  public node(i : number){
    return this.nodes[i];
  }


  /**
   * Updates soma mesh material
   *
   */
  private updateMaterial(){
    if(this.mesh) this.mesh.material = this.pickMaterial();
  }


  /**
   * Draws the soma in the drawer
   *
   * @param  {Drawer} drawer drawer class
   */
  public draw(drawer:Drawer){

    if(this.mesh){
      this.mesh.dispose();
    }

    if(this.isContour){
      // ConvexHull should provide a mesh...well... somehow.
      // TODO
    } else {
      // Just draw spheres and merge them
      let meshes = [];
      for( var i = 0; i< this.nodes.length ; ++i){
        meshes.push( drawer.drawSphere(`S${this.nodes[i].id}`, this.nodes[i], this.nodes[i].r) )
      }
      // Merge
      this.mesh = drawer.merge(meshes);
    }
    // Set mesh material
    this.mesh.material = this.pickMaterial();
  }


  /**
   * Computes the convex hull of the given contour nodes
   *
   * @param  {Array<Node3D>} nodes Soma contour
   */
  private convexHull3D(nodes:Array<Node3D>){
    // TODO
    this.nodes = nodes;
  }


  /**
   * Selects the material based on teh status
   *
   * @return {type}  description
   */
  private pickMaterial(){
    switch(this.status){
      case Status.none:
        return this.mat.standard;
      case Status.invisible:
        return this.mat.hidden;
      case Status.selected:
        return this.mat.emmisive;
      case Status.hidden:
        return this.mat.disminished;
      case Status.highlighted:
        return this.mat.highlight;
    }
  }


  /**
   * Creates a soma class from a JS object
   *
   * @param  {SomaJSON} obj             JS object
   * @param  {MaterialPaletteElement} m Material element
   * @return {Soma}
   */
  public static fromObject( obj : SomaJSON ){

    // Create nodes
    let nodes: Array<Node3D>;
    nodes = [];
    for( let n of obj.nodes ){
      nodes.push(Node3D.fromObj(n));
    }

    // Check contour property
    let isContour = false;
    if(obj.isContour) isContour = true;

    return new Soma(nodes, isContour);
  }

} // End soma class
