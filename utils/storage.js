define([
  'app',
  'utils/log',
  'simple-storage'
], function(app, log, storage) {

  var StorageCollection = Backbone.Collection.extend({
    // name where data will be stored
    alias: null,
    // set if data should be stored between page reloads
    // true - it will be available after reload, false - it will be destroyed
    continuous: false,
    initialize: function() {
      if (this.alias === null) {
        log.error('Alias not set for storage collection');
        return false;
      }
      // if continuous option is not set
      // then data will be updated in local storage
      // when any new item is added in it or removed from it
      if (this.continuous) {
        // on page load grab saved data from storage and bind event listeners
        this.set(storage.get(this.alias) || []);
        this.listenTo(this, {
          'add': this.update,
          'remove': this.update,
          'reset': this.update
        });
        log.info(this.alias, 'loaded', this.pluck('id'));
      }
    },
    comparator: function(model) {
      return model.get('weight');
    },
    // update data in storage
    update: function(a,b,c) {
      log.info(this.alias, this.pluck('id'));
      storage.set(this.alias, this.toJSON());
    },
    // add model to list if it is not here
    // or remove if it is already in list
    // return boolean, true - if added, false - if removed
    toggle: function(model) {
      var exists = this.get(model);
      if (exists) {
        this.remove(model);
      } else {
        this.add(model);
      }
      var selected = ! exists;
      log.info(selected ? 'selected' : 'unselected', model.get('id'));
      return selected;
    }
  });

  // collection to store selected records
  var SelectedCollection = StorageCollection.extend({
    alias: 'selected',
    continuous: false,

    // paste selected models to the end of the collection
    pasteToTheEnd: function(collection) {
      return this.pasteAfter(collection);
    },
    // if model to paste after is undefined then add new models to the end
    // otherwise get model's index and insert new models after it
    // return weight maps in format { weight: id }
    // separators have a format { weight: null }
    pasteAfter: function(collection, model) {
      var map = {};

      if (copied.length === 0) {
        return map;
      }

      // if should paste after specific model
      // calculate weights from it's position
      // otherwise - from the end of the list
      var baseWeight = (_.isUndefined(model))
        ? collection.length
        : collection.indexOf(model) + 1;

      _.each(copied.models, function(model, index) {
        // separator should have a null value
        // to separate them from records on server
        var id = model.get('is_separator') ? null : model.get('id');
        map[baseWeight + index] = id;
      });

      log.info('pasted', map, 'to', collection.parentModel.get('id'));

      // models were pasted, remove them from storage
      copied.reset();
      this.reset();

      return map;
    },
    // insert separator to the end of the collection
    separatorToTheEnd: function(collection) {
      return this.separatorAfter(collection);
    },
    // if "after"-model not passed add separator to the end of the list
    // otherwise separators will be added after each passed model
    // separator should have a null value
    // to separate them from records on server
    separatorAfter: function(collection, models) {
      var map = {};
      
      // no model to insert after
      // so only one separator will be added
      // and will be added to the end of the list
      if (_.isUndefined(models)) {
        map[collection.length] = null;
        return map;
      }

      models = (_.isArray(models)) ? models : [models];

      // add separator after each selected model
      _.each(models, function(model) {
        var index = collection.indexOf(model) + 1;
        map[index] = null;
      }, this);

      copied.reset();
      this.reset();

      log.info('separators', map, 'to', collection.parentModel.get('id'));

      return map;
    }
  });
  var selected = new SelectedCollection();


  // collection to store copied records
  var CopiedCollection = StorageCollection.extend({
    alias: 'copied',
    continuous: true,

  });
  var copied = new CopiedCollection();


  // extend simple storage object with custom methods
  // you'll be able to use simpel storage methods
  // using this module returned object
  var extendedStorage = _.extend({}, storage, {
    records: {
      selected: selected,
      copied: copied
    }
  });

  return extendedStorage;
});