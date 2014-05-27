define([
  'app',
  'views/record/entry/single'
], function(app, RecordSimpleView) {

  var EntryListView = Backbone.View.extend({
    tagName: 'div',
    initialize: function() {
      if (this.collection) {
        this.listenTo(this.collection, {
          'add': this.addView
        });
      }
    },
    serialize: function() {
      return {
        data:{
          records: _.chain(this.collection.models)
        }
      };
    },
    addView: function(model, render) {
      var view = this.insertView(new RecordSimpleView({ model: model }));
      if (render !== false) {
        view.render();
      }
    },
    beforeRender: function() {
      this.collection.each(function(model) {
        this.addView(model, false);
      }, this);
    }
  });

  return EntryListView;
});