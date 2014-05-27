define([
  'app',
  'models/record',
  'models/attachment'
], function(app, RecordModel, AttachmentModel) {

  var HomeRecordModel = RecordModel.extend({
    url: function(){
      if (this.isNew()) {
        return '/home';
      }
      return HomeRecordModel.__super__.url.apply(this, arguments);
    }
  });

  return HomeRecordModel;
});