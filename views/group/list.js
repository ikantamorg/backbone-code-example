define([
  'app',
  'views/group/form',
  'views/group/single',
  'collections/groups'
], function (app, GroupFormView, GroupSingleView, GroupsCollection) {

  var GroupListView = Backbone.View.extend({
    initialize: function () {
      if (this.collection) {
        this.listenTo(this.collection, {
          'add': this.addView,
          'edit': this.editView,
          'single': this.singleView
        });
      }
    },
    serialize: function () {
      return {
        data: {
          groups: _.chain(this.collection.models)
        }
      };
    },
    addView: function (model, collection, options) {
      options = options || {};

      var view = (model.isEdited())
        ? new GroupFormView({ model: model })
        : new GroupSingleView({ model: model });

      this.insertView(view);

      if (options.at !== undefined) {
        if (options.at === 0) {
          this.$el.prepend(view.render().$el);
          return true;
        } else {
          console.warn('if branch not handled');
        }
      }

      if (options.render !== false) {
        view.render();
      }
    },
    // actualy insert using simple html
    // because layout manager does not insert at position
    // not to rerender entire collection
    editView: function(model, collection, view) {
      var formView = new GroupFormView({ model: model });
      var index = collection.indexOf(model);
      this.$el.children().eq(index).replaceWith(formView.render().$el);
      view.remove();
    },
    singleView: function(model, collection, view) {
      var singleView = new GroupSingleView({ model: model });
      var index = collection.indexOf(model);
      this.$el.children().eq(index).replaceWith(singleView.render().$el);
      view.remove();
    },
    // call save on view that are being edited at the moment
    saveEditedView: function() {
      this.getViews().each(function(view) {
        if (view.model.isEdited()) {
          view.save();
        }
      });
    },
    beforeRender: function () {
      this.collection.each(function (model) {
        this.addView(model, this.collection, { render: false });
      }, this);
    }
  });

  return GroupListView;
});
