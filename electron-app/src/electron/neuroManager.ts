import {webContents} from 'electron';
import fs = require("fs");
import constants = require("constants");
import PATH = require("path");
import {NeuronChannels} from './channels';
import {ipcMain} from 'electron';

import {Neuron} from '@neuroviewer/core';
import {parserByFileExtension} from '@neuroviewer/reader'


export class NeuroManagerItem{
  constructor(public id:number, public origin: string, public neuron: Neuron){};
}

export class NeuroManager {

  private nextId = 1;
  constructor(private sender: Electron.WebContents){};

  private items : Array<NeuroManagerItem> = [];
  private self = this;

  public addFromLocalFiles(  paths:string[] ){
    if(paths == null ) return;
    for( let path of paths ){
      this.addLocalFile(path);
    }
  }

  public addFromLocalDirs(  paths:string[] ){
    if(paths == null ) return;
    for( let path of paths ){
      this.addLocalDir(path);
    }

  }

  private addLocalDir(path: string){
    if (fs.accessSync(path, constants.R_OK)) {
      fs.readdir(path, (err,data) => {
        for(let file of data){
            let filedata = PATH.parse(file);
            let ext = filedata.ext.slice(1).toLowerCase();
            if( ext === "swc" || ext === "json"){
              this.addLocalFile(file);
            }
        }
      })
    }
  }

  private addLocalFile( path: string){
    let pathdata = PATH.parse(path);

    //  Check access
    try{
      fs.accessSync(path, fs.R_OK);
      fs.readFile(path,"utf-8", (err,data)=> {
        let parser = parserByFileExtension(pathdata.ext.slice(1));
        parser.readSync(pathdata.name, data);
        if(parser.neuron){
          this.items.push({id:this.nextId++, origin:path, neuron: parser.neuron});
          this.sendEventUpdateList();
        } else {
          console.log(parser.error);
        }
      })
    } catch(e) {
      console.log("fail read")
    }
  }

  private addRemote(  path: string){
    throw new Error("NOT IMPLEMENTED");
  }

  public bindGetRequest(){
    ipcMain.on(NeuronChannels.getNeuronListRequest, this.getRequestListener );
  }

  public unbindGetRequest(){
    ipcMain.removeListener(NeuronChannels.getNeuronListRequest, this.getRequestListener );
  }

  // Instance function. SAFE THIS
  private getRequestListener = (event: Electron.IpcMainEvent) => {
    console.log("GOT A GET NL REQUEST");
    event.sender.send(NeuronChannels.getNeuronListResponse, this.listIds() );
  }

  public listIds(){
    let ids : {id:number, name:string}[] = [];
    for(let el of this.items){
      ids.push({id:el.id,name:el.neuron.id});
    }
    return ids;
  }

  private sendEventUpdateList(){
    console.log("SEND UPDATE LIST EVENT ...");
    this.sender.send(NeuronChannels.updateNeuronList, this.listIds());
  }


}
