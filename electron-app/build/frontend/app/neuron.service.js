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
var channels_1 = require('./channels');
var NeuronService = (function () {
    function NeuronService() {
        var _this = this;
        // Async updates
        this._ids = new BehaviorSubject_1.BehaviorSubject([]);
        this.ids = this._ids.asObservable();
        // Update callback function
        this.updateNLCallback = function (event, neurons) {
            console.log("GOT UPDATE EVENT");
            console.log(neurons);
            _this._ids.next(neurons);
        };
        this.loadInitialData();
        this.bindToUpdates();
    }
    /**
     * Request the neuron list from the backend.
     * Has a timetout parameter to reject the promise.
     */
    NeuronService.prototype.getNeuronList = function (timeoutts) {
        if (timeoutts === void 0) { timeoutts = 5000; }
        // return Promise.resolve(TEST_NEURONS);
        return new Promise(function (resolve, reject) {
            // Send request
            electron_1.ipcRenderer.send(channels_1.NeuronChannels.getNeuronListRequest);
            electron_1.ipcRenderer.once(channels_1.NeuronChannels.getNeuronListResponse, function (event, list) {
                resolve(list);
            });
            // Promise timeout
            window.setTimeout(function () {
                reject("Timeout");
            }, timeoutts);
        }).catch(this.handleError);
    };
    /**
     * Request the neuron by id to the backend
     * Timeout in millis
     */
    NeuronService.prototype.setActiveNeuron = function (id, timeoutts) {
        var _this = this;
        if (timeoutts === void 0) { timeoutts = 5000; }
        return new Promise(function (resolve, reject) {
            // Send request
            electron_1.ipcRenderer.send(channels_1.NeuronChannels.getNeuronRequest, id);
            electron_1.ipcRenderer.once(channels_1.NeuronChannels.getNeuronResponse, function (event, obj) {
                if (obj) {
                    // Update active neuron
                    _this.activeNeuron = obj;
                    // Resolve
                    resolve(obj.neuron);
                }
                else {
                    reject("empty");
                }
            });
            // Timeout
            window.setTimeout(function () {
                reject("Timeout");
            }, timeoutts);
        }).catch(this.handleError);
    };
    ;
    NeuronService.prototype.getActiveNeuron = function () {
        if (this.activeNeuron)
            return this.activeNeuron.neuron;
        else
            return undefined;
    };
    NeuronService.prototype.getActiveNeuronOrigin = function () {
        if (this.activeNeuron)
            return this.activeNeuron.origin;
        else
            return undefined;
    };
    NeuronService.prototype.getActiveNeuronId = function () {
        if (this.activeNeuron)
            return this.activeNeuron.id;
        else
            return undefined;
    };
    /**
     * Gets the neuron list and updates the observable item
     **/
    NeuronService.prototype.loadInitialData = function () {
        var _this = this;
        this.getNeuronList().then(function (neurons) { return _this._ids.next(neurons); })
            .catch(this.handleError);
    };
    /**
     * Binfs to the updateNL channel to be triggered whenever the list changes
     * in the backend
     */
    NeuronService.prototype.bindToUpdates = function () {
        electron_1.ipcRenderer.on(channels_1.NeuronChannels.updateNeuronList, this.updateNLCallback);
    };
    /**
     * Generic function to hande errors. ToDO (log service + notification)
     */
    NeuronService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // TODO
        return Promise.reject(error.message || error);
    };
    NeuronService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], NeuronService);
    return NeuronService;
}());
exports.NeuronService = NeuronService;
//# sourceMappingURL=neuron.service.js.map