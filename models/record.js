define([
  'app',
  'core',
  'utils/log',
  'utils/storage',
  'utils/translate',
  'models/attachment'
], function(app, Core, log, storage, t, AttachmentModel) {

  var RecordModel = Core.Model.extend({
    urlRoot: '/records',
    localUrlDummy: 'javascript: void(0)',
    parentModel: null,
    childCollection: null,
    defaults: {
      is_separator: false
    },
    parse: function(response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }

      if (_.isObject(response.attachment)) {
        response.attachment_id = response.attachment.id;
        this.set('attachment', new AttachmentModel(response.attachment));
      } else {
        response.attachment_id = null;
        this.set('attachment', null);
      }

      return this._removeUnnecessary(response);
    },
    update: function() {
      if (!this.hasUnsavedAttributes()) {
        this.trigger('sync', this, {}, {});
        return;
      }

      return this.save(this.unsavedAttributesMod(), {
        patch: true,
        wait: true
      });
    },
    attachChildren: function(models, detach) {
      models = (_.isArray(models)) ? models : [models];
      detach = !!detach;

      if (!detach) {

        var map =_.reduce(models, function(memo, model){
          memo[model.get('weight')] = model.get('id');
          return memo;
        }, {});

        return this.insert(map);
      }

      var ids = _.invoke(models, 'get', 'id');
      var data = { child_records: ids };

      var link = detach ? 'detach' : 'attach';

      log.info(link, ids);

      var collection = this.actualCollection();

      return this.sync('patch', this, {
        url: app.route.to(this.url() + '/' + link),
        attrs: data
      }).done(function(data) {
        collection.reset(data, { parse: true });
      });
    },
    detachChildren: function(models) {
      return this.attachChildren(models, true);
    },
    updateChildrenOrder: function(data) {
      if (!_.size(data)) {
        return;
      }
      var collection = this.actualCollection();

      this.sync('patch', this, {
        url: app.route.to(this.url()+'/reorder'),
        attrs: {'children_order': data}
      }).done(function(data) {
        collection.reset(data, { parse: true });
      });
    },
    localUrl: function() {
      return (this.isNew()) ? this.localUrlDummy : this.url();
    },
    hasAttachment: function() {
      return (!! (this.get('attachment') && !this.get('attachment').isNew()));
    },
    hasOrigAttachment: function() {
      return (!! (this.getOriginal('attachment') && !this.getOriginal('attachment').isNew()));
    },
    _removeUnnecessary: function(data){
      return _.omit(data, 'attachment');
    },
    numberOfEntries: function () {
      var str = [t.it('record.entry1'), t.it('record.entry2'), t.it('record.entry3')];
      var count = this.get('parent_records_count');
      var last_number = count % 10;
      var phrase = last_number === 1 ? str[0] : last_number !== 0 && last_number < 5 ? str[1] : str[2];
      return count + ' ' + phrase;
    },
    // check access to passed feature
    hasAccess: function(type) {
      if (!this.attributes || !this.attributes.access) {
        return false;
      }
      if (!_.isBoolean(this.attributes.access[type])) {
        return false
      }
      return this.attributes.access[type];
    },
    hasParentAccess: function(type) {
      if (!this.parentModel) {
        return false;
      }

      return this.parentModel.hasAccess(type);
    },
    setDetached: function(state) {
      this._detached = !!state;
      this.trigger('detached');
      if (this.get('is_separator') === true) {
        this.collection.remove(this);
      }
    },
    isDetached: function(){
      return this.get('is_deleted');
    },
    isParent: function() {
      return (this.parentModel === null);
    },
    // if current record is a primary record - get it's child records
    // otherwise, get collection current item belongs to
    actualCollection: function() {
      return (this.isParent()) ? this.childCollection : this.collection;
    },
    actualParent: function() {
      return (this.isParent()) ? this : this.parentModel;
    },
    // select / deselect record
    toggleSelection: function() {
      var selected = storage.records.selected.toggle(this);
      return selected;
    },
    copy: function(fromMenu) {
      var selected = storage.records.selected;
      // if something was selected
      if (selected.length > 0) {
        // if this record was copied and is already selected
        // then copy all selected records
        // when menu is set to false means that this method is triggered not by menu
        // so if current model is not is the list it may not be copied
        if (selected.get(this) || fromMenu !== true) {
          log.info('copy selected');
          storage.records.copied.reset(selected.models);
        } else {
          // if this record was copied but not selected before
          // copy just this record
          log.info('copy model from menu');
          storage.records.copied.reset([this]);  
        }        
      } else {
        // if nothing was selected
        // copy just this record 
        log.info('copy parent');
        storage.records.copied.reset([this]);
      }
    },
    // if using menu item no matter how many records are selected
    // copied record will be inserted after record, where menu item was
    // otherwise, if keyboard shourcut is used, everything will be 
    // added to the end of the list
    paste: function(fromMenu) {
      var collection = this.actualCollection();
      var selected = storage.records.selected;
      var weightMaps = {};
      if (fromMenu === true) {
        if (this.isParent()) {
          log.info('paste to the end from parent menu');
          weightMaps = selected.pasteToTheEnd(collection);
        } else {
          log.info('paste after model from menu');
          weightMaps = selected.pasteAfter(collection, this);
        }
      } else {
        log.info('paste to the end');
        weightMaps = selected.pasteToTheEnd(collection);
      }
      this.insert(weightMaps);
    },
    // if any records are selected separator will be
    // added after each selected record
    // otherwise, if nothing is selected: when menu item is
    // pressed - separator will be added just next to record,
    // which holds this menu item, when keyboard shortcut is used
    // separator will be added to the end of the list
    separator: function(fromMenu) {
      var selected = storage.records.selected;
      var collection = this.actualCollection();
      var parent = this.actualParent();
      var weightMaps = {};
      if (selected.length > 0) {
        log.info('separator after selected');
        var hasParent = (selected.indexOf(parent) !== -1);
        // if parent record is selected
        // insert separator at the end
        if (hasParent) {
          selected.remove(parent);
        }
        weightMaps = selected.separatorAfter(collection, selected.models);
        if (hasParent) {
          log.info('separator to the end from selected parent');
          _.extend(weightMaps, selected.separatorToTheEnd(collection));
        }
        this.insert(weightMaps, { spread: true });
      } else {
        if (fromMenu === true) {
          if (this.isParent()) {
            log.info('separator to the end from parent menu');
            weightMaps = selected.separatorToTheEnd(collection);
          } else {
            log.info('separator after model from menu');
            weightMaps = selected.separatorAfter(collection, this);
          }
        } else {
          log.info('separator to the end');
          weightMaps = selected.separatorToTheEnd(collection);
        }
        this.insert(weightMaps);
      }
    },
    // actually send a request to insert separators and/or records
    // to server to insert them at specific position
    // response returnes entire reordered collection, it should be re-rendered
    insert: function(weightMaps, options) {
      if (_.size(weightMaps) === 0) {
        return false;
      }
      options = options || {};
      var collection = this.actualCollection();
      var parent = this.actualParent();
      var sync = parent.sync('patch', parent, {
        url: app.route.to(parent.url() + '/insert'),
        attrs: { 'weight_maps': weightMaps, 'options': options }
      }).done(function(response, status, xhr) {
        collection.reset(response, { parse: true });
      });
      return sync;
    },
    // parent model can't be attached or detached
    // if nothing is selected but model is attached from menu (restore)
    // then restore just this model
    // if multiple models are selected, all they will be restrored
    attach: function(fromMenu) {
      var parent = this.actualParent();
      var selected = storage.records.selected;
      if (selected.length > 0) {
        selected.remove(parent, { silent: true });
        parent.attachChildren(selected.models);
      } else {
        if (fromMenu === true && !this.isParent()) {
          parent.attachChildren(this);
        }
      }
      storage.records.selected.reset();
    },
    // parent model can't be attached or detached
    // if nothing is selected but model is detached from menu (restore)
    // then restore just this model
    // if multiple models are selected, all they will be detached
    detach: function(fromMenu) {
      var parent = this.actualParent();
      var selected = storage.records.selected;
      if (selected.length > 0) {
        selected.remove(parent, { silent: true });
        parent.detachChildren(selected.models);
      } else {
        if (fromMenu === true && !this.isParent()) {
          parent.detachChildren(this);    
        }
      }
      storage.records.selected.reset();
    },
    // activate edit mode
    // if activating from menu, then just edit this record that owns the menu
    // if from selection - don't enter edit mode if multiple records are selected
    // if one record is selected - enter edit mode
    edit: function(fromMenu) {
      var selected = storage.records.selected;
      if (fromMenu === true) {
        log.info('edit from menu');
        this.trigger('edit');
      } else {
        if (selected.length !== 1) {
          log.info('edit selected rejected multiple');
          return false;
        }
        selected.at(0).trigger('edit');
      }
      storage.records.selected.reset();
    }
  });

  return RecordModel;
});