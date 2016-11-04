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
        return this.branch.neurite.material.standard;
      case Status.invisible:
        return  this.branch.neurite.material.hidden;
      case Status.selected:
        return this.branch.neurite.material.emmisive;
      case Status.hidden:
        return  this.branch.neurite.material.disminished;
      case Status.highlighted:
        return  this.branch.neurite.material.highlight;
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
