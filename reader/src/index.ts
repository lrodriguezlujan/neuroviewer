import {ParserInterface} from "./detail/Parser";
import {SWCParser} from "./detail/SWCParser";
import {JSONParser} from "./detail/JSONParser";

/**
 * Simple function that returns a parser based on the file extension
 * @param  {string}          ext File extension
 * @return {ParserInterface}     Parser
 */
export function parserByFileExtension(ext:string) : ParserInterface {
  var low = ext.toLowerCase();
  switch(low){
    case "swc" : return new SWCParser();
    case "json" : return new JSONParser();
    default: return null;
  }
}

export * from "./detail/Parser"
export * from "./detail/SWCParser"
export * from "./detail/JSONParser"
