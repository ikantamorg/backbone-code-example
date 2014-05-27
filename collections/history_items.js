define([
  'app',
  'models/history_item'
], function(app, HistoryItemModel) {

  var HistoryItemsCollection = Backbone.Collection.extend({
    model: HistoryItemModel,
    urlRoot: 'records/:id/history',
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
    },
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }

      return response;
    },
    comparator: function(model) {
      return -model.get('id');
    }
  });

  return HistoryItemsCollection;
});
