define([
  'app',
  'utils/storage',
  'models/record',
  'models/separator'
], function(app, storage, RecordModel, SeparatorModel) {

  var RecordsCollection = Backbone.Collection.extend({
    model: RecordModel,
    urlRoot: 'records/:id/records',
    parentModel: null,
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }

      // response has an array with records in "data.records"
      // and array of separators in "data.separators"
      // but here in application they should be stored in one collection
      // in models with similar behavior
      var records = _.map(response.records, function(record) {
        return new RecordModel(record, { parse: true });
      });

      var separators = _.map(response.separators, function(separator) {
        return new SeparatorModel(separator, { parse: true });
      });

      // combine two collections and attach parent model to each model
      var models = _.map(records.concat(separators), function(model) {
        model.parentModel = this.parentModel;
        return model;
      }, this);

      return models;
    },
    comparator: function(model) {
      return model.get('weight');
    },
    initialize: function(models, options) {
      options = options || {};
      if (options.id === undefined) {
        // console.warn('id not found when initializing collection');
        options.id = null; // make request to non existing record
      }

      if (options.parentModel) {
        this.parentModel = options.parentModel;
        this.parentModel.childCollection = this;
      }

      this.on('add', function(model){
        model.parentModel = this.parentModel;
      });

      this.id = options.id;
    },
    url: function() {
      return app.route.uri(this.urlRoot, this.id);
    },
    reorder: function() {
      this.sort({silent: true});
      this.saveNewOrder();
      this.trigger('reorder', this);
    },
    saveNewOrder: function() {
      if (!this.parentModel) {
        return;
      }
      var data = this.orderMap();
      this.parentModel.updateChildrenOrder(data);
    },
    orderMap: function() {
      var map = this.reduce(function(memo, model) {
        // if model has no weight  or has negative weights
        // it will have null weight
        // and will be placed at the bottom of the list
        var weight = model.get('weight');
        if (_.isUndefined(weight) || weight < 0) {
          weight = null;
        }
        memo[model.get('id')] = weight;
        return memo;
      }, {});

      return map;
    }
  });

  return RecordsCollection;
});