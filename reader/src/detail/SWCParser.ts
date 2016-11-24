import {Node3D, Branch, Neurite, NeuriteType, Neuron, Soma, Reconstruction} from "@neuroviewer/core";
import {ParserInterface} from "./Parser";

/**
 * SWC Data row interface
 */
  interface SWCDataRow {
    type : NeuriteType,
    node : Node3D,
    parent: number,
    descCount: number
  };

  /**
  *  SWCReader class
  *  Reads a SWC FILE and produces a Reconstruction
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

      /**
       * Empty constructor
       */
      constructor(){}

      /**
       * SWC Read function
       * @param  {string} data SWC File as a single string
       * @param  {fn}  cb   Callback function
       * @return {Reconstruction}  Single neuron reconstruction object
       */
      public read(data : string, cb:( n:Reconstruction, e?:Error) => void ){
        // Split the data in lines and process it line by line
        this.process(data.split(/\r\n|\n/));
        // Call the callback function
        if(cb)
          cb(this.rec,this.error);
        // Return the reconstruction
        return this.rec;
      };

      /**
       * Creates an empty neuron with given id
       * @param  {string} id Neuron id
       */
      private initializeNeuron(id:string){
        this.neuron = new Neuron(id);
      }

      /**
       * Process a SWC file as an array of lines and creates a Reconstruction object
       * @param  {Array<string>} data SWC file data (line by line)
       */
      private process(data: Array<string>){

        // Create empty neuron
        this.initializeNeuron("");

        // Initialize array
        this.tmpArray = [];

        try {
          for(let line of data){
            // Remove spaces
            line.trim();
            if(SWCParser.isHeader(line)){
              // Process as header line (process properties)
              this.processHeader(line);
            } else {
              // Process data line
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

      /**
       * Checks if the given string is a header line
       * @param  {string} s Trimmed imput stream
       * @return {bool}   True if string is a header line
       */
      private static isHeader(s:string){
        return s[0] == '#';
      }

      /**
       * Process a SWC header line, extracting any matching property
       * @param  {string} s Header line
       */
      private processHeader(s:string){
        // Remove leading #
        let tmp = s.slice(1);
        tmp.trim();

        // Split by whitespace and/or tabs
        let fields = s.split(/\s+/);

        // We have something to process
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

      /**
       * Process a data line and stores the node in a temporal array
       * @param  {string} s Data line
       */
      private processData(s:string){
        s.trim();
        let fields = s.split(/\s+/);

        // Get node fields
        let id = parseInt(fields[0]);
        let type = parseInt(fields[1]);

        let x = parseFloat(fields[2]);
        let y = parseFloat(fields[3]);
        let z = parseFloat(fields[4]);
        let d = parseFloat(fields[5]);

        let parent = parseInt(fields[6]);

        // Store by id
        this.tmpArray[id] = {
          type : Neurite.neuriteTypeFromNumber(type),
          node : new Node3D(x,y,z,d/2,id),
          parent : parent,
          descCount : 0
        }
      }

      /**
       * Updates the desc count of the nodes in the temporal array
       */
      private countDescs(){
        for (let el of this.tmpArray) {
          // For each node we increment the desc count of the parent node
          if(el && el.parent != -1)
            this.tmpArray[el.parent].descCount++;
        }
      }

      /**
       * Creates the neurites based on the temporal array nodes
       */
      private createNeurites(){
        // Temporal branch storage
        this.tmpBranches = {};

        // Update descount
        this.countDescs();

        // For each node...
        for (let el of this.tmpArray) {
          if(el){
            // If its not a soma node and has 0 or more than 1 descs
            // is the last node of a branch...
            if(el.descCount != 1 && el.type != NeuriteType.soma ){
              // Create a branch with terminal node el
              let b = this.buildBranch(el);
              let id: number;

              // Get root node id to index the branches
              if(b.rootID() == -1){
                id = b.nodeID(0);
              } else {
                id = b.rootID();
              }

              // Store the branches by id
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
          // Find a root and then rebuild the rest of the branches
          if(el){
            if( el.parent == -1 || el.type == NeuriteType.soma ){
              // This is a root
              if(this.tmpBranches[el.node.id]){
                for(let br of this.tmpBranches[el.node.id]){
                  // Build a neurite with root branch br
                  if(el.type != NeuriteType.soma)
                    this.buildNeurite(br,el.type);
                  else
                    this.buildNeurite(br,this.tmpArray[br.nodeID(1)].type);
                }
              }
            }
          }
        }
      }

      /**
       * Creates a branch with last node el. It goes backwards until
       * it finds a node with more than one desc, a soma node o a node with no parent
       * @param  {SWCDataRow} el Last node element
       * @return {Branch}
       */
      private buildBranch(el : SWCDataRow){

        // Single node branch
        if(el.parent == -1){
          return new Branch([],el.node,[el.node]);
        }

        // Branch nodes
        let nodes : Array<Node3D> =[el.node];
        // Current candidate
        let i = this.tmpArray[el.parent];

        // Go "upwards" untill we find a root node
        while(i.descCount != 2 && i.type != NeuriteType.soma && i.parent!=-1 ){
          nodes.push(i.node);
          i = this.tmpArray[i.parent];
        }
        // Specal case : Orphan (not attached to soma)
        if(i.parent == -1 ){
          nodes.push(i.node);
        }

        // Reverse the order of the nodes to match the real order
        nodes.reverse();
        // Create the branch
        return new Branch([],i.node,nodes);
      }

      /**
       * Creates a neurite with root branch b and adds it to the neuron
       * @param  {Branch}      b    Root branch
       * @param  {NeuriteType} type Neurite type
       */
      private buildNeurite(b: Branch, type: NeuriteType){

        // Create an empty neurite
        let neurite = new Neurite(this.neuron.neuriteCount(), type, undefined, this.neuron );

        // Set branch neuirte reference
        b.neurite = neurite;

        // Attach branches (this creates the structure)
        this.attachBranches(b);

        // Add neurite root
        neurite.setRoot(b);

        // Update branch ids
        neurite.reassignBranchIds();

        // Add to neuron
        this.neuron.addNeurite(neurite);
      }

      /**
       * Given a branch looks for its daughter branches and attach them recursively
       * @param  {Branch} b Current branch
       */
      private attachBranches(b : Branch){
        let lastID = b.nodeID(b.size()-1);
        if(this.tmpBranches[lastID]){
          for(let br of this.tmpBranches[lastID] ){
            b.appendBranch(br); // This should b b4 to set neurite property
            this.attachBranches(br);
          }
        }
      }

      /**
       * Sets the neuron soma
       */
      private addSoma(){
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
