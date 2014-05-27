define([
  'app',
  'models/user'
], function(app, UserModel) {

  var UsersCollection = Backbone.Collection.extend({
    model: UserModel,
    urlRoot: 'users',
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data
      }
      return response;
    },
    url: function() {
      return app.route.uri(this.urlRoot, this.id);
    }
  });

  return UsersCollection;
});