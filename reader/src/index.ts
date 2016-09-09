import {ParserInterface} from "./detail/Parser";
import {SWCParser} from "./detail/SWCParser";
import {JSONParser} from "./detail/JSONParser";

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
