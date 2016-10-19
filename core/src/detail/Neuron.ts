import{Branch, BranchElement} from "./Branch";
import{Soma,SomaJSON} from "./Soma";
import{Neurite,NeuriteJSON} from "./Neurite";
import{Status} from "./Status";
import{Drawer, DrawMaterialSet, DrawObject} from "./NvCoreInterfaces";

  //
  // Neuron from JSON
  //

  export interface NeuronJSON {

    id: string,
    soma: SomaJSON,
    neurites: Array<NeuriteJSON>,
    properties?: {[key:string]:any}
  };


  /**
   * Neuron model class
   */
  export class Neuron {

    private neurites : Array<Neurite>; // Set of neurites
    private properties : {[key:string]:any};
    public soma : Soma; // Cell soma

    private drawer : Drawer;
    private cutbox : DrawObject;

    /**
     * Neuron constructor
     *
     * @param  {string} id Neuron unique name
     */
    constructor( public id:string ){
      this.neurites = [];
      this.properties = {};
    }


    /**
     * Adds a neurite
     *
     * @param  {Neurite} n Neurite to add
     */
    public addNeurite( n:Neurite){
      n.neuron = this;
      this.neurites.push(n);
    }

    public attachDrawer( drawer : Drawer ){
      if(this.drawer){
        this.drawer.dispose();
      }
      this.drawer = drawer;

      // Update materials
      this.updateMaterials();
    }

    private updateMaterials(){
      if(this.soma){
        this.soma.setMaterial( this.drawer.palette.grey());
      }
      if(this.neurites){
        for(let n of this.neurites) {
          n.updateMaterial(this.drawer.palette.get(n.id));
        }
      }
    }

    /**
     * Adds a property to the neuron
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
     * Number of neurites in the neuron
     *
     */
    public neuriteCount(){
      return this.neurites.length;
    }


    /**
     * Adds a soma to the neuron
     *
     * @param  {Soma} s      Neuron soma
     */
    public setSoma( s:Soma){
      this.soma = s;
    }


    /**
     * Search a node in the neuron by id
     *
     * @param  {number} nodeId   Node id number
     * @param  {number} neurite? Neurite id (optional)
     * @param  {bool} soma   Search only in the soma (default: false)
     * @return {Node3D}
     */
    public searchNode(nodeId: number, neurite?:number, soma = false){
      if(soma)
        return this.soma.searchNode(nodeId);

      if(neurite != null)
        return this.neurites[neurite].searchNode(nodeId);

      let ret: Soma | BranchElement;

      ret = this.soma.searchNode(nodeId);
      if(ret != null) return ret;
      else{
        for(let n of this.neurites){
          ret = n.searchNode(nodeId);
          if(ret != null) return ret;
        }
      }

      return null;

    }


    /**
     * Draws the neuron
     *
     * @param  {type} drawer: Drawer description
     * @return {type}                description
     */
    public draw(linear: boolean = false){
      // Draw soma
      if(this.soma){
        this.soma.draw(this.drawer);
      }

      // Draw each neurite
      if(this.neurites){
        for( let n of this.neurites){
          n.draw(this.drawer,linear);
        }
      }
    }

    public dispose(){
      for( let n of this.neurites )
        n.dispose();
    }

    public hasCutbox(){
      if (! this.properties) return false;
      else {
        return ( this.properties["cutbox_min_x"] && this.properties["cutbox_min_y"] && this.properties["cutbox_min_z"] &&
                 this.properties["cutbox_max_x"] && this.properties["cutbox_max_y"] && this.properties["cutbox_max_z"] );
      }
    }

    public drawCutbox(){
      if(this.hasCutbox()){

        let min = {x: this.properties["cutbox_min_x"], y:this.properties["cutbox_min_y"], z:this.properties["cutbox_min_z"]};
        let max = {x: this.properties["cutbox_max_x"], y:this.properties["cutbox_max_y"], z:this.properties["cutbox_max_z"]};
        let len_x = max.x - min.x;
        let len_y = max.y - min.y;
        let len_z = max.z - min.z;

        this.drawer.drawLineBox(min,len_x,len_y,len_z);

      }
    }

    public forEachElement( fn:(item:BranchElement) => void){
      for(let neurite  of this.neurites){
        neurite.forEachElement(fn);
      }
    }


    /**
     * Creates a neuron instance from a JS object
     *
     * @param  {type} obj : NeuronJSON      description
     * @param  {type} pal : MaterialPalette description
     * @return {type}                       description
     */
    public static fromObject(obj : NeuronJSON){


      let n = new Neuron(obj.id);
      n.setSoma( Soma.fromObject(obj.soma) );

      for(let neurite of obj.neurites){
        n.addNeurite(Neurite.fromObject(neurite) );
      }

      if(obj.properties){
        for(let key in obj.properties){
          n.addProperty(key,obj.properties[key]);
        }
      }

      return n;
    }
  }
