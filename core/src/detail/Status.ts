import {DrawMaterialSet, DrawMaterial} from "./NvCoreInterfaces";

export enum Status {
    none,
    invisible,
    selected,
    hidden,
    highlighted
};

export function materialPicker(pal : DrawMaterialSet, s:Status){
  if( pal != null){
    switch(s){
      case Status.none:
        return pal.standard;
      case Status.invisible:
        return  pal.hidden;
      case Status.selected:
        return pal.emmisive;
      case Status.hidden:
        return  pal.disminished;
      case Status.highlighted:
        return  pal.highlight;
    }
  } else {
    return null;
  }
}

export function materialColorPicker(pal : DrawMaterialSet, s:Status){
  let m = materialPicker(pal,s);
  if(m != null){
    return m.diffuseColor.toHexString();
  } else {
    return "#FFFFFF";
  }

}
