define([
  'app',
  'models/group',
  'views/group/form'
], function (app, GroupModel, GroupFormView) {

  var GroupHeaderView = Backbone.View.extend({
    template: 'group/header',
    className: 'access-group',
    // stores groups collections
    // set in group layout
    collection: null,
    events: {
      'click .jsapp-group-form-add': 'add'
    },
    add: function (ev) {
      ev.preventDefault();
      ev.stopPropagation();

      if (! this.collection.hasEdited()) {
        var group = new GroupModel({ edit: true });
        this.collection.add(group, { at: 0 });
      }
    }
  });

  return GroupHeaderView;
});
