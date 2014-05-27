define([
  'app',
  'utils/translate',
  'models/group',
  'select2-adapter',
  'parsley-adapter'
], function (app, t, GroupModel) {

  var GroupFormView = Backbone.View.extend({
    template: 'group/form',
    className: 'access-group',
    events: {
      'click .jsapp-group-add': 'save',
      'click .jsapp-group-remove-form': 'delete',
      'click': 'prevent'
    },
    initialize: function (options) {
      if (! _.isUndefined(this.model)) {
        this.listenTo(this.model, {
          'sync': this.done,
          'error': this.error
        });
      }
    },
    serialize: function () {
      return {
        data: { group: this.model }
      };
    },
    save: function(ev) {
      if (ev) ev.preventDefault();
      if (! this.isValid()) {
        return false;
      }
      this.sendMe();
    },
    delete: function (ev) {
      ev.preventDefault();
      if (this.model.isNew()) {
        this.model.trigger('destroy', this.model);
        this.remove();
      } else {
        this.model.single(this);
      }
    },
    prevent: function (e) {
      e.stopPropagation();
    },
    sendMe: function () {
      if (this.model !== null) {
        this.model.set({
          name: this.$('.jsapp-group-name').val(),
          users: this.$('.jsapp-group-users').select2("val")
        });
        this.model.save();
      }
    },
    isValid: function () {
      return this.$('.new_group').parsley().validate();
    },
    done: function (model, response, options) {
      this.model.set(response.data);
      this.model.single(this);
    },
    error: function () {
      this.remove();
    },
    afterRender: function () {
      this.$('.jsapp-group-users').select2({
        multiple: true,
        placeholder: t.it('group.form.user_placeholder'),
        ajax: {
          url: '/api/groups/users',
          dataType: 'json',
          data: function (term) {
            return { q: term };
          },
          results: function (response) {
            return { results: response.data };
          }
        },
        formatSelection: function (item) {
          return item.username;
        },
        formatResult: function (item) {
          return item.username;
        }
      }).select2('data', this.model.get('users'));
      this.$('.new_group').parsley({
        namespace: 'data-',
        errorClass: 'error',
        errorsWrapper: '<span></span>',
        errorTemplate: '<p class="alert_error"></p>'
      });
    }
  });

  return GroupFormView;
});
