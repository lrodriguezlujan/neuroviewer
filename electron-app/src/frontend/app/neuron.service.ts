import { Injectable }    from '@angular/core';
import { ipcRenderer} from 'electron';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class NeuronService {

  // Async updates
  private _ids : BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  public ids: Observable<Array<string>> = this._ids.asObservable();

  constructor() {
    this.loadInitialData();
    this.bindToUpdates();
  }

  public getNeurons(): Promise<Array<string>> { // TODO
     // return Promise.resolve(TEST_NEURONS);
     return new Promise( (resolve,reject) => {
       // Send request
       ipcRenderer.send("getNL");
       ipcRenderer.once("getNLres", (event,list) => {
         resolve(list)
       })
       // Promise timeout
       window.setTimeout(
        function() {
          reject("Timeout")
        }, 5000);
     }).catch(this.handleError);
   }

   private loadInitialData(){
     this.getNeurons().then( (neurons) => this._ids.next(neurons))
     .catch(this.handleError);
   }

   private bindToUpdates(){
     ipcRenderer.on("updNL",this.updateNLCallback)
   }

   private updateNLCallback = (event, neurons) => {
     console.log("GOT UPDATE EVENT")
     console.log(neurons)
     this._ids.next(neurons);
   }


  /*getHeroes() : Promise<Hero[]> {
    return Promise.resolve(HEROES);
  }*/

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}


const TEST_NEURONS: string[] = [
  'First',
  'Second',
  'Third'
];
