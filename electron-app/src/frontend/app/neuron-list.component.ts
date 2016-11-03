import { ChangeDetectorRef, Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NeuronService } from './neuron.service';
import {Observable} from 'rxjs/Observable';

// Material
import {MdList, MdListItem} from '@angular2-material/list/list';

@Component({
  selector: 'nv-neuron-list',
  templateUrl: 'templates/neuron-list.component.html',
  styleUrls: ["styles/neuron-list.component.css"]
})
export class NeuronListComponent implements OnInit {

  public neurons: Array<{id:number, origin: string, name:string}> = [];
  private subscription :any;

  constructor(private neuronService: NeuronService, private zone: NgZone) {
    // Subscribe
    this.subscription=neuronService.ids.subscribe(
      this.suscribeNeuronServiceUpds
    );
  }

  private suscribeNeuronServiceUpds = (neurons : Array<{id:number, origin: string, name:string}>) => {
    this.zone.run( () => {
      this.neurons = neurons.slice(0);
    })
  };

  ngOnInit(): void {
    this.neuronService.getNeuronList()
      .then(neurons => {
        this.neurons = neurons.slice(0);;
      });
  };

  ngOnDestroy() {
    this.subscription.unsuscribe();
  }

}
