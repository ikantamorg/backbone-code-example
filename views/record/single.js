define([
  'app',
  'utils/storage',
  'views/record/separator'
], function(app, storage, RecordSeparatorView) {

  // unlike separator record can be edited
  var RecordSingleView = RecordSeparatorView.extend({
    template: 'record/single',
    events: _.extend({
      'click .record-menu [data-action="edit"]': 'edit'
    }, RecordSeparatorView.prototype.events),
    initialize: function(options) {
      // when detached record should be re-rendered
      if(this.model !== undefined) {
        this.listenTo(this.model, {
          'edit': this.enterEditMode,
          'detached': this.render
        });
      }
      this.listenTo(storage.records.selected, {
        'reset': this.clearSelection
      });
      this.initializeHook(options);
    },
    edit: function() {
      this.model.edit(true);
    },
    enterEditMode: function() {
      app.editForm.tryToAttach(this);
    }
  });

  return RecordSingleView;
});