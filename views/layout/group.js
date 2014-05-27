define([
  'app',
  'core',
  'collections/groups',
  'views/group/header',
  'views/group/list',
  'views/layout/error'
], function (app, Core, GroupsCollection, GroupHeaderView, GroupListView, ErrorLayout) {

  var GroupLayout = Core.Layout.extend({
    el: '.jsapp-layout-record',
    template: 'layout/group',
    events: {
      'click': 'save'
    },
    showGroups: function () {
      var groupsCollection = new GroupsCollection();
      var complete = groupsCollection.fetch();

      $.when
        .apply($, complete).done(_.bind(function () {

          var groupListView = new GroupListView({ collection: groupsCollection });
          groupListView.listenTo(this, {
            'save': groupListView.saveEditedView
          });

          this.setViews({
            '.jsapp-group-header': new GroupHeaderView({ collection: groupsCollection }),
            '.jsapp-group-list': groupListView
          });
          this.render();

        }, this))
        .fail(this.fail);
    },
    save: function () {
      this.trigger('save');
    }
  });

  return GroupLayout;
});
