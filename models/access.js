define([
  'app',
  'collections/users',
  'collections/groups'
], function (app, UsersCollection, GroupsCollection) {

  var AccessModel = Backbone.Model.extend({
    urlRoot: '/records/:id/access',
    parse: function (response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }
      this.set('groups', new GroupsCollection(response.groups));
      this.set('users', new UsersCollection(response.users));
      return _.omit(response, 'users', 'groups');
    },
    initialize: function (options) {
      options = options || {};
      if (options.rid === undefined ) {
        // console.warn('id not found when initializing collection');
        options.rid = null; // make request to non existing record
      }
      if (options.users !== undefined && options.groups !== undefined){
        this.set('groups', new GroupsCollection(options.groups));
        this.set('users', new UsersCollection(options.users));
      }
      this.rid = options.rid;
    },
    url: function () {
      return app.route.uri(this.urlRoot, this.rid);
    }
  });

  return AccessModel;
});
