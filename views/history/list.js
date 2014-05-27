define([
  'app',
  'views/history/item'
], function(app, HistoryItemView) {

  var RecordListView = Backbone.View.extend({
    tagName:'ul',
    className: 'history-records',
    serialize: function() {
      return { data: {
        items: _.chain(this.collection.models)
      }};
    },
    addView: function(model, collection, options) {
      options = options || {};

      // re-render entire collection to insert element at specific position
      // because Backbone.LayoutManager adds element to the end
      if (options.at !== undefined) {
        this.collection.sort();
        return this.render();
      }

      // check if current model is a separator
      var view = new HistoryItemView({ model: model })

      // insert a nested View into this View
      this.insertView(view);
      
      // only trigger render if it not inserted inside `beforeRender`
      if (options.render !== false) {
        view.render();
      }
    },
    beforeRender: function() {
      this.collection.each(function(model) {
        this.addView(model, this.collection, { render: false });
      }, this);
    }
  });

  return RecordListView;
});