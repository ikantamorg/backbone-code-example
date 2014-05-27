define([
  'app',
  'views/record/form',
  'utils/state',
  'models/attachment',
  'views/record/attachment',
  'jquery',
  'autoresize.jquery'
], function(app, RecordFormView, State, AttachmentModel, RecordAttachmentView, $) {


  var RecordEditFormView = RecordFormView.extend({
    template: 'record/edit-form',
    model: null,
    singleRecord: null,
    releaseErrors:[],
    open: false,
    initialize: function(attributes) {

      this.state = new State();

      this.state.add('record', {
        clear: this.clear,
        disable: this.disable,
        enable: this.enable
      }, this);

      $('body').on('mousedown.RecordEditFormView',_.bind(this.handleDocumentClickEvent, this));

    },
    canRelease: function(){
      if (this.attachmentView && this.attachmentView.isUploading()) {
        this.releaseErrors.push(t.it('attachment.wait_for_upload'));

        return false;
      }

      if (this.isDisabled()) {
        this.releaseErrors.push(t.it('attachment.wait_for_record_save'));
        return false;
      }

      return true;
    },
    tryToRelease: function(){
      this.releaseErrors = [];

      if (!this.isOpen()) {
        return true;
      }

      if (!this.canRelease()) {
        return false;
      }

      this.setDataToModel();

      this.detach();

      return true;
    },
    tryToAttach: function(RecordSingleView){
      if (!this.tryToRelease()) {
        return;
      }

      if (RecordSingleView.model.get('access').update) {
        this.attach(RecordSingleView);
      }
    },
    _setModel:function(model){
      this.model = model;

      if (!this.model.get('attachment')) {
        this.model.set('attachment', new AttachmentModel());
      }

      this.listenTo(this.model, {
        'request': this.request,
        'sync': this.done,
        'error': this.error
      });

    },
    attach: function(RecordSingleView){
      this.singleRecord = RecordSingleView;
      this._setModel(RecordSingleView.model);

      this.$el = RecordSingleView.$el;
      this.render();
      this.open = true;
    },
    detach: function(){
      var singleRecord = this.singleRecord;

      this.stopListening(this.model);

      this.attachmentView = null;
      this.singleRecord = null;
      this.model = null;
      this.$el.empty();
      this.$el = null;

      this.open = false;

      singleRecord.once('afterRender', _.bind(function() {
        this.trigger('detach');
      }, this));

      singleRecord.render();
    },
    afterRenderHook: function(){

      this.attachmentView.setRecordModel(this.model);

      this.dom.$text.autoResize({
        extraSpace : 0,
        limit: 280
      });

      var textParent = this.dom.$text.closest('.load-file-record');

      this.dom.$text.keyup(_.bind(function() {
        if (this.dom.$text.val() != "" ) {
          textParent.addClass("filled");
        } else {
          textParent.removeClass("filled");
        }
      }, this));

    },
    add: function(ev){
      ev.preventDefault();

      if (!this.canRelease()) {
        return false;
      }

      var text = this.dom.$text.val().trim()
      if (!text.length) {
        this.dom.$text.focus();
        return false;
      }

      this.setDataToModel();

      this.model.update();
    },
    done: function() {
      this.state.all('enable');

      // should be called after //model._resetTracking();
      setTimeout(_.bind(function(){
        this.detach();
      }, this),1);

    },
    isOpen: function(){return this.open == true;},
    handleDocumentClickEvent: function(ev){
      if (!this.isOpen()) {
        return;
      }

      if (!this.$el) {
        return;
      }

      var $target = $(ev.target);

      if ($target == this.$el || $target.closest(this.$el).length) {
        return;
      }

      this.tryToRelease();
    }
  });

  return RecordEditFormView;
});