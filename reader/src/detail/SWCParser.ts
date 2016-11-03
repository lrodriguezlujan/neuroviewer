import {Node3D, Branch, Neurite, NeuriteType, Neuron, Soma, Reconstruction} from "@neuroviewer/core";
import {ParserInterface} from "./Parser";


  interface SWCDataRow {
    type : NeuriteType,
    node : Node3D,
    parent: number,
    descCount: number
  };

  /**
  *  SWCReader class
  *  Reads a SWC FILE and produces a Neuron
  */
  export class SWCParser implements ParserInterface {

      public rec: Reconstruction;
      public neuron: Neuron;

      public error: Error;

      private tmpArray : Array<SWCDataRow>;
      private tmpBranches : {[key:number]:Array<Branch>;};

      // Metadata property keys
      private static property_keys = [
        "original_source",      "creature",       "region",       "field", "layer",  "field/layer",
        "type",                 "contributor",    "reference",    "raw",   "extras", "soma_area",
        "shrinkage_correction", "version_number", "version_date", "scale"
      ];

      constructor(){}

      public readAsync(data : string, cb:( n:Reconstruction, e?:Error) => void ){
        this.process(data.split(/\r\n|\n/));
        cb(this.rec,this.error);
        /*let self = this;
        $.ajax({
          type: "GET",
          url: this.url,
          dataType: "text",
          success: function(data){
            self.process(data.split(/\r\n|\n/));
            cb(self.neuron,self.error);
          },
          error: function(e){
            // ADD CORS MSG
          }
        })*/
      };

      public readSync(data : string){
        /*let self = this;
        $.ajax({
          type: "GET",
          url: this.url,
          dataType: "text",
          success: function(data){
            self.process(data.split(/\r\n|\n/)); // Process array of lines
          },
          error: function(e){
            // ADD CORS MSG
          },
          async: false
        });*/
        this.process(data.split(/\r\n|\n/));
        return this.error;
      };

      private initializeNeuron(id:string){
        this.neuron = new Neuron(id);
      }

      private process(data: Array<string>){

        // Create empty neuron
        this.initializeNeuron("");

        // Initialize array
        this.tmpArray = [];

        try {
          for(let line of data){
            line.trim();
            if(SWCParser.isHeader(line)){
              this.processHeader(line);
            } else {
              this.processData(line);
            }
          }

          // Create Neurites
          this.createNeurites();

          // Fill soma
          this.addSoma();

          // Put neuron in the rec
          this.rec = new Reconstruction();
          this.rec.addNeuron(this.neuron);

        } catch ( e ) {
          this.error = e;
        }
      }

      // s should be trimmed
      private static isHeader(s:string){
        return s[0] == '#';
      }

      private processHeader(s:string){
        // Remove leading #
        let tmp = s.slice(1);
        tmp.trim();

        // Split by whitespace and/or tabs
        let fields = s.split(/\s+/);

        if(fields.length > 0){
          // Find in prop keys
          if (SWCParser.property_keys.indexOf(fields[0]) > -1 ) {
            // Create a neuron property and insert it.
            if(fields.length == 1 )
              // Empty
              this.neuron.addProperty( fields[0]  );
            else {
              // Join remaining fields - using string by def.
              this.neuron.addProperty( fields[0], fields.slice(1).join(" ")  );
            }
          }
        }
      }

      private processData(s:string){
        s.trim();
        let fields = s.split(/\s+/);

        let id = parseInt(fields[0]);
        let type = parseInt(fields[1]);

        let x = parseFloat(fields[2]);
        let y = parseFloat(fields[3]);
        let z = parseFloat(fields[4]);
        let d = parseFloat(fields[5]);

        let parent = parseInt(fields[6]);

        this.tmpArray[id] = {
          type : Neurite.neuriteTypeFromNumber(type),
          node : new Node3D(x,y,z,d/2,id),
          parent : parent,
          descCount : 0
        }


        // Neuron is ready
      }

      private countDescs(){
        for (let el of this.tmpArray) {
          if(el && el.parent != -1)
            this.tmpArray[el.parent].descCount++;
        }
      }

      private createNeurites(){
        this.tmpBranches = {};

        // Count descendants
        this.countDescs();

        for (let el of this.tmpArray) {
          if(el){
            if(el.descCount != 1 && el.type != NeuriteType.soma ){
              let b = this.buildBranch(el);
              let id: number;

              if(b.rootID() == -1){
                id = b.nodeID(0);
              } else {
                id = b.rootID();
              }

              if(!this.tmpBranches[id]){
                  this.tmpBranches[id] = [b];
              } else {
                  this.tmpBranches[id].push(b);
              }
            }
          }
        }

        // Now look for root branches to create neurites
        for (let el of this.tmpArray) {
          // Root candidate
          if(el){
            if( el.parent == -1 || el.type == NeuriteType.soma ){
              if(this.tmpBranches[el.node.id]){
                for(let br of this.tmpBranches[el.node.id]){
                  this.buildNeurite(br,el.type);
                }
              }
            }
          }
        }
      }

      private buildBranch(el : SWCDataRow){

        if(el.parent == -1){
          return new Branch([],el.node,[el.node]);
        }

        let nodes : Array<Node3D> =[el.node];
        let i = this.tmpArray[el.parent];

        while(i.descCount != 2 && i.type != NeuriteType.soma && i.parent!=-1 ){
          nodes.push(i.node);
          i = this.tmpArray[i.parent];
        }
        // Specal case : Orphan (not attached to soma)
        if(i.parent == -1 ){
          nodes.push(i.node);
        }

        nodes.reverse();
        return new Branch([],i.node,nodes);
      }

      private buildNeurite(b: Branch, type: NeuriteType){

        let neurite = new Neurite(this.neuron.neuriteCount(), type, undefined, this.neuron );

        b.neurite = neurite;

        // Attach
        this.attachBranches(b);

        // Add root
        neurite.setRoot(b);

        // Update ids
        neurite.reassignBranchIds();

        // Add to neuron
        this.neuron.addNeurite(neurite);
      }

      private attachBranches(b : Branch){
        let lastID = b.nodeID(b.size()-1);
        if(this.tmpBranches[lastID]){
          for(let br of this.tmpBranches[lastID] ){
            b.appendBranch(br); // This should b b4 to set neurite property
            this.attachBranches(br);
          }
        }
      }

      private addSoma(){
        //constructor( nodes:Array<Node3D>, public isContour = false,  m?:MaterialPaletteElement )
        let nodes: Array<Node3D> = [];
        for(let el of this.tmpArray){
          if(el){
            if(el.type == NeuriteType.soma) {
              nodes.push(el.node);
            }
          }
        }

        let soma = new Soma(nodes);
        this.neuron.setSoma( soma );
      }

  }
