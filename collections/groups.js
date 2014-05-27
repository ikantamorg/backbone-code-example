define([
  'app',
  'models/group'
], function(app, GroupModel) {

  var GroupsCollection = Backbone.Collection.extend({
    model: GroupModel,
    urlRoot: 'groups',
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }
      return response;
    },
    comparator: function(model) {
      return -model.get('id');
    },
    url: function() {
      return app.route.uri(this.urlRoot);
    },
    hasEdited: function() {
      return (!! this.find(function(model) {
        return model.isEdited();
      }));
    }
  });

  return GroupsCollection;
});
