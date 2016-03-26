const LOGIN_URL     = 'https://www1.j-motto.co.jp/fw/dfw/po80/portal/jsp/J10201.jsp?https://www1.j-motto.co.jp/fw/dfw/gws/cgi-bin/aspioffice/iocjmtgw.cgi?cmd=login';
const TO_URL        = '?https://www1.j-motto.co.jp/fw/dfw/gws/cgi-bin/aspioffice/iocjmtgw.cgi?cmd=login';
const SCHDAY_URL    = 'https://gws48.j-motto.co.jp/cgi-bin/JM0302814/dneo.cgi?cmd=schindex#cmd=schday';
const INVALID_LOGIN = 'ログインが無効となりました。再度ログインしてください。';
const VALID_LOGIN   = '接続中です。しばらくお待ちください・・・';

Jmotto = function(config) {
  this.config = config;
  this.client = require('cheerio-httpcli');

  this.login = function() {
    return new Promise((function(resolve, reject) {
      this.client.fetch(LOGIN_URL)
      .then((function (result) {
        return result.$('form[name=form]').submit(this.config.jmotto_login_info);
      }).bind(this))
      .then(function (result) {
        return result.$('form[name=hiddenParam]').submit({TO_URL: TO_URL});
      })
      .then(function (result) {
        return result.$('form[name=hiddenParam]').submit({});
      })
      .then(function (result) {
        return result.$('form[name=hiddenParam]').submit({});
      })
      .then(function (result) {
        if (result.error) { reject(result.error); return; }
        resolve();
      });
    }).bind(this));
  };

  this.today = function() {
    return new Promise((function(resolve, reject) {
      this.client.fetch(SCHDAY_URL)
      .then((function (result) {
        if (result.$('.co-message span').text() === INVALID_LOGIN) {
          this.login()
          .then((this.today).bind(this));
        }else{
          var reg  = new RegExp('var jsonRestLogin=\n(.*);\n');
          var json = (reg.exec(result.body)||[])[1]||null;
          var schedule = this.makeTodaySchedule(json);
        }
      }).bind(this));
    }).bind(this));
  };

  this.makeTodaySchedule = function(json) {
    var jsonObj = JSON.parse(json);
    console.log(jsonObj.slist.item);
    var result = [];
    jsonObj.slist.item.forEach(function(e, i, a){
      var date = new Date();
      // if (e.startdate !== date.toLocaleDateString().replace(/-/g, '')) return;

      var startTime = e.starttime.replace(/(\d{2})(?=\d{2})/g, "$1:");
      var endTime = e.endtime.replace(/(\d{2})(?=\d{2})/g, " ~ $1:");
      result.push(`${startTime}${endTime} ${e.detail}`);
    });

    return result.join('\n');
  };
}

module.exports = Jmotto;
