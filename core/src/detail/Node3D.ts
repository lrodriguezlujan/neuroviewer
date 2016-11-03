import {Point3D} from "./NvCoreInterfaces";

  /**
   * @author luis rodriguez-lujan
   *
   * @summary Node definition as JS object
   * @public
   *
   **/
  export interface NodeJSON{
    id: number,
    x: number,
    y: number,
    z: number,
    r: number,
    properties?: {[k:string]:any}
  };

  /**
   * @author luis rodriguez-lujan
   *
   * @summary 3D node class extended from Vector3
   * @public
   **/
  export class Node3D implements Point3D{

    /**
     * Node property map
     **/
    public properties: {[k:string]:any};


  /**
   * Node3D Constructor
   *
   * @param  {number} x    X coordinate
   * @param  {number} y    Y coordinate
   * @param  {number} z    Z coordinate
   * @param  {number} r    Node radius
   * @param  {number} id   Node ID (optional)
   */
  public constructor( public x:number, public y:number, public z:number, public r:number, public id?: number){
    this.properties = {};
  }


  /**
   * Creates a Node3D object from a JS object
   *
   * @see NodeJSON
   *
   * @param  {NodeJSON} obj source object
   * @return {Node3D}
   */
  public static fromObj( obj: NodeJSON){
    if(!(obj)){
      console.log("WTF");
    }
    let node = new Node3D(obj.x, obj.y , obj.z, obj.r, obj.id );
    if(obj.properties){
      for( let prop in obj.properties){
        node.properties[prop] = obj.properties[prop];
      }
    }
    return node;
  }
}; // End node3D
