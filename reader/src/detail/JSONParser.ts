import {NeuronJSON,Neuron} from "@neuroviewer/core";
import {ParserInterface} from "./Parser";

  /**
  *  SWCParser class
  *  Reads a SWC FILE and produces a Neuron
  */
  export class JSONParser implements ParserInterface {

      public neuron: Neuron;

      public error: Error;

      constructor(){}

      public readAsync( id:string , data: NeuronJSON | string, cb:( n:Neuron, e?:Error) => void ){

        if(typeof data == "string" || data instanceof String){
          // Convert to JSON
          this.process(id, JSON.parse(<string>data));
        } else {
          this.process(id, data);
        }

        cb(this.neuron,this.error);
      };

      public readSync(id:string, data: NeuronJSON | string){

        if(typeof data == "string" || data instanceof String){
          // Convert to JSON
          this.process(id, JSON.parse(<string>data));
        } else {
          this.process(id, data);
        }

        return this.error;
      };

      private initializeNeuron(id : string){
        this.neuron = new Neuron(id);
      }

      private process(id:string, data: NeuronJSON){

        // Create empty neuron
        this.initializeNeuron(id);
        try{
          this.neuron = Neuron.fromObject(data)
        } catch ( e ) {
          this.error = e;
        }
      }
  } // End JSON PARSER
