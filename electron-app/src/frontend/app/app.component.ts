import { Component } from '@angular/core';
@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nv-neuron-list></nv-neuron-list>
  `
})
export class AppComponent {
  title = 'NeuroViewer test app'
}
