define([
  'app'
], function (app) {

  var MoreView = Backbone.View.extend({
    template: 'record/entry/load_more',
    page: 1,
    per: null,
    collection: null,
    events: {
      'click .jsapp-record-more-parents': 'loadParents'
    },
    initialize: function (attributes, options) {
      if (this.collection) {
        this.collection = attributes.collection;
        this.per = attributes.per;
        this.listenTo(this.collection, {
          'sync': this.done
        });
      }
    },
    loadParents: function (e) {
      e.preventDefault();
      this.collection.fetch({
        data: { page: this.page + 1,
                per: this.per },
        update: true,
        remove: false
      });
    },
    done: function(model, resp) {
      if (resp.data != undefined) {
        if (resp.data.length === this.per) {
          this.page++;
        } else {
          this.remove();
        }
      }
    }
  });

  return MoreView;
});