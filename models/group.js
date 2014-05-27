define([
  'app'
], function (app) {

  var GroupModel = Backbone.Model.extend({
    urlRoot: '/groups',
    defaults: {
      edit: false
    },
    isEdited: function() {
      return (this.get('edit') === true);
    },
    parse: function (response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }
      return response;
    },

    single: function(view) {
      this.set('edit', false);
      this.collection.trigger('single', this, this.collection, view);
    },

    edit: function(view) {
      if (this.collection.hasEdited()) {
        return false;
      }

      this.set('edit', true);
      this.collection.trigger('edit', this, this.collection, view);
    },

    // better use remove instead of original destroy
    remove: function(options) {
      // save collection, because after destroy it will be removed from model
      var collection = this.collection;

      var destroy = this.destroy(_.extend({ silent: true }, options || {}));

      destroy.done(_.bind(function(response) {
        // update model to set 'is_deleted' prop
        this.set(response.data);
        // set collection to use in recover
        this.collection = collection;
        this.trigger('remove', this, collection, {});
      }, this));

      return destroy;
    },
    restore: function(options) {
      var sync = this.sync('get', this, _.extend({
        url: app.route.to(this.url() + '/restore'),
      }, options || {}));


      // use collection, set in 'remove'
      var collection = this.collection;

      sync.done(_.bind(function(response) {

        this.set(response.data);
        this.trigger('restore', this, collection, {});

      }, this));

      return sync;
    }
  });

  return GroupModel;
});
