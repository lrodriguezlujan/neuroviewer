"use strict";
// main/index.js
var electron_1 = require("electron");
var electron_2 = require("electron");
var neuroManager_1 = require("./neuroManager");
var mainWindow = null;
var manager = null;
var menu = new electron_1.Menu();
menu.append(new electron_1.MenuItem({
    label: 'File',
    submenu: [
        {
            label: 'Import file(s)',
            click: function () {
                var files = electron_2.dialog.showOpenDialog({
                    title: "Import reconstruction file",
                    buttonLabel: 'Import',
                    filters: [
                        { name: 'JSON file', extensions: ['json'] },
                        { name: 'SWC file', extensions: ['swc'] }
                    ],
                    properties: ['openFile', 'multiSelections']
                });
                console.log("about to load files");
                console.log(files);
                manager.addFromLocalFiles(files);
                console.log("loaded");
            }
        },
        {
            label: 'Import folder(s)',
            click: function () {
                var dirs = electron_2.dialog.showOpenDialog({
                    title: "Import folder",
                    buttonLabel: 'Import',
                    properties: ['openDirectory', 'multiSelections']
                });
                manager.addFromLocalDirs(dirs);
            }
        },
        {
            label: 'Exit',
            click: function () { console.log('item exit clicked'); }
        }
    ],
}));
menu.append(new electron_1.MenuItem({
    label: 'Help',
    submenu: [
        {
            label: 'FAQ',
            click: function () { console.log('item FAQ clicked'); }
        },
        {
            label: 'About',
            click: function () { console.log('item about clicked'); }
        }
    ],
}));
electron_1.Menu.setApplicationMenu(menu);
electron_1.app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('ready', function () {
    mainWindow = new electron_1.BrowserWindow({ title: 'neuroViewer' });
    mainWindow.maximize();
    manager = new neuroManager_1.NeuroManager(mainWindow.webContents);
    manager.bindGetRequest();
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
//# sourceMappingURL=index.js.map