define([
  'app'
], function(app) {

  var RecordMenuView = Backbone.View.extend({
    template: 'record/menu',
    serialize: function() {
      return { 
        data: {
          record: this.model
        },
        r: app.route
      };
    }
  });

  return RecordMenuView;
});