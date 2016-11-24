import {ReconstructionJSON, Reconstruction} from "@neuroviewer/core";
import {ParserInterface} from "./Parser";

  /**
  *  SWCParser class
  *  Reads a SWC FILE and produces a Reconstruction
  */
  export class JSONParser implements ParserInterface {

      public rec: Reconstruction;
      public error: Error;

      constructor(){}


      /**
       * JSON Read function
       * @param  {ReconstructionJSON |  string}      data Reconstruction JSON object or a JSON string
       * @param  {fn}                 cb Callback function (Reconstruction,error)
       * @return {Reconstruction}                   Reconstruction object
       */
      public read(data: ReconstructionJSON | string, cb:( n:Reconstruction, e?:Error) => void ){

        if(typeof data == "string" || data instanceof String){
          // Convert to JSON
          this.process(JSON.parse(<string>data));
        } else {
          this.process(data);
        }

        // Call the callback function
        cb(this.rec,this.error);

        // Return
        return this.rec;
      };

      /**
       * Initializes the reconstruction (Creates an empty one)
       * @return {void}
       */
      private initialize(){
        this.rec = new Reconstruction();
      }

      /**
       * Process the JSON data and creates a reconstruction
       * @param  {ReconstructionJSON} data JSON data
       * @return {Reconstruction} Neuron reconstruction
       */
      private process(data: ReconstructionJSON){

        // Create empty neuron
        this.initialize();
        try{
          // Just creates an object from the json
          this.rec = Reconstruction.fromObject(data)
        } catch ( e ) {
          this.error = e;
        }
      }
  } // End JSON PARSER
