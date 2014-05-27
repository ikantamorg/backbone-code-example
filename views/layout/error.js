define([
  'app',
  'core',
  'utils/translate'
], function(app, Core, t) {

  var ErrorLayout = Backbone.Layout.extend({
    el: '.jsapp-layout-record',
    template: 'layout/error',
    showError: function() {
      this.render();
    },
    initialize: function(attributes) {
      if (attributes === undefined) {
        this.status = '';
        this.response = {
          errors: t.it('defaultError')
        }
      } else {
        if (attributes.status === 404) {
          this.response = {
            errors: t.it('error404')
          }
        }
      }
    },
    serialize: function() {
      return {
        data: {
          status: this.status,
          message: this.response.errors
        }
      };
    }
  });

  return ErrorLayout;
});