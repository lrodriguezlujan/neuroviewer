"use strict";
var fs = require("fs");
var constants = require("constants");
var PATH = require("path");
var channels_1 = require('./channels');
var electron_1 = require('electron');
var reader_1 = require('@neuroviewer/reader');
var NeuroManagerItem = (function () {
    function NeuroManagerItem(id, origin, neuron) {
        this.id = id;
        this.origin = origin;
        this.neuron = neuron;
    }
    ;
    return NeuroManagerItem;
}());
exports.NeuroManagerItem = NeuroManagerItem;
var NeuroManager = (function () {
    function NeuroManager(sender) {
        var _this = this;
        this.sender = sender;
        this.nextId = 1;
        this.items = [];
        this.self = this;
        // Instance function. SAFE THIS
        this.getRequestListener = function (event) {
            console.log("GOT A GET NL REQUEST");
            event.sender.send(channels_1.NeuronChannels.getNeuronListResponse, _this.listIds());
        };
    }
    ;
    NeuroManager.prototype.addFromLocalFiles = function (paths) {
        if (paths == null)
            return;
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            this.addLocalFile(path);
        }
    };
    NeuroManager.prototype.addFromLocalDirs = function (paths) {
        if (paths == null)
            return;
        for (var _i = 0, paths_2 = paths; _i < paths_2.length; _i++) {
            var path = paths_2[_i];
            this.addLocalDir(path);
        }
    };
    NeuroManager.prototype.addLocalDir = function (path) {
        var _this = this;
        if (fs.accessSync(path, constants.R_OK)) {
            fs.readdir(path, function (err, data) {
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var file = data_1[_i];
                    var filedata = PATH.parse(file);
                    var ext = filedata.ext.slice(1).toLowerCase();
                    if (ext === "swc" || ext === "json") {
                        _this.addLocalFile(file);
                    }
                }
            });
        }
    };
    NeuroManager.prototype.addLocalFile = function (path) {
        var _this = this;
        var pathdata = PATH.parse(path);
        //  Check access
        try {
            fs.accessSync(path, fs.R_OK);
            fs.readFile(path, "utf-8", function (err, data) {
                var parser = reader_1.parserByFileExtension(pathdata.ext.slice(1));
                parser.readSync(pathdata.name, data);
                if (parser.neuron) {
                    _this.items.push({ id: _this.nextId++, origin: path, neuron: parser.neuron });
                    _this.sendEventUpdateList();
                }
                else {
                    console.log(parser.error);
                }
            });
        }
        catch (e) {
            console.log("fail read");
        }
    };
    NeuroManager.prototype.addRemote = function (path) {
        throw new Error("NOT IMPLEMENTED");
    };
    NeuroManager.prototype.bindGetRequest = function () {
        electron_1.ipcMain.on(channels_1.NeuronChannels.getNeuronListRequest, this.getRequestListener);
    };
    NeuroManager.prototype.unbindGetRequest = function () {
        electron_1.ipcMain.removeListener(channels_1.NeuronChannels.getNeuronListRequest, this.getRequestListener);
    };
    NeuroManager.prototype.listIds = function () {
        var ids = [];
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var el = _a[_i];
            ids.push({ id: el.id, origin: el.origin, name: el.neuron.id });
        }
        return ids;
    };
    NeuroManager.prototype.sendEventUpdateList = function () {
        console.log("SEND UPDATE LIST EVENT ...");
        this.sender.send(channels_1.NeuronChannels.updateNeuronList, this.listIds());
    };
    return NeuroManager;
}());
exports.NeuroManager = NeuroManager;
//# sourceMappingURL=neuroManager.js.map