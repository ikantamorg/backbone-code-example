define([
  'app',
  'core',
  'ui',
  'utils/storage',
  'models/record',
  'models/home_record',
  'models/access',
  'collections/records',
  'collections/home_records',
  'collections/entries',
  'collections/groups',
  'collections/users',
  'views/search/bar',
  'views/record/parent',
  'views/record/menu',
  'views/record/list',
  'views/record/form',
  'views/record/entry/list',
  'views/record/entry/load_more',
  'views/record/access/list',
  'views/layout/error'
], function (app, Core, Ui, storage, RecordModel, HomeRecordModel, AccessModel,
             RecordsCollection, HomeRecordsCollection, EntriesCollection, GroupsCollection, UsersCollection,
             SearchBarView, RecordParentView, RecordMenuView, RecordListView, RecordFormView,
             EntryListView, MoreView, AccessListView,
             ErrorLayout) {

  var ui = new Ui();

  var RecordLayout = Core.Layout.extend({
    el: '.jsapp-layout-record',
    template: 'layout/record',
    views: {
      '.jsapp-search-bar': new SearchBarView()
    },
    showHome: function() {

      this.removeView('.jsapp-record-more');
      storage.records.selected.reset();

      var recordModel = new HomeRecordModel();
      var recordsCollection = new HomeRecordsCollection({}, {
        parentModel: recordModel
      });

      var complete = _.invoke([recordModel, recordsCollection], 'fetch');

      $.when.apply($, complete).done(_.bind(function() {
        var viewsData = {
          '.jsapp-record-parent': new RecordParentView({ model: recordModel, menu: true }),
          '.jsapp-record-menu': new RecordMenuView({ model: recordModel }),
          '.jsapp-record-list': new RecordListView({ collection: recordsCollection }),
          '.jsapp-record-form': new RecordFormView({}, { parent: recordModel, collection: recordsCollection })
        };

        this.setViews(viewsData);
        this.render();
      }, this));

    },
    showRecords: function (id) {

      this.removeView('.jsapp-record-more');
      storage.records.selected.reset();

      var recordModel = new RecordModel({ id: id });
      var recordsCollection = new RecordsCollection({}, {
        id: id,
        parentModel: recordModel
      });

      var complete = _.invoke([recordModel, recordsCollection], 'fetch');

      $.when
        .apply($, complete).done(_.bind(function () {

          var viewsData = {
            '.jsapp-record-parent': new RecordParentView({ model: recordModel, menu: true }),
            '.jsapp-record-menu': new RecordMenuView({ model: recordModel }),
            '.jsapp-record-list': new RecordListView({ collection: recordsCollection })
          };

          if (recordModel.hasAccess('manage_children')) {
            viewsData['.jsapp-record-form'] = new RecordFormView({}, { parent: recordModel, collection: recordsCollection });
          } else {
            this.removeView('.jsapp-record-form');
          }

          this.setViews(viewsData);
          this.render();

        }, this))
        .fail(this.fail);

    },
    showHistory: function (id) {
      //
    },
    showEntries: function (id) {
      var per = 10;
      this.removeView('.jsapp-record-form');

      var recordModel = new RecordModel({ id: id });
      var entriesCollection = new EntriesCollection({}, { id: id });

      var modelComplete = recordModel.fetch();
      var entriesComplete = entriesCollection.fetch({data: { per: per}});

      $.when
        .apply($, [modelComplete, entriesComplete]).done(_.bind(function () {

          var viewsData = {
            '.jsapp-record-parent': new RecordParentView({ model: recordModel }),
            '.jsapp-record-menu': new RecordMenuView({ model: recordModel }),
            '.jsapp-record-list': new EntryListView({ collection: entriesCollection })
          };

          if (entriesCollection.length === per) {
            viewsData['.jsapp-record-more'] = new MoreView({ collection: entriesCollection, per: per })
          } else {
            this.removeView('.jsapp-record-more');
          }

          this.setViews(viewsData);
          this.render();

        }, this))
        .fail(this.fail);
    },
    showAccess: function (id) {

      this.removeView('.jsapp-record-form');
      this.removeView('.jsapp-record-more');

      var recordModel = new RecordModel({ id: id });
      var accessModel = new AccessModel({ rid: id});

      var complete = _.invoke([recordModel, accessModel], 'fetch');

      $.when
        .apply($, complete).done(_.bind(function () {

          this.setViews({
            '.jsapp-record-parent': new RecordParentView({ model: recordModel }),
            '.jsapp-record-menu': new RecordMenuView({ model: recordModel }),
            '.jsapp-record-list': new AccessListView({ model: accessModel })
          });
          this.render();

        }, this))
        .fail(this.fail);

    },
    showSearchResults: function(query) {
      this.removeView('.jsapp-record-parent');
      this.removeView('.jsapp-record-menu');
      this.removeView('.jsapp-record-form');

      var recordModel = new HomeRecordModel();
      var recordsCollection = new HomeRecordsCollection({},{
        parentModel: recordModel
      });

      var complete = _.invoke([recordModel, recordsCollection], 'fetch');

      $.when
        .apply($, complete).done(_.bind(function () {

          this.setViews({
            '.jsapp-record-list': new RecordListView({ collection: recordsCollection }),
            '.jsapp-record-more': new MoreView({ collection: recordsCollection })
          });
          this.render();

        }, this))
        .fail(this.fail);
    },
    afterRender: function() {
      ui.bind();
    }
  });

  return RecordLayout;
});