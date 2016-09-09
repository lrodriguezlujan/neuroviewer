// main/index.js
import {app, BrowserWindow, Menu, MenuItem} from "electron";
import {dialog} from "electron";
import {NeuroManager} from "./neuroManager";


let mainWindow : Electron.BrowserWindow = null;
let manager : NeuroManager = null;

const menu = new Menu();
menu.append( new MenuItem({
  label: 'File',
  submenu: [
    {
      label: 'Import file(s)',
      click: function(){
        let files = dialog.showOpenDialog({
          title: "Import reconstruction file",
          buttonLabel: 'Import',
          filters: [
            { name: 'JSON file' , extensions: ['json']},
            { name: 'SWC file' , extensions: ['swc']}

          ],
          properties: ['openFile', 'multiSelections']
        })
        console.log("about to load files");
        console.log(files);
        manager.addFromLocalFiles(files);
        console.log("loaded");
      }
    },
    {
      label: 'Import folder(s)',
      click: function(){
        let dirs = dialog.showOpenDialog({
          title: "Import folder",
          buttonLabel: 'Import',
          properties: ['openDirectory', 'multiSelections']
        })
        manager.addFromLocalDirs(dirs);
      }
    },
    {
      label: 'Exit',
      click: function(){ console.log('item exit clicked') }
    }
  ],
}));

menu.append( new MenuItem({
  label: 'Help',
  submenu: [
    {
      label: 'FAQ',
      click: function(){ console.log('item FAQ clicked') }
    },
    {
      label: 'About',
      click: function(){ console.log('item about clicked') }
    }
  ],
}));

Menu.setApplicationMenu(menu)

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({title: 'neuroViewer'});
  mainWindow.maximize();

  manager = new NeuroManager(mainWindow.webContents);
  manager.bindGetRequest();

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
