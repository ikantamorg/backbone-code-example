define([
  'app',
  'underscore.string',
  'utils/translate'
], function(app, _s, t) {

  // unlike separator record can be edited
  var HistoryItemView = Backbone.View.extend({
    tagName: 'li',
    template: 'history/item',
    templates: {
      attachment: window.JST['widget/attachment'],
      childRecordLink: window.JST['widget/child_record_link']
    },
    compiledTemplates: {},
    events: {},
    serialize: function() {
      return {
        data: {
          item: this.model,
          readableChanges: this.getHumanReadableChanges()
        },
        r: app.route
      };
    },
    renderSub: function(name, data){
      data = _.extend({r: app.route}, data);
      return this.renderTemplate(this.templates[name], data);
    },
    renderChildLinks: function(child_ids){
      tmp_rendered_elements = [];
      _.each(child_ids, _.bind(function(element) {
        tmp_rendered_elements.push(
          this.renderSub('childRecordLink', {child_id: element})
        );
      },this));

      return tmp_rendered_elements.join(', ');
    },
    getHumanReadableChanges: function(){
      var output = [],
        model = this.model
        ;

      if (model.get('event') == 'create') {
        output.push(t.it('history.event.create'));
      } else {

        _.each(model.get('sub_event'), _.bind(function(element, index, list){

          var msg = t.it('history.sub_event.'+element),
            changeset = model.get('changeset')
            ;

          switch (element) {
            case 'add_attachment':
              if (!changeset['attachment'] || !changeset['attachment'][1]) {
                return
              }
              var data = {attachment: changeset['attachment'][1]};
              msg = _s.sprintf(msg, this.renderSub('attachment', data));
              break;
            case 'remove_attachment':
              if (!changeset['attachment'] || !changeset['attachment'][0]) {
                return
              }
              var data = {attachment: changeset['attachment'][0]};
              msg = _s.sprintf(msg, this.renderSub('attachment', data));
              break;
            case 'update_attachment':
              if (!changeset['attachment'] || !changeset['attachment'][0] || !changeset['attachment'][1]) {
                return
              }
              var data = [
                {attachment: changeset['attachment'][0]},
                {attachment: changeset['attachment'][1]}
              ];
              msg = _s.sprintf(msg,
                this.renderSub('attachment', data[0]),
                this.renderSub('attachment', data[1])
              );
              break;
            case 'add_children':
              if (!changeset['child_record_ids']) {
                return;
              }
              var added_children = _.difference(changeset['child_record_ids'][1], changeset['child_record_ids'][0]);
              msg = _s.sprintf(msg, this.renderChildLinks(added_children));
              break;
            case 'remove_children':
              if (!changeset['child_record_ids']) {
                return;
              }
              var removed_children = _.difference(changeset['child_record_ids'][0], changeset['child_record_ids'][1]);
              msg = _s.sprintf(msg, this.renderChildLinks(removed_children));
              break;
          }

          output.push(msg);

        }, this));
      }
      output = output.join(', ')+'.';
      output = output.charAt(0).toUpperCase() + output.slice(1);

      return output;
    }
  });

  return HistoryItemView;
});