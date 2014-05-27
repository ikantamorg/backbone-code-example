define([
  'app',
  'backbone.trackit',
  'views/layout/error'
], function(app, ErrorLayout) {

  var Core = {};

  Core.Layout = Backbone.Layout.extend({
    events: {
      'click a[href]:not([data-bypass])': 'hijackLinks'
    },
    initialize: function() {
      // listen to links, that should open homepage
      // use js app router deal with them
      // app.root ? 
      $('a.jsapp-handle-link').on('click', this.hijackLinks);

      this.afterInitiliaze(); // deprecated
      this.initializeHook();
    },
    afterInitiliaze: function() {}, // deprecated
    initializeHook: function() {},
    hijackLinks: function(ev) {

      // Get clicked anchor element
      var $a = $(ev.currentTarget);

      // Get the absolute anchor href.
      var href = {
        prop: $a.prop('href'),
        attr: $a.attr('href')
      };

      // Get the absolute root.
      var root = window.location.protocol + '//' + window.location.host + app.root;

      // Ensure the root is part of the anchor href, meaning it's relative.
      if (href.prop.slice(0, root.length) === root) {
        // Stop the default event to ensure the link will not cause a page
        // refresh.
        ev.preventDefault();

        // `Backbone.history.navigate` is sufficient for all Routers and will
        // trigger the correct events. The Router's internal `navigate` method
        // calls this anyways.  The fragment is sliced from the root.
        Backbone.history.navigate(href.attr, true);
      }
    },
    fail: function(xhr, type, message) {
      var errorLayout = new ErrorLayout({status: xhr.status, response: xhr.responseJSON});
      errorLayout.showError();
    }
  });

  Core.Model = Backbone.Model.extend({
    initialize: function() {

      //StarTrack unsaved data (backbone.trackit)
      this.startTracking();

      this.afterInitiliaze(); // deprecated
      this.initializeHook();
    },
    afterInitiliaze: function() {},
    initializeHook: function() {},
    // get original(data which persisted on the backend) data
    getOriginal:  function(attr) {
      return this._originalAttrs[attr];
    },
    // Get unsaved attributes without unnecessary (override _removeUnnecessary in your model)
    unsavedAttributesMod: function(){
      return this._removeUnnecessary(this.unsavedAttributes());
    },
    // Check if model has unsaved attributes
    hasUnsavedAttributes: function(){
      var unsavedAttributes = this.unsavedAttributesMod();

      if (_.isBoolean(unsavedAttributes)) {
        return unsavedAttributes;
      }

      return !!_.size(unsavedAttributes);
    },
    // override this function if you need it
    _removeUnnecessary: function(data){
      return data;
    }
  });

  Core.View = Backbone.View.extend({
    serialize: function() {
      var data = {};
      if (! _.isUndefined(this.model)) {
        data.model = this.model;
      }
      if (! _.isUndefined(this.collection)) {
        data.collection = _.chain(this.collection.models);
      }
      if (! _.isUndefined(this.toSerialize)) {
        _.extend(data, this.toSerialize(data));
      }
      return {
        data: data,
        r: app.route
      }
    }
  });

  return Core;
});