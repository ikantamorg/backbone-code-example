define([
  'app',
  'utils/state',
  'utils/keyboard',
  'models/record',
  'models/attachment',
  'views/record/attachment'
], function(app, State, keyboard,
            RecordModel, AttachmentModel,
            RecordAttachmentView) {

  var RecordFormView = Backbone.View.extend({
    template: 'record/form',
    model: new RecordModel(),
    parent: null, // parent record model
    dom: {}, // see `afterRender` method
    disabled: false, // if form is disabled at the moment
    state: null,
    attachmentView: null,
    events: {
      'click .jsapp-record-form-add': 'add',
      'keypress .jsapp-record-form-text': 'keypress'
    },
    initialize: function(attributes, options) {
      this.parent = options.parent;
      this.collection = options.collection;

      this.state = new State();
      this.state.add('record', {
        clear: this.clear,
        disable: this.disable,
        enable: this.enable
      }, this);

      this.model.set('attachment', new AttachmentModel());

      this.listenTo(this.model, {
        'request': this.request,
        'sync': this.done,
        'error': this.error
      });
    },
    serialize: function() {
      return { data: {
        record: this.model
      }};
    },
    add: function(ev) {
      ev.preventDefault();

      if (this.isDisabled()) {
        return false;
      }

      var text = this.dom.$text.val().trim()
      if (!text.length) {
        this.dom.$text.focus();
        return false;
      }

      this.setDataToModel();

      // this action is necessary only when creating
      this.model.set('parent_id', (this.parent) ? this.parent.get('id'): null);
      this.model.set('weight', this.collection.size());

      this.model.save();
    },
    setDataToModel: function(){
      var text = this.dom.$text.val().trim(),
        attachmentId = (this.model.hasAttachment()) ? this.model.get('attachment').get('id'): null
        ;

      this.model.set('attachment_id', attachmentId);

      if (text.length) {
        this.model.set('text', text);
      }

    },
    keypress: function(ev) {
      if (ev.keyCode === keyboard.codes.ENTER) {
        this.add(ev);
        return false;  
      }
    },
    request: function() {
      this.state.all('disable');
    },
    done: function() {
      this.state.all('clear');
      this.collection.add(_.clone(this.model.attributes));
      
      this.model.clear();
      this.model.set('attachment', new AttachmentModel());
      this.attachmentView.model = this.model.get('attachment');
    },
    error: function() {
      this.state.all('enable');
    },
    afterRender: function() {
      this.dom = {
        $text: this.$('.jsapp-record-form-text'),
        $drop: this.$('.jsapp-record-form-drop'),
        $add: this.$('.jsapp-record-form-add')
      };

      this.attachmentView = new RecordAttachmentView({
        model: this.model.get('attachment'),
        el: this.$el
      }, {
        state: this.state
      });

      this.attachmentView.attach();
      this.attachmentView.setRecordModel(this.model);

      this.afterRenderHook();
    },
    afterRenderHook: function(){},
    clear: function() {
      this.enable();
      this.dom.$add.removeAttr('disabled');
      this.dom.$text.val('');
    },
    disable: function() {
      this.disabled = true;
      this.dom.$add.attr('disabled', 'disabled');
    },
    enable: function() {
      this.disabled = false;
      this.dom.$add.removeAttr('disabled');
    },
    isDisabled: function() { return this.disabled === true; },
    isEnabled: function() { return this.disabled === false; }
  });

  return RecordFormView;
});