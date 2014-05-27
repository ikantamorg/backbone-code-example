define([
  'jquery.ui.sortable'
], function(){

  var MultiSortable = function($elements, options){

    options = _.defaults(options, {
      delay: 150, //Needed to prevent accidental drag when trying to select
      revert: 0,
      forceHelperSize: true,
      forcePlaceholderSize: true,
      placeholder: "sortable-placeholder",
      helper: function (e, item) {
        var helper = $('<div/>'),
          elements = $(),
          selectedSelector = '.active-record';

        //elements = elements.add(item);

        if (item.children(selectedSelector).length) {
          item.siblings().find(selectedSelector).parent().each(function(){
            elements = elements.add($(this));
          });
        }

        item.data('multidrag', elements);

        helper.append(item.clone()).append(elements.clone());

        setTimeout(function(){
          elements.hide();
        }, 1);

        return helper;
      },
      stop: function (e, info) {
        var dragElements = info.item.data('multidrag');
        if (dragElements.length) {
          dragElements.detach();
          info.item.after(dragElements);
          dragElements.show();
        }
      },
      dragCondition: function(event){
        return true || (event.ctrlKey || event.metaKey);
      }

    });

    //$elements.sortable("destroy");
    $elements.sortable(options);

  };

  return MultiSortable;

});