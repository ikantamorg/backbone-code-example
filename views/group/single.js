define([
  'app',
  'views/group/form',
  'models/group'
], function (app, GroupFormView, GroupModel) {

  var GroupSingleView = Backbone.View.extend({
    template: 'group/single',
    className: 'access-group',
    events: {
      'click .jsapp-group-users-more': 'more',
      'click .jsapp-group-edit': 'editGroup',
      'click .jsapp-group-remove': 'removeGroup',
      'click .jsapp-group-restore': 'restoreGroup'
    },

    // initializers

    initialize: function (options) {
      if (! _.isUndefined(this.model)) {
        this.listenTo(this.model, {
          'sync': this.onDone,
          'error': this.onError,
          'remove': this.onRemove,
          'restore': this.onRestore
        });
      }
    },
    serialize: function () {
      return { data: {
        group: this.model
      }};
    },
    parse: function(response) {
      console.log('parsed');
      if (response.data !== undefined) {
        response = response.data;
      }
      return response;
    },

    // actions

    more: function (ev) {
      ev.preventDefault();
      var users = _.pluck(this.model.get('users'), 'username').join(', ');
      this.$el.find('p').html(users)
    },
    editGroup: function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      this.model.edit(this);
    },
    removeGroup: function (ev) {
      ev.preventDefault();
      this.model.remove();
    },
    restoreGroup: function (ev) {
      ev.preventDefault();
      this.model.restore();
    },

    // handlers

    onRemove: function(model, collection, options) {
      this.render();
    },
    onRestore: function(model, collection, options) {
      var at = this.$el.index();
      collection.add(model, { at: at, silent: true });  
      this.render();
    },
    onError: function () {
    }
  });

  return GroupSingleView;
});
