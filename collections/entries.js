define([
  'app',
  'models/record'
], function(app, RecordModel) {

  var EntriesCollection = Backbone.Collection.extend({
    model: RecordModel,
    urlRoot: 'records/:id/entries',
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data
      }
      return response;
    },
    initialize: function(models, options) {
      options = options || {};
      if (options.id === undefined) {
        // console.warn('id not found when initializing collection');
        options.id = null; // make request to non existing record
      }
      this.id = options.id;
    },
    url: function() {
      return app.route.uri(this.urlRoot, this.id);
    }
  });

  return EntriesCollection;
});