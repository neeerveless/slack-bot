var Slack  = require('../modules/Slack');
var Excite = require('../modules/Excite');

const POST_MESSAGE   = 'post';
const TRANSLATION_JP = 'ja';
const TRANSLATION_EN = 'en';

Command = function(config, text) {
  this.config = config;
  this.prefix = config.prefix;
  this.text   = text;

  this.slack  = new Slack(this.config);
  this.excite = new Excite();

  this.isCommand = function() {
    var reg = new RegExp('^'+this.prefix);
    return reg.test(this.text);
  };
  
  this.fetchCommand = function() {
    var reg = new RegExp('^'+this.prefix+' +(.*)');
    return (reg.exec(this.text)||[])[1]||null;
  };
  
  this.parse = function() {
    var textWithoutPrefix = this.fetchCommand();
    var parsedCommand     =
      textWithoutPrefix.split(' ').filter(function(x){return !!x});
  
    if (parsedCommand.lengt < 1) return false;
    
    this.command = parsedCommand.shift();
    this.args    = parsedCommand;
  
    return true;
  };
  
  this.exec = function() {
    switch (this.command) {
      case POST_MESSAGE :
        this.slack.postMessage(this.args);
        break;
      case TRANSLATION_JP :
        var result = this.excite.translation_jp(this.args.join(' '), this.callback.bind(this));
        break;
      case TRANSLATION_EN :
        var result = this.excite.translation_en(this.args.join(' '), this.callback.bind(this));
        break;
    }
  };

  this.callback = function(result) {
    this.slack.postMessage([this.config.channel, result]);
  };
}

module.exports = Command;
