import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Material modules
import {MdListModule,MdList, MdListItem} from '@angular2-material/list/list';

// Components
import {AppComponent} from './app.component';
import {NeuronListComponent} from './neuron-list.component';


// Services
import {NeuronService} from './neuron.service';

@NgModule({
  imports:      [ BrowserModule,
                  MdListModule],
  declarations: [ AppComponent,
                  NeuronListComponent
  ],
  providers: [
                  NeuronService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
