define([
  'app',
  'models/attachment',
  'moment',
  'utils/text-differ'
], function (app, AttachmentModel, moment, TextDiffer) {

  var textDiffer = new TextDiffer();

  var HistoryItemModel = Backbone.Model.extend({
    parse: function (response, options) {
      if (response.data !== undefined) {
        response = response.data;
      }

      if (response.created_at) {
        response.jsDate = moment(response.created_at);
        response.date = response.jsDate.format('D MMMM, YYYY');
        response.time = response.jsDate.format('hh:mm');
      }

      if (response['changeset']['attachment']) {
        response['changeset']['attachment'] = _.map(response['changeset']['attachment'], function(attachment){
           if (attachment) {
             attachment = new AttachmentModel(attachment);
           }

          return attachment;
        });
      }

      return response;
    },
    getUserName: function(){
      return this.get('actor').username;
    },
    getTime: function(){
        return  this.get('time');
    },
    getDate: function(){
       return this.get('date');
    },
    getRevision: function(){
      return this.get('revision');
    },
    isChildHistory: function(){
        return !!this.get('is_child_history');
    },
    hasDiffView: function(){
      var sub_events = this.get('sub_event');
        return (sub_events instanceof Array && sub_events.indexOf("update_text") != -1);
    },
    diffUrl: function(){
      var url =  this.collection.url()+'/diff/'+  this.getRevision();
      if (this.isChildHistory()) {
        url += '/child/'+this.get('record_id');
      }

      return url;
    },
    diffText: function(){
      var changeset = this.get('changeset');

      if (!changeset['text']) {
        return '';
      }

      return textDiffer.diffText(changeset['text'][0], changeset['text'][1])
        .cleanupSemantic().toPrettyHtml();
    }
  });

  return HistoryItemModel;
});
