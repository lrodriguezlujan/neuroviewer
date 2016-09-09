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
var electron_1 = require('electron');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var NeuronService = (function () {
    function NeuronService() {
        var _this = this;
        // Async updates
        this._ids = new BehaviorSubject_1.BehaviorSubject([]);
        this.ids = this._ids.asObservable();
        this.updateNLCallback = function (event, neurons) {
            console.log("GOT UPDATE EVENT");
            console.log(neurons);
            _this._ids.next(neurons);
        };
        this.loadInitialData();
        this.bindToUpdates();
    }
    NeuronService.prototype.getNeurons = function () {
        // return Promise.resolve(TEST_NEURONS);
        return new Promise(function (resolve, reject) {
            // Send request
            electron_1.ipcRenderer.send("getNL");
            electron_1.ipcRenderer.once("getNLres", function (event, list) {
                resolve(list);
            });
            // Promise timeout
            window.setTimeout(function () {
                reject("Timeout");
            }, 5000);
        }).catch(this.handleError);
    };
    NeuronService.prototype.loadInitialData = function () {
        var _this = this;
        this.getNeurons().then(function (neurons) { return _this._ids.next(neurons); })
            .catch(this.handleError);
    };
    NeuronService.prototype.bindToUpdates = function () {
        electron_1.ipcRenderer.on("updNL", this.updateNLCallback);
    };
    /*getHeroes() : Promise<Hero[]> {
      return Promise.resolve(HEROES);
    }*/
    NeuronService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    NeuronService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NeuronService);
    return NeuronService;
}());
exports.NeuronService = NeuronService;
var TEST_NEURONS = [
    'First',
    'Second',
    'Third'
];
//# sourceMappingURL=neuron.service.js.map