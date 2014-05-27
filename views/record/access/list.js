define([
  'app',
  'collections/users',
  'collections/groups'
], function (app, UsersCollection, GroupsCollection) {

  var AccessListView = Backbone.View.extend({
    tagName: 'div',
    className: 'record',
    template: 'record/access/list',
    model: null,
    selectedUsers: null,
    selectedGroups: null,
    events: {
      'click .jsapp-record-access-all-users': 'allUsers',
      'click .jsapp-record-access-group': 'clickGroup',
      'click .jsapp-record-access-user': 'clickUser',
      'click .jsapp-record-access-save': 'setAccess'
    },
    getGroups: function () {
      return this.model.get('groups');
    },
    getUsers: function () {
      return this.model.get('users');
    },
    initialize: function (options) {
      options = options || {};
      if (options.model != undefined) {
        this.model = options.model;
        this.selectedUsers = new UsersCollection(this.model.get('users').where({is_selected: true}));
        this.selectedGroups = new GroupsCollection(this.model.get('groups').where({is_selected: true}));
        this.listenTo(this.model, {
          'sync': this.success,
          'error': this.error
        });
      }
    },
    serialize: function () {
      return {
        data: {
          users: this.model.get('users'),
          groups: this.model.get('groups')
        }
      };
    },
    afterRender: function () {
      var $all_users_checkbox = this.$('form.cf label.ccbx').first();
      $all_users_checkbox.addClass('jsapp-record-access-all-users');
      if (this.model.get('is_public')) {
        $all_users_checkbox.addClass('checked');
      }
    },
    allUsers: function (e) {
      e.preventDefault();
      this.model.set('is_public', !this.model.get('is_public'));
      if (this.model.get('is_public')) {
        this.$('label.ccbx').addClass('checked');
        this.selectedGroups.add(this.getGroups().models);
        this.selectedUsers.add(this.getUsers().models);
      } else {
        this.$('label.ccbx').removeClass('checked');
        this.selectedGroups.reset();
        this.selectedUsers.reset();
      }
    },
    clickGroup: function (e) {
      e.preventDefault();
      var $label = this.$(e.currentTarget);
      var id = Number($label.find('input:checkbox').attr('name'));
      var group = this.getGroups().findWhere({id: id});
      var checked = !this.selectedGroups.contains(group);
      if (checked) {
        this.selectedGroups.add(group);
        _.each(group.get('users'), function (user) {
          this.selectedUsers.add(user);
          this.$('input:checkbox[name="u' + user.id + '"]').parents('label.ccbx').addClass('checked');
        }, this);
        var $allUsersCheckbox = this.$('.jsapp-record-access-all-users');
        if (this.selectedUsers.length === this.getUsers().length) {
          $allUsersCheckbox.addClass('checked');
        }
      } else {
        this.selectedGroups.remove(group);
        _.each(group.get('users'), function (user) {
          var contains = false;
          for (var i = 0; i < this.selectedGroups.length; i++) {
            if (_.findWhere(this.selectedGroups.at(i).get('users'), {id: user.id})) {
              contains = true;
              break;
            }
          }
          if (!contains) {
            var user_to_uncheck = this.selectedUsers.findWhere({ id: user.id });
            this.selectedUsers.remove(user_to_uncheck);
            this.$('input:checkbox[name="u' + user.id + '"]').parents('label.ccbx').removeClass('checked');
          }
        }, this);
        var $allUsersCheckbox = this.$('.jsapp-record-access-all-users');
        if (this.selectedUsers.length !== this.getUsers().length) {
          $allUsersCheckbox.removeClass('checked');
        }
      }
    },
    clickUser: function (e) {
      e.preventDefault();
      var $label = $(e.currentTarget);
      var user = this.getUsers().findWhere({id: Number($label.find('input').attr('name').substr(1))});
      var $allUsersCheckbox = this.$('.jsapp-record-access-all-users');
      var checked = !this.selectedUsers.contains(user);
      if (checked) {
        this.selectedUsers.add(user);
        if (this.selectedUsers.length === this.getUsers().length) {
          $allUsersCheckbox.addClass('checked');
        }
      } else {
        this.selectedUsers.remove(user);
        var groups = this.selectedGroups.filter(function (group) {
          return _.findWhere(group.get('users'), {id: user.id});
        }, this);
        _.each(groups, function (group) {
          this.selectedGroups.remove(group);
          this.$('input[name="' + group.get('id') + '"]').parents('label.ccbx').removeClass('checked');
        }, this);
        if ($allUsersCheckbox.hasClass('checked')) {
          $allUsersCheckbox.removeClass('checked');
        }
      }
    },
    setAccess: function(e) {
      e.preventDefault();
      this.model.set({
        groups: this.selectedGroups.pluck('id'),
        users: this.selectedUsers.pluck('id')
      });
      this.model.save();
    },
    success: function(model, resp) {
      this.showMessage('success', 'Настройки сохранены.');
    },
    error: function(model, xhr) {
      this.showMessage('error', xhr.responseJSON.errors);
    },
    showMessage: function(type, msg) {
      var $message = this.$('.jsapp-record-access-message');
      if (type === 'success') {
        $message.addClass('alert-notice-globol').removeClass('alert-error-globol');
        $message.find('p').html(msg);
      } else {
        $message.addClass('alert-error-globol').removeClass('alert-notice-globol');
        $message.find('p').html(msg);
      }
      $message.show();
    }

  });

  return AccessListView;
});
