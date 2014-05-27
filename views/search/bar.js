define([
  'app'
], function(app) {

  var SearchBarView = Backbone.View.extend({
    template: 'search/bar',
    events: {
      'click .jsapp-search': 'search',
      'keypress .jsapp-search-field': 'keypress'
    },
    search: function(e) {
      e.preventDefault();
      app.router.navigate('/search?q=' + this.$el.find('.jsapp-search-field').val(), true)
    },
    keypress: function(e) {
      if ( event.which == 13 ) {
        this.search(e);
      }
    }
  });

  return SearchBarView;
});
