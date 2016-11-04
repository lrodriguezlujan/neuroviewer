import { DrawMaterialSet } from "./NvCoreInterfaces";
export declare enum Status {
    none = 0,
    invisible = 1,
    selected = 2,
    hidden = 3,
    highlighted = 4,
}
export declare function materialPicker(pal: DrawMaterialSet, s: Status): any;
export declare function materialColorPicker(pal: DrawMaterialSet, s: Status): any;
