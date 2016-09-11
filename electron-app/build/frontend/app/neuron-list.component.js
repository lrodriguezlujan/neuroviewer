"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var neuron_service_1 = require('./neuron.service');
var NeuronListComponent = (function () {
    function NeuronListComponent(neuronService, zone) {
        var _this = this;
        this.neuronService = neuronService;
        this.zone = zone;
        this.neurons = [];
        this.suscribeNeuronServiceUpds = function (neurons) {
            _this.zone.run(function () {
                _this.neurons = neurons.slice(0);
            });
        };
        // Subscribe
        this.subscription = neuronService.ids.subscribe(this.suscribeNeuronServiceUpds);
    }
    NeuronListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.neuronService.getNeuronList()
            .then(function (neurons) {
            _this.neurons = neurons.slice(0);
            ;
        });
    };
    ;
    NeuronListComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsuscribe();
    };
    NeuronListComponent = __decorate([
        core_1.Component({
            selector: 'nv-neuron-list',
            templateUrl: 'templates/neuron-list.component.html',
            styleUrls: ["styles/neuron-list.component.css"]
        }), 
        __metadata('design:paramtypes', [neuron_service_1.NeuronService, core_1.NgZone])
    ], NeuronListComponent);
    return NeuronListComponent;
}());
exports.NeuronListComponent = NeuronListComponent;
//# sourceMappingURL=neuron-list.component.js.map