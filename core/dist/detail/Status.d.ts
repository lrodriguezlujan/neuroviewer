import { DrawMaterialSet, DrawMaterial } from "./NvCoreInterfaces";
/**
 * Possible element statuses
 */
export declare enum Status {
    none = 0,
    invisible = 1,
    selected = 2,
    hidden = 3,
    highlighted = 4,
}
/**
 * Chose a material from a set based on the given status
 * @param  {DrawMaterialSet} pal [description]
 * @param  {Status}          s   [description]
 */
export declare function materialPicker(pal: DrawMaterialSet, s: Status): DrawMaterial;
/**
 * Choose a material and then returns its Hex color string
 */
export declare function materialColorPicker(pal: DrawMaterialSet, s: Status): string;
