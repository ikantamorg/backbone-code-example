define([
  'app',
  'core',
  'collections/history_items',
  'models/record',
  'views/history/list',
  'views/history/diff',
  'views/history/record',
  'views/record/menu',
  'views/search/bar',
  'views/layout/error'
], function (app, Core, HistoryCollection, RecordModel, HistoryListView, HistoryDiffView, HistoryRecordView, RecordMenuView, SearchBarView, ErrorLayout) {

  var GroupLayout = Core.Layout.extend({
    el: '.jsapp-layout-record',
    template: 'layout/history',
    cache: {},
    views: {
      '.jsapp-search-bar': new SearchBarView()
    },
    events: {
      //'click': 'save'
    },
    showHistoryOfRecord: function (id) {

      this.loadData(id, true).done(_.bind(function(recordModel, historyCollection){

        this.setViews({
          '.jsapp-record-parent': new HistoryRecordView({ model: recordModel, menu: false }),
          '.jsapp-record-menu': new RecordMenuView({ model: recordModel }),
          '.jsapp-record-history': new HistoryListView({ collection: historyCollection })
        });

        this.render();

      }, this));

    },
    showDiff: function(id, revision, record_id){
      this.loadData(id, false).done(_.bind(function(recordModel, historyCollection){

        var historyItem = historyCollection.where({revision: parseInt(revision, 10), record_id: parseInt(record_id, 10)});

        if (!historyItem.length) {
          return this.show404();
        }

        historyItem = historyItem[0];

        this.setViews({
          '.jsapp-record-parent': new HistoryRecordView({ model: recordModel, menu: false }),
          '.jsapp-record-menu': new RecordMenuView({ model: recordModel }),
          '.jsapp-record-history': new HistoryDiffView({ model: historyItem })
        });

        this.render();

      }, this));
    },
    loadData: function(id, reset){
      reset = reset || false;
      var dfd = new $.Deferred();

      if (!this.cache[id] || reset) {

        var recordModel = new RecordModel({ id: id });
        var historyCollection = new HistoryCollection({},{
          id: id
        });

        var complete = _.invoke([recordModel, historyCollection], 'fetch');

        $.when.apply($, complete).done(_.bind(function(){

            this.cache[id] = {
              'record': recordModel,
              'collection': historyCollection
            };

            dfd.resolve(recordModel, historyCollection);

          }, this)).fail(function (xhr, type, message) {
          if (xhr.status === 404) {
            this.show404();
          }
        });

      } else {

        dfd.resolve(this.cache[id]['record'], this.cache[id]['collection']);
      }


      return dfd.promise();

    },
    show404: function(){
      var errorLayout = new ErrorLayout();
      errorLayout.show404();
    }

  });

  return GroupLayout;
});
