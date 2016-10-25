import {Soma} from "./Soma";
import {BranchElement} from "./Branch"
import{Contour, ContourJSON} from "./Contour";
import{Neuron, NeuronJSON} from "./Neuron";
import{Drawer, DrawMaterialSet, DrawObject} from "./NvCoreInterfaces";

export interface ReconstructionJSON {

  neurons: Array<NeuronJSON>,
  properties?: {[key:string]:any},
  contours? : Array<ContourJSON>
};

/**
 * Neuron model class
 */
export class Reconstruction {

  public neurons : Array<Neuron>;
  public contours : Array<Contour>;
  private properties : {[key:string]:any};

  private drawer : Drawer;

  /**
   * Neuron constructor
   *
   * @param  {string} id Neuron unique name
   */
  constructor( ){
    this.neurons = [];
    this.properties = {};
    this.contours = [];
  }


  /**
   * Adds a neruon
   *
   * @param  {Neruon} n Neuron to add
   */
  public addNeuron( n: Neuron){
    this.neurons.push(n);
  }

  public attachDrawer( drawer : Drawer ){
    if(this.drawer){
      this.drawer.dispose();
    }
    this.drawer = drawer;

    for(let n of this.neurons){
      n.attachDrawer(drawer);
    }

  }

  /**
   * Adds a property to the reconstruction
   *
   * @param  {string} key  Property name
   * @param  {any} value   Property value (optional)
   */
  public addProperty( key:string , value? : any ){
    if(value)
      this.properties[key] = value;
    else
      this.properties[key] = [];
  }

  /**
   * Adds a new contour to the neuron
   *
   * @param {Contour} c Contour to be added
   */
  public addContour(c : Contour){
    this.contours.push(c);
  }


  /**
   * Number of neurons in the reconstruction
   *
   */
  public neuronCount(){
    return this.neurons.length;
  }

  /**
   * Number of contours in the reconstruction
   *
   */
  public contourCount(){
    return this.contours.length;
  }

  /**
   * Search a node in the neuron by id
   *
   * @param  {number} nodeId   Node id number
   * @param  {number} neurite? Neurite id (optional)
   * @param  {bool} soma   Search only in the soma (default: false)
   * @return {Node3D}
   */
  public searchNode(nodeId: number, soma = false){

    let ret: Soma | BranchElement;

    for(let n of this.neurons){
      ret = n.searchNode(nodeId, null, soma);
      if(ret != null) return ret;
    }
    return null;
  }


  /**
   * Draws the neuron
   *
   * @param  {type} drawer: Drawer description
   * @return {type}                description
   */
  public draw(linear: boolean){

    // Draw each neuron
    if(this.neurons){
      for( let n of this.neurons){
        n.draw(linear);
      }
    }

    // Draw contours
    if(this.contours){
      for( let c of this.contours){
        c.draw(this.drawer);
      }
    }
  }

  public drawLinear(){

    // Draw each neuron
    if(this.neurons){
      for( let n of this.neurons){
        n.drawLinear();
      }
    }

    // Draw contours
    if(this.contours){
      for( let c of this.contours){
        c.draw(this.drawer);
      }
    }
  }

  public dispose(){
    for( let n of this.neurons )
      n.dispose();

    for( let c of this.contours){
      c.dispose();
    }
  }

  public forEachElement( fn:(item:BranchElement) => void){
    for(let n  of this.neurons){
      n.forEachElement(fn);
    }
  }

  /**
   * Creates a neuron instance from a JS object
   *
   * @param  {type} obj : NeuronJSON      description
   * @param  {type} pal : MaterialPalette description
   * @return {type}                       description
   */
  public static fromObject(obj : ReconstructionJSON){

    let r = new Reconstruction();

    for(let neuron of obj.neurons){
      r.addNeuron( Neuron.fromObject(neuron) );
    }

    if(obj.properties){
      for(let key in obj.properties){
        r.addProperty(key,obj.properties[key]);
      }
    }

    if(obj.contours){
      for(let c of obj.contours){
        r.addContour(Contour.fromObject(c));
      }
    }

    return r;
  }
}
