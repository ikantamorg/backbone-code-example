define([
  'app',
  'utils/storage',
  'utils/keyboard'
], function(app, storage, keyboard) {

  // separator has all basics that record has
  // so record actually extends separator
  var RecordSeparatorView = Backbone.View.extend({
    className: 'record-sortable',
    template: 'record/separator',
    dom: {},
    events: {
      'click .record': 'select',
      'click .ccbx': 'selectForce',
      'mouseenter .record-menu': 'toggleRightMenu',
      'mouseleave': 'hideRightMenu',
      'click .record-menu': 'hideRightMenu',
      'mouseleave .record-menu': 'hideRightMenu',
      'click [data-action="attach"]': 'attach',
      'click .record-menu [data-action="copy"]': 'copy',
      'click .record-menu [data-action="paste"]': 'paste',
      'click .record-menu [data-action="detach"]': 'detach',
      'click .record-menu [data-action="separator"]': 'separator'
    },
    initialize: function(options) {

      if (this.model !== undefined) {
        this.listenTo(this.model, {
          'detached': this.remove
        });
      }

      // separator should be removed when detached
      this.listenTo(storage.records.selected, {
        'reset': this.clearSelection
      });
      this.initializeHook(options);
    },
    initializeHook: function(options) {},
    afterRender: function() {
      this.setDom();
      if (this.model.isDetached()) {
        this.$el.addClass('detached');
      } else {
        this.$el.removeClass('detached');
      }
      this.$el.cf();
      this.afterRenderHook();
    },
    afterRenderHook: function() {},
    setDom: function() {
      this.dom = {
        $rightMenu: this.$('.record-menu ul'),
        $checkbox: this.$('.ccbx input[checkbox]'),
        $checkboxWrapper: this.$('.ccbx')
      };
    },
    serialize: function() {
      return { 
        data: {
          record: this.model
        },
        r: app.route
      };
    },
    toggleRightMenu: function() {
      if (!this.dom.$rightMenu) {
        return;
      }
      var menu = this.dom.$rightMenu;
      menu.toggle(!menu.is(':visible'));
    },
    hideRightMenu: function() {
      if (!this.dom.$rightMenu) {
        return;
      }
      this.dom.$rightMenu.hide();
    },
    clearSelection: function() {
      this.$el.find('.active-record').removeClass('active-record');
    },
    selectForce: function(ev){
        this.select(ev, true);
    },
    select: function(ev, force) {
      force = !!force;
      // if ctrl is not down when clicking on a record
      // record could not be selected/deselected
      if (! keyboard.isCtrlDown(ev) && !force) {
        // return `true` for correct bubbling
        return true;
      }

      var selected = this.model.toggleSelection();
      this.$el.find('.record').toggleClass('active-record', selected);

      this.renderCheckbox(selected);

      // prevent page change, because record text is a link
      ev.preventDefault();
      ev.stopPropagation();
    },
    renderCheckbox: function(selectStatus){
      var checkboxStatus = this.dom.$checkbox.prop('checked');

      if (selectStatus == checkboxStatus) {
        return;
      }

      this.dom.$checkbox.prop('checked', selectStatus);
      this.dom.$checkboxWrapper.toggleClass('checked', selectStatus);
    },
    // process menu actions
    copy: function(ev) {
      this.model.copy(true);
    },
    paste: function(ev) {
      this.model.paste(true);
    },
    separator: function(ev) {
      this.model.separator(true);
    },
    attach: function(ev) {
      this.model.attach(true);
    },
    detach: function(ev) {
      this.model.detach(true);
    }
  });

  return RecordSeparatorView;
});