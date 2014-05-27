define([
  'app',
  'collections/records'
], function(app, RecordsCollection) {

  var HomeRecordsCollection = RecordsCollection.extend({
    url: 'home/records'
  });

  return HomeRecordsCollection;
});