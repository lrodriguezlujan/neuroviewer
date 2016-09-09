// Get electron as module
if(require){
  System.set('electron', System.newModule(require('electron')));
}

/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    transpiler: 'typescript',
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: 'app',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      // Material
      '@angular2-material' : 'npm:@angular2-material',

      // other libraries
      'rxjs':                       'npm:rxjs',

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      '@angular2-material/core':{
        main: 'core.js',
        defaultExtension: 'js'
      },
      '@angular2-material/button':{
        main: 'button.js',
        defaultExtension: 'js'
      },
      '@angular2-material/card':{
        main: 'card.js',
        defaultExtension: 'js'
      },
      '@angular2-material/list':{
        main: 'list.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);
