define([
  'underscore'
], function(_) {

  var keyboard = {};

  // keep everything uppercase
  keyboard.codes = {
    // non-alphabet codes
    ENTER: 13,
    // alphabet codes
    C: 67,
    D: 68,
    E: 69,
    S: 83,
    V: 86,
    W: 87,
  };

  keyboard.isCtrlDown = function(ev) {
    // metaKey for mac
    return (ev.ctrlKey === true || ev.metaKey === true);
  };

  keyboard.isShiftDown = function(ev) {
    return (ev.shiftKey === true);
  };

  keyboard.isCtrlOnlyDown = function(ev) {
    return (this.isCtrlDown(ev) && !this.isShiftDown(ev));
  };

  keyboard.isShiftOnlyDown = function(ev) {
    return (this.isShiftDown(ev) && !this.isCtrlDown(ev));
  };

  keyboard.isCtrlAndShiftDown = function(ev) {
    return (this.isCtrlDown(ev) && this.isShiftDown(ev));
  };

  keyboard.isSymbolDown = function(ev, symbol) {
    return (ev.keyCode === this.codes[symbol.toUpperCase()]);
  };

  // actions

  // Ctrl + V
  keyboard.isPaste = function(ev) {
    return this.isCtrlOnlyDown(ev) && this.isSymbolDown(ev, 'V');
  };

  keyboard.isCopy = function(ev) {
    return this.isCtrlOnlyDown(ev) && this.isSymbolDown(ev, 'C');
  };

  keyboard.isEdit = function(ev) {
    return this.isCtrlOnlyDown(ev) && this.isSymbolDown(ev, 'E');
  };

  keyboard.isSeparator = function(ev) {
    return this.isCtrlOnlyDown(ev) && this.isSymbolDown(ev, 'S');
  };

  keyboard.isDelete = function(ev) {
    return this.isCtrlOnlyDown(ev) && this.isSymbolDown(ev, 'D');
  }

  // loop through all possible actions
  // and return name of the action if it was found
  // otherwise return false
  keyboard.detectAction = function(ev) {
    var actions = ['paste', 'copy', 'edit', 'separator', 'delete'];

    for (var key in actions) {
      var action = actions[key];
      // method name
      var method = 'is' + action.charAt(0).toUpperCase() + action.slice(1);
      // if method call returns true, then current action is considered to active
      if (this[method](ev) === true) {
        return action;
      }
    }

    return false;
  };

  return keyboard;
});