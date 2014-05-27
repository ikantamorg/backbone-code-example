define([
  'app',
  'models/record'
], function(app, RecordModel) {

  var SeparatorModel = RecordModel.extend({
    defaults: {
      is_separator: true
    }
  });

  return SeparatorModel;
});