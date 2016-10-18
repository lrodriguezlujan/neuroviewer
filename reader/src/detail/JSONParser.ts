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

      public readAsync(data: ReconstructionJSON | string, cb:( n:Reconstruction, e?:Error) => void ){

        if(typeof data == "string" || data instanceof String){
          // Convert to JSON
          this.process(JSON.parse(<string>data));
        } else {
          this.process(data);
        }

        cb(this.rec,this.error);
      };

      public readSync(data: ReconstructionJSON | string){

        if(typeof data == "string" || data instanceof String){
          // Convert to JSON
          this.process(JSON.parse(<string>data));
        } else {
          this.process(data);
        }

        return this.error;
      };

      private initialize(){
        this.rec = new Reconstruction();
      }

      private process(data: ReconstructionJSON){

        // Create empty neuron
        this.initialize();
        try{
          this.rec = Reconstruction.fromObject(data)
        } catch ( e ) {
          this.error = e;
        }
      }
  } // End JSON PARSER
