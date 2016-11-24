import { ParserInterface } from "./detail/Parser";
/**
 * Simple function that returns a parser based on the file extension
 * @param  {string}          ext File extension
 * @return {ParserInterface}     Parser
 */
export declare function parserByFileExtension(ext: string): ParserInterface;
export * from "./detail/Parser";
export * from "./detail/SWCParser";
export * from "./detail/JSONParser";
