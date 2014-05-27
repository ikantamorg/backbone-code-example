define([
  'app',
  'utils/keyboard',
  'utils/storage',
  'views/record/single',
  'views/record/separator'
], function(app, keyboard, storage, RecordSingleView, RecordSeparatorView) {

  // actually it extends separator and signgle model
  var RecordParentView = RecordSingleView.extend({
    template: 'record/parent',
    events: _.extend(
      {
        'dblclick h1': 'enterEditMode'
      },
      // extend with events from both ancestors
      RecordSingleView.prototype.events,
      RecordSeparatorView.prototype.events
    ),
    // if menu should be active
    // now it should be active only on "/records" page
    // and not visible on "/history", "/access", "/entries"
    menu: false,
    initializeHook: function(options) {
      options = options || {};
      this.menu = this.menu || options.menu;
    },
    // attach keyboard listener to parent view
    // because it is rendered on every record page
    // don't attach to layout because it just manages views
    afterRenderHook: function() {
      if (this.menu === true) {
        $(document)
          .off('keydown.record.parent')
          .on('keydown.record.parent', _.bind(this.shortcut, this));
      }
    },
    shortcut: function(ev) {
      if (this.menu === false) {
        return false;
      }
      var action = keyboard.detectAction(ev);
      switch(action) {
        case 'copy':
          this.model.copy();
          break;
        case 'paste':
          this.model.paste();
          break;
        case 'separator':
          this.model.separator();
          break;
        case 'delete':
          this.model.detach();
          break;
        case 'edit':
          this.model.edit();
          break;
        // leave method if action not found
        case false:
        default:
          return true;
      }
      // stop propagation if action detected
      ev.preventDefault();
      ev.stopPropagation();
    },
    serialize: function() {
      return { data: {
        record: this.model,
        menu: this.menu
      }};
    }
  });

  return RecordParentView;
});