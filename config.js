require.config({
  paths: {
    // !!!
    // don't forget to add new paths to build/config.js
    // !!!
    'jquery': 'utils/require-adapter-jquery',
    'jquery.fileupload': '../jquery.fileupload',
    'jquery.fileupload-process': '../jquery.fileupload-process',
    'jquery.fileupload-validate': '../jquery.fileupload-validate',
    'jquery.ui.core': '../jquery.ui.core',
    'jquery.ui.widget': '../jquery.ui.widget',
    'jquery.ui.mouse': '../jquery.ui.mouse',
    'jquery.ui.sortable': '../jquery.ui.sortable',
    'jquery.iframe-transport': '../jquery.iframe-transport',
    //'jquery.sortable': '../jquery.sortable',
    'autoresize.jquery': '../autoresize.jquery',
    'underscore': '../underscore-1.6.0',
    'backbone': '../backbone-1.1.2',
    'backbone.layoutmanager': '../backbone.layoutmanager-0.9.5',
    'backbone.trackit': '../backbone.trackit',
    // custom template scripts
    'comma_separated': '../comma_separated',
    'cf': '../cf.min',
    'select2': '../select2',
    'select2-adapter': 'utils/select2-adapter',
    'parsley': '../parsley.min',
    'parsley.i18n.ru': '../parsley.i18n.ru',
    'parsley-adapter': 'utils/parsley-adapter',
    'simple-storage': '../simpleStorage-0.1.2',
    'underi18n': '../underi18n',
    'text': '../text',
    'moment': '../moment-with-langs',
    'diff_match_patch': '../diff_match_patch_uncompressed',
    'underscore.string': '../underscore.string'
  },
  shim: {
    'underscore': {
      exports: '_',
      deps: ['jquery']
    },
    'backbone': {
      exports: 'Backbone',
      deps: ['underscore']
    },
    'backbone.trackit': ['backbone'],
    'parsley.i18n.ru': ['parsley'],
    'parsley-adapter': ['parsley', 'parsley.i18n.ru']
  }
});

// Start application
require(['main']);