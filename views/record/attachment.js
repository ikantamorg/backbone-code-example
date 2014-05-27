define([
  'app',
  'utils/route',
  'models/attachment',
  'utils/translate',
  // scripts below don't export anything
  'jquery.fileupload',
  'jquery.fileupload-process',
  'jquery.fileupload-validate',
  'jquery.iframe-transport'
], function(app, Route, AttachmentModel, t) {

  var RecordAttachmentView = Backbone.View.extend({
    dom: {}, // see `initialize` method for dom
    disabled: false, // if user can upload file at the moment
    uploading: false,
    xhr: null, // upload xhr object
    state: null,
    recordModel: null,
    events: {
      'click .file-upload .icon-close': 'abort',
      'click .file-success .icon-close': 'destroy',
      'click .file-error .icon-close': 'clear'
    },
    initialize: function(attributes, options) {
      this.bindState(options.state);
    },
    setDom: function() {
      this.dom = {
        $input: this.$('.jsapp-record-form-file-input'),
        $button: this.$('.btn.btn-file'),

        $dropzone: this.$('.load-file-record'),
        $dropzoneUi: this.$('.draggable-file-record'),
        $loading: this.$('.loading'),

        $fileBlock: this.$('.file-block.file-upload'),
        $fileName: this.$('.file-upload .name-file-record'),

        $successBlock: this.$('.file-success'),
        $successName: this.$('.file-success .name-file-record'),

        $errorBlock: this.$('.file-error'),
        $errorName: this.$('.file-error .name-file-record'),
        $errorMessage: this.$('.file-error .file-error-message')
      };
    },
    bindState: function(state) {
      this.state = state;
      this.state.add('attachment', {
        clear: this.clear,
        disable: this.disable,
        enable: this.enable
      }, this);
    },
    // call it to attach fileupload to view
    attach: function() {

      this.setDom();

      this.dom.$input.fileupload({
        url: app.route.to('attachments'),
        dataType: 'json',
        singleFileUploads: true,
        multipart: true,
        autoUpload: true,
        processQueue: [{
          action: 'validate',
          always: true,
          // don't restrict file types and size
          // acceptFileTypes: /(\.|\/)(png|jpg|jpeg|gif|docx?|xlsx?|pdf)$/i,
          // maxFileSize: 1024 * 1024 * 10, // 10 mb
          maxNumberOfFiles: 1
        }],
        // don't forget to update translations
        messages: {
          maxNumberOfFiles: t.it('attachment.max_number_of_files'),
          acceptFileTypes: t.it('attachment.accept_file_types'),
          maxFileSize: t.it('attachment.max_file_size'),
          minFileSize: t.it('attachment.min_file_size')
        },
        // dropzone
        dropZone: this.dom.$dropzone,
        // callbacks
        done: _.bind(this.done, this),
        fail: _.bind(this.fail, this),
        always: _.bind(this.always, this),
        send: _.bind(this.send, this),
        progressall: _.bind(this.progressall, this),
        // validation
        processstart: _.bind(this.processstart, this),
        processfail: _.bind(this.processfail, this)
      });

      this.bindDragzone();

      if (!this.model.isNew()) {
        this._render();
      }

    },
    // call it to remove all bindings from page
    detach: function() {
      this.clear();
      this.dom.$input.fileupload('destroy');
      this.unbindDragzone();
    },
    processstart: function(ev, data) {
      this.state.all('disable');

      this.model = new AttachmentModel();

      if (this.recordModel) {
        this.recordModel.set('attachment', this.model);
      }

      this.clear();
    },
    processfail: function(ev, data) {
      this.showError(data.files[0].error);
    },
    // callbacks
    send: function(ev, data){
      this.uploading = true;
    },
    always: function(ev, data){
      this.uploading = false;
    },
    done: function(ev, data) {
      this.state.one('record', 'enable');

      this.model.set(data.result.data);

      this._render();

    },
    fail: function(ev, data) {

      if (data.errorThrown === 'abort') {
        this.clear();
        return true;
      }

      if (data.jqXHR.status === 500) {
        this.showError(t.it('attachment.server_error'));
        return true;
      }

      this.showError(data.jqXHR.responseText);  
    },
    abort: function(ev) {
      if (this.xhr !== null) {
        this.xhr.abort();
        this.xhr = null;
        this.clear();
      }
    },
    destroy: function(ev) {

      if (this.recordModel && !this.recordModel.isNew()) {
        this.enable();
        this.dom.$successBlock.hide();
        this.dom.$button.show();
        this.model = new AttachmentModel();
        this.recordModel.set('attachment', this.model);

        return;
      }

      this.model.once('request', _.bind(function(model, resp, options) {
        this.state.all('disable');
      }, this));

      this.model.once('destroy', _.bind(function(model, resp, options) {
        this.state.all('enable');
          
        this.dom.$successBlock.hide();
        this.dom.$button.show();

      }, this));

      this.model.once('error', _.bind(function(model, resp, options) {
        if (resp.status === 500) {
          this.showError(t.it('attachment.server_error'));
          return true;
        }

        var errorMsg = resp.responseJSON ? resp.responseJSON.errors : resp.responseText;

        this.showError(errorMsg);
      }, this));

      this.model.destroy();

      this.clear();
    },
    progressall: function(ev, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
      this.dom.$loading.css('width', progress + '%');
    },
    showError: function(message, status) {

      this.state.one('record', 'enable');
      this.clear();

      this.dom.$errorName.html(this.getFilename());
      this.dom.$errorMessage.html(message);
      
      this.dom.$errorBlock.show();
    },

    // create filename element
    // model should have data in it
    getFilename: function() {
      var name = this.model.get('filename') || '';
      var size = this.model.getSizeStr();
      var filename = '<i class="icon-minifile"></i>' + name;
      if (this.model.getSizeKb() > 0) {
        filename += ' - <em>' + size + '</em>';
      }
      return filename;
    },
    
    // dragzone

    bindDragzone: function() {

      $(document).on('dragover', _.bind(function(ev) {
        if (this.isDisabled()) {
          return false;
        }
        
        var dropzone = this.dom.$dropzoneUi;
        var timeout = window.dropZoneTimeout;
        dropzone.show();
        if (! timeout) {
          dropzone.show();
        } else {
          clearTimeout(timeout);
        }

        window.dropZoneTimeout = setTimeout(function () {
          window.dropZoneTimeout = null;
          dropzone.hide();
        }, 1000);

      }, this));

      $(document).on('drop dragover', function (ev) {
        ev.preventDefault();
      });

    },
    unbindDragzone: function() {
      $(document).off('dragover');
      $(document).off('drop dragover');
    },
    setRecordModel: function(recordModel){
      this.recordModel = recordModel;
    },
    _render:function(){
      this.disable();

      this.dom.$button.hide();
      this.dom.$fileBlock.hide();

      this.dom.$successName.html(this.getFilename());
      this.dom.$successBlock.show();

      this.dom.$dropzone.addClass('padding-bottom-60');
    },
    // return all ui elements to initial state
    clear: function() {

      this.model.clear();

      this.enable();

      this.dom.$dropzoneUi.hide();

      this.dom.$fileBlock.hide();
      this.dom.$fileName.empty();

      this.dom.$successBlock.hide();
      this.dom.$successName.empty();

      this.dom.$errorBlock.hide();
      this.dom.$errorName.empty();
      this.dom.$errorMessage.empty();

      this.dom.$dropzone.removeClass('padding-bottom-60');
    },
    disable: function() {
      this.disabled = true;
      this.dom.$button.hide();
    },
    enable: function() {
      this.disabled = false;
      this.dom.$button.show();
    },
    isDisabled: function() { return this.disabled === true; },
    isEnabled: function() { return this.disabled === false; },
    isUploading: function(){return this.uploading == true; }
  });

  return RecordAttachmentView;
});