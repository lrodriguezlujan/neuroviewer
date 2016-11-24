System.set('babylonjs', System.newModule(BABYLON));


System.config({
  transpiler: 'typescript',
  defaultJSExtensions: true,
  paths: {
    'nv:' : 'scripts/neuroviewer/'
  },
  map: {
    '@neuroviewer/core': "nv:core/",
    '@neuroviewer/reader': "nv:reader/",
    '@neuroviewer/babylon-drawer': "nv:babylon-drawer/",
    '@neuroviewer/control': "nv:control/"
  },
  packages: {
   '@neuroviewer/core': {
      "defaultExtension": "js",
      "main": "index.js"
    },
    '@neuroviewer/reader': {
      "defaultExtension": "js",
      "main": "index.js"
    },
    '@neuroviewer/babylon-drawer': {
      "defaultExtension": "js",
      "main": "index.js"
    },
    '@neuroviewer/control': {
      "defaultExtension": "js",
      "main": "index.js"
    }
  }
});
