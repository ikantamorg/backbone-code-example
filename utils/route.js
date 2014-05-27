define([
  'jquery',
  'underscore'
],
function($, _) {

  var Route = function(options) {
    this.options = _.extend({}, this.options, options);
    _.each(this.options, function(option, value) {
      this.options[option] = this.trim(value);
    }, this);
  };

  Route.prototype = {
    options: {
      base: window.location.protocol + '//' + window.location.host,
      api: 'api'
    },
    trim: function(str) {
      return str.replace(/^\/+|\/+$/g,'');
    },
    uri: function(uri, bindings) {
      uri = (_.isUndefined(uri)) ? '': this.trim(uri);
      var parts = uri.split('/');
      if (parts.length > 0) {
        _.each(parts, function(part, index) {
          if (part[0] === ':') {
            part = part.substr(1);
            if (_.isObject(bindings) && ! _.isUndefined(bindings[part])) {
              uri = uri.replace(':' + part, bindings[part]);
            } else if (! _.isObject(bindings) && ! _.isUndefined(bindings)) {
              uri = uri.replace(':' + part, bindings);
            }
          }
        });
      }
      return '/' + uri;
    },
    base: function() {
      return this.options.base;
    },
    api: function() {
      return this.base() + '/' + this.options.api;
    },
    to: function(uri, bindings) {
      var api = this.api();
      if (_.isUndefined(uri)) {
        return api;
      }
      return api + this.uri(uri, bindings);
    }
  };

  return Route;
});