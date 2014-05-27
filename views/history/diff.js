define([
  'app'
], function(app) {

  // unlike separator record can be edited
  var HistoryDiffView = Backbone.View.extend({
    template: 'history/diff',
    events: {},
    serialize: function() {
      return {
        data: {
          item: this.model
        },
        r: app.route
      };
    }
  });

  return HistoryDiffView;
});