define([
  'views/record/parent'
], function(RecordParentView) {

  // actually it extends separator and signgle model
  var HistoryRecordView = RecordParentView.extend({
    events: {},
    afterAfterRender: function() {},
    shortcut: function(ev) {}
  });

  return HistoryRecordView;
});