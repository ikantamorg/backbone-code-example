define([
  'underscore'
], function(_) {

  var State = function() {
    return this;
  };

  State.prototype = {
    objects: {},
    add: function(key, actions, context) {
      if (context) {
        _.each(actions, function(action, key) {
          actions[key] = _.bind(action, context);
        });
      }
      this.objects[key] = actions;
    },  
    one: function(key, action) {
      this.objects[key][action]();
    },
    all: function(action) {
      _.invoke(this.objects, action);
    }
  };

  return State;
});