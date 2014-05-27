define([
  'app',
  'utils/log',
  'views/layout/record',
  'views/layout/group',
  'views/layout/history'
], function(app, log, RecordLayout, GroupLayout, HistoryLayout) {

  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'home': 'home',
      'groups': 'groups',
      'records/:id': 'records',
      'records/:id/records': 'records',
      'records/:id/history': 'history',
      'records/:id/history/diff/:revision': 'diff',
      'records/:id/history/diff/:revision/child/:child_id': 'diffChild',
      'records/:id/entries': 'entries',
      'records/:id/access': 'access',
      'search?q=:query': 'search'
    },

    layouts: {
      record: new RecordLayout(),
      group: new GroupLayout(),
      history: new HistoryLayout()
    },

    // initializers

    initialize: function() {
      this.listenTo(this, {
        'route': this.routed
      });
    },
    routed: function(route, params) {
      // log every route change to console
      log.info('- router:', route, params);
    },

    // actions

    home: function() {
      this.layouts.record.showHome();
    },
    groups: function () {
      this.layouts.group.showGroups();
    },
    records: function(id) {
      this.layouts.record.showRecords(id);
    },
    history: function(id) {
      this.layouts.history.showHistoryOfRecord(id);
    },
    diff: function(id, revision){
      this.layouts.history.showDiff(id, revision, id);
    },
    diffChild: function(id, revision, child_id){
      this.layouts.history.showDiff(id, revision, child_id);
    },
    entries: function(id) {
      this.layouts.record.showEntries(id);
    },
    access: function(id) {
      this.layouts.record.showAccess(id);
    },
    search: function(query) {
      this.layouts.record.showSearchResults(query);
    }
  });

  return Router;
});