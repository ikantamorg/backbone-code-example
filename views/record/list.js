define([
  'app',
  'views/record/single',
  'views/record/separator',
  'utils/multi-sortable'
  //'jquery.sortable'
], function (app, RecordSingleView, RecordSeparatorView, MultiSortable) {

  var RecordListView = Backbone.View.extend({
    className: 'list',
    events: {
      'sortupdate': 'sortUpdate'
    },
    initialize: function () {
      if (this.collection) {
        this.listenTo(this.collection, {
          'add': this.addView,
          'reset': this.render
        });
      }
      if (app.editForm !== undefined && app.editForm.detach !== undefined) {
        this.listenTo(app.editForm, {
          'detach': this.bindSortable
        });
      }
    },
    serialize: function () {
      return { data: {
        records: _.chain(this.collection.models)
      }};
    },
    addView: function (model, collection, options) {
      options = options || {};

      // re-render entire collection to insert element at specific position
      // because Backbone.LayoutManager adds element to the end
      if (options.at !== undefined) {
        this.collection.sort();
        return this.render();
      }

      // check if current model is a separator
      var view = (model.get('is_separator') === true)
        ? new RecordSeparatorView({ model: model })
        : new RecordSingleView({ model: model });

      // insert a nested View into this View
      this.insertView(view);

      // only trigger render if it not inserted inside `beforeRender`
      if (options.render !== false) {
        view.render();
        // when new view is rendered add it to sortables
        this.bindSortable();
      }
    },
    beforeRender: function () {
      this.collection.each(function (model) {
        this.addView(model, this.collection, { render: false });
      }, this);
    },
    afterRender: function () {
      this.bindSortable();
      this.sortUpdate({ silent: true });
    },
    bindSortable: function () {


      new MultiSortable(this.$el, {
        handle: '.drag-handle',
        items: '.record-sortable:not(.detached)'
      });

      /*this.$el.sortable('destroy');
      this.$el.sortable({
        handle: '.drag-handle',
        items: 'div:not(.detached)',
        forcePlaceholderSize: true
      });*/
    },
    sortUpdate: function (options) {
      options = options || {};

      var $children = this.$el.children('.record-sortable');

      this.getViews().each(function (view) {
        var index = $children.index(view.$el);
        var model = view.model;
        model.set('weight', index);
      });

      if (options.silent !== true) {
        this.collection.reorder();
      }
    }
  });

  return RecordListView;
});