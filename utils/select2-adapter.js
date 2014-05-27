define([
  'utils/locale',
  'select2',
  'moment'
], function(locale, select2, moment) {

  moment.lang(locale);

  switch(locale) {
    case 'en':
      // do nothing, it is already in en
      break;
    case 'ru':
    default:
      // load translation for plugin
      // just copied the contents of the file
      // because after r.js compilation it select2 will always
      // have everything in russian
      $.extend($.fn.select2.defaults, {
        formatNoMatches: function () { return "Совпадений не найдено"; },
        formatInputTooShort: function (input, min) { return "Пожалуйста, введите еще" + character(min - input.length); },
        formatInputTooLong: function (input, max) { return "Пожалуйста, введите на" + character(input.length - max) + " меньше"; },
        formatSelectionTooBig: function (limit) { return "Вы можете выбрать не более " + limit + " элемент" + (limit%10 == 1 && limit%100 != 11 ? "а" : "ов"); },
        formatLoadMore: function (pageNumber) { return "Загрузка данных…"; },
        formatSearching: function () { return "Поиск…"; }
      });

      function character (n) {
        return " " + n + " символ" + (n%10 < 5 && n%10 > 0 && (n%100 < 5 || n%100 > 20) ? n%10 > 1 ? "a" : "" : "ов");
      }
  }

  return select2;
});