define([
  'app',
  'router',
  'views/record/edit-form'
], function(app, Router, RecordEditFormView) {


  Backbone.sync = _.wrap(Backbone.sync, function(originalSync, method, model, options) {
    options || (options = {});

    if (_.isUndefined(options.url)) {
      var url = _.isString(model.url) ? model.url : model.url();
      options.url = app.route.to(url);
    }

    return originalSync.call(model, method, model, options);
  });
  
  var router = new Router();
  app.router = router;
  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({ pushState: true, root: app.root });

  // RecordEditFormView should be created after LayoutManager!! Its important!!!!!
  app.editForm = new RecordEditFormView();

});