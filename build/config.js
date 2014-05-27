({
  // parent directory holds the app
  baseUrl: '../',
  // name of the main file
  name: 'config',
  // resulting file
  out: 'app.built.js',
  // parameters from this file will be merged with parameters from config.js
  mainConfigFile: '../config.js',
  // include dependencies for all files/modules
  findNestedDependencies: true,
  // for mapping minified, bundled code to unminified, separate modules

  // generateSourceMaps: true,
  // optimize: 'uglify2',
  // preserveLicenseComments: false,
  // useSourceUrl: true,
  
  // use real paths for r.js compilation
  include: ['../../../../vendor/assets/javascripts/require-2.1.11.js'],
  paths: {
    'jquery.fileupload': '../../../../vendor/assets/javascripts/jquery.fileupload',
    'jquery.fileupload-process': '../../../../vendor/assets/javascripts/jquery.fileupload-process',
    'jquery.fileupload-validate': '../../../../vendor/assets/javascripts/jquery.fileupload-validate',
    'jquery.ui.widget': '../../../../vendor/assets/javascripts/jquery.ui.widget',
    'jquery.iframe-transport': '../../../../vendor/assets/javascripts/jquery.iframe-transport',
    'jquery.sortable': '../../../../vendor/assets/javascripts/jquery.sortable',
    'autoresize.jquery': '../../../../vendor/assets/javascripts/autoresize.jquery',
    'underscore': '../../../../vendor/assets/javascripts/underscore-1.6.0',
    'backbone': '../../../../vendor/assets/javascripts/backbone-1.1.2',
    'backbone.layoutmanager': '../../../../vendor/assets/javascripts/backbone.layoutmanager-0.9.5',
    'backbone.trackit': '../../../../vendor/assets/javascripts/backbone.trackit',
    // custom template scripts
    'comma_separated': '../../../../vendor/assets/javascripts/comma_separated',
    'cf': '../../../../vendor/assets/javascripts/cf.min',
    'select2': '../../../../vendor/assets/javascripts/select2',
    'parsley': '../../../../vendor/assets/javascripts/parsley.min',
    'parsley.i18n.ru': '../../../../vendor/assets/javascripts/parsley.i18n.ru',
    'simple-storage': '../../../../vendor/assets/javascripts/simpleStorage-0.1.2',
    'underi18n': '../../../../vendor/assets/javascripts/underi18n',
    'text': '../../../../vendor/assets/javascripts/text',
    'moment': '../../../../vendor/assets/javascripts/moment-with-langs',
    'diff_match_patch': '../../../../vendor/assets/javascripts/diff_match_patch_uncompressed',
    'underscore.string': '../../../../vendor/assets/javascripts/underscore.string'
  }
})
