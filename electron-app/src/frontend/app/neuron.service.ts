import { Injectable }    from '@angular/core';
import { ipcRenderer} from 'electron';

import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {NeuronChannels} from './channels';
import {Neuron} from '@neuroviewer/core';


@Injectable()
export class NeuronService {

  // Async updates
  private _ids : BehaviorSubject<Array<{id:number, name:string}>> = new BehaviorSubject([]);
  public ids: Observable<Array<{id:number, name:string}>> = this._ids.asObservable();

  // Current active neuron. Only one neuron can be active.
  private activeNeuron : {
    id: number,
    origin: string,
    neuron: Neuron
  };

  constructor() {
    this.loadInitialData();
    this.bindToUpdates();
  }

  /**
   * Request the neuron list from the backend.
   * Has a timetout parameter to reject the promise.
   */
  public getNeuronList(timeoutts = 5000): Promise<Array<{id:number, name:string}>> { // TODO
     // return Promise.resolve(TEST_NEURONS);
     return new Promise( (resolve,reject) => {
       // Send request
       ipcRenderer.send(NeuronChannels.getNeuronListRequest);
       ipcRenderer.once(NeuronChannels.getNeuronListResponse, (event,list) => {
         resolve(list)
       })
       // Promise timeout
       window.setTimeout(
        function() {
          reject("Timeout")
        }, timeoutts);
     }).catch(this.handleError);
   }

   /**
    * Request the neuron by id to the backend
    * Timeout in millis
    */
   public setActiveNeuron(id : number,timeoutts = 5000): Promise<{neuron:Neuron}> {
     return new Promise( (resolve,reject) => {
       // Send request
       ipcRenderer.send(NeuronChannels.getNeuronRequest, id);
       ipcRenderer.once(NeuronChannels.getNeuronResponse, (event, obj) => {
         if(obj){
           // Update active neuron
           this.activeNeuron = obj;
           // Resolve
           resolve(obj.neuron);
         } else {
           reject("empty")
         }
       })

       // Timeout
       window.setTimeout(
        function() {
          reject("Timeout")
        }, timeoutts);
     }).catch(this.handleError)
   };

   public getActiveNeuron(){
     if(this.activeNeuron)
      return this.activeNeuron.neuron;
     else
      return undefined;
   }

   public getActiveNeuronOrigin(){
     if(this.activeNeuron)
      return this.activeNeuron.origin;
     else
      return undefined;
   }

   public getActiveNeuronId(){
     if(this.activeNeuron)
      return this.activeNeuron.id;
     else
      return undefined;
   }

  /**
   * Gets the neuron list and updates the observable item
   **/
  private loadInitialData(){
     this.getNeuronList().then( (neurons) => this._ids.next(neurons))
     .catch(this.handleError);
   }

   /**
    * Binfs to the updateNL channel to be triggered whenever the list changes
    * in the backend
    */
   private bindToUpdates(){
     ipcRenderer.on(NeuronChannels.updateNeuronList,this.updateNLCallback)
   }

   // Update callback function
   private updateNLCallback = (event, neurons) => {
     console.log("GOT UPDATE EVENT")
     console.log(neurons)
     this._ids.next(neurons);
   }

  /**
   * Generic function to hande errors. ToDO (log service + notification)
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // TODO
    return Promise.reject(error.message || error);
  }
}
