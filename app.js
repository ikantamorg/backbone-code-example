define([
  'backbone.layoutmanager',
  'utils/route',
  'utils/translate'
], function(LayoutManager, Route, t) {

  var app = {
    // host like - http://expert-social-network.dev/
    base: window.location.protocol + '//' + window.location.host, 
    // base folder, if application is not in root, like - http://expert-social-network.dev/public/
    root: '/',
    // api uri, is appeneded to host like - http://expert-social-network.dev/api
    api: 'api'
  };

  app.route = new Route(app);

  LayoutManager.configure({
    // allow layout manager to augment Backbone.View.prototype.
    manage: true,
    // indicate where templates are stored.
    prefix: 'assets/',
    // this custom fetch method will load pre-compiled templates or fetch them
    // remotely with AJAX.
    fetchTemplate: function(path) {
      
      // put fetch into `async-mode`.
      var done = this.async();

      // if cached, use the compiled template.
      var JST = window.JST = window.JST || {};

      // remote prefix for correct reference
      path = path.replace(this.prefix, '');
      if (JST[path]) {
        return done(JST[path]);
      }

      console.warn('Template was not found in JST!', path, JST);

      // concatenate the file extension.
      // path = path + '.html';

      // seek out the template asynchronously.
      // $.get(app.root + path, function(contents) {
      //   // cache and return template
      //   var tmpl = _.template(contents);
      //   JST[path] = tmpl;
      //   done(tmpl);
      // }, 'text');
    },
    renderTemplate: function(template, context) {
      return $.trim(t.template(template(context)));
    }
  });

  return app;
});