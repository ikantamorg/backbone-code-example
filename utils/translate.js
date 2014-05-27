define([
  'utils/locale',
  'underi18n',
  'text!i18n/ru.json',
  'text!i18n/en.json'
],
function(locale, _i18n, ruJson, enJson) {

  _i18n.templateSettings = {
    translate: /<@_([\s\S]+?)@>/g,
    i18nVarLeftDel: '<%=',
    i18nVarRightDel: '%>'
  };

  var dictionary = {};
  switch(locale) {
    case 'en':
      dictionary = enJson;
      break;
    case 'ru':
    default:
      dictionary = ruJson;
  }

  var translate = {

    factory: _i18n.MessageFactory(JSON.parse(dictionary)),

    template: function(contents) {
      return _i18n.template(contents, this.factory);
    },

    it: function(alias) {
      return this.factory(alias);
    }

  };

  return translate;
});