const JA = 'JA';
const EN = 'EN';

Excite = function() {
  this.client = require('cheerio-httpcli');

  this.translation_jp = function(text, callback) {
    this.translation(JA, EN, text, callback);
  };

  this.translation_en = function(text, callback) {
    this.translation(EN, JA, text, callback);
  };

  this.translation = function(before_lang, after_lang, text, callback) {
    this.client.fetch('http://www.excite.co.jp/world/')
    .then(function (result) {
        return result.$('#formTrans').submit({
          before_lang: before_lang,
          after_lang: after_lang,
          before: text
        });
    })
    .then(function (result) {
      callback(result.$('#after').val());
    });
  };
}

module.exports = Excite;
