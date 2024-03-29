import{Status} from "./Status";
import{Point3D,Drawer, DrawMaterialSet, DrawObject} from "./NvCoreInterfaces";

/**
 *  Contour as JS object
 */
export interface ContourJSON {
  name : string,
  face_color : string,
  back_color : string,
  closed : boolean,
  fill : number,
  resolution : number,
  points : Array<Point3D>
};


/**
 * Soma model class
 */
export class Contour {

  // Contour properties
  public name : string;
  public face_color : string;
  public back_color : string;
  public closed : boolean;
  public fill : number;
  public resolution : number;

  // contour status
  public status: Status;

  // Contour associated mesh
  private mesh : DrawObject;
  private enabled : boolean;
  private drawer : Drawer;

  /**
   * Contour constructor
   *
   * @param  {Array<Point3D>} nodes Nodes that are part of the soma
   * @param  {MaterialPaletteElement} m material element (optional)
   */
  constructor(public points:Array<Point3D> ) {

    this.status = Status.none; // Default status: none
    this.name = "";
    this.face_color = "#ffffff";
    this.back_color = "#000000";
    this.closed = false;
    this.fill = 0;
    this.resolution = 1;
  }

  public size(){
    return this.points.length;
  }

  /**
   * Changes status
   *
   * @param  {type} s: Status description
   */
  public setStatus( s: Status ){
    this.status = s;
    this.updateColor();

  }

  public updateColor(){
    if(this.drawer){
      if(this.status == Status.highlighted){
        this.mesh.color = this.drawer.colorFormHex("#FFFF00");
      } else {
        this.mesh.color = this.drawer.colorFormHex(this.face_color);
      }
    }
  }


  /**
   * Returns the i-th point in the contour
   *
   * @param  {number} node index
   * @return {Point3D}
   */
  public node(i : number){
    return this.points[i];
  }


  /**
   * Draws the contour in the drawer
   *
   * @param  {Drawer} drawer drawer class
   */
  public draw(drawer:Drawer){

    if(this.mesh)
      this.mesh.dispose();

    this.drawer = drawer;
    // Just draw spheres and merge them
    this.enabled = true;
    this.mesh = drawer.drawContour(this.points,
                       this.closed,
                       this.face_color,
                       this.back_color,
                       this.fill);
  }

  /**
   * Returns the enabled/disabled status
   * @return {boolean} True if the contour is visible
   */
  public isEnabled(){
    return this.enabled;
  }

  /**
   * Changes the enabled/disabled status
   * @param  {boolean} v New status
   */
  public setEnabled(v:boolean){
    this.enabled=v;
    if(this.mesh){
      this.mesh.setEnabled(v);
    }
  }

  /**
   * Frees all allocated resources. disposes the meshes
   */
  public dispose(){
    this.enabled = false;
    this.mesh.dispose();
  }

  /**
   * Creates a soma class from a JS object
   *
   * @param  {ContourJSON} obj             JS object
   * @return {Contour}
   */
  public static fromObject( obj : ContourJSON ){

    // Create base contour
    let c = new Contour(obj.points);

    // Set properties
    c.name = obj.name;
    c.face_color = obj.face_color;
    c.back_color = obj.back_color;
    c.closed = obj.closed;
    c.fill = obj.fill;
    c.resolution = obj.resolution;

    // Return contour
    return c;
  }

} // End soma class
