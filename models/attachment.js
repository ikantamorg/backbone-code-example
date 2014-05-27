define([
  'app',
  'utils/route'
], function(app, Route) {

  var route = new Route(app);
  var AttachmentModel = Backbone.Model.extend({
    urlRoot: '/attachments',
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }
      return response;
    },
    getSizeKb: function() {
      return Math.floor((this.get('size') || 0) / 1024);
    },
    getSizeStr: function() {
      return this.getSizeKb() + 'кб';
    }
  });

  return AttachmentModel;
});