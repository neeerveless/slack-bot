var Slack  = require('../modules/Slack');

const POST_MESSAGE   = 'post';

Command = function(config, text) {
  this.config = config;
  this.prefix = config.prefix;
  this.text   = text;

  this.slack  = new Slack(this.config);

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
    }
  };
}

module.exports = Command;
