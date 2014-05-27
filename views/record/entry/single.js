define([
  'app'
], function(app) {

  var RecordSimpleView = Backbone.View.extend({
    template: 'record/entry/single',
    serialize: function() {
      return {
        data: {
          record: this.model
        },
        r: app.route
      };
    }
  });

  return RecordSimpleView;
});