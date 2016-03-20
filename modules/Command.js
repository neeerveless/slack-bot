var Slack = require('slack-api');
const POST_MESSAGE = 'post';

Command = function(config, text) {
  this.config = config;
  this.prefix = config.prefix;
  this.text   = text;
}

Command.prototype.isCommand = function() {
  var reg = new RegExp('^'+this.prefix);
  return reg.test(this.text);
};

Command.prototype._fetchCommand = function() {
  var reg = new RegExp('^'+this.prefix+' +(.*)');
  return (reg.exec(this.text)||[])[1]||null;
};

Command.prototype.parse = function() {
  var textWithoutPrefix = this._fetchCommand();
  var parsedCommand     =
    textWithoutPrefix.split(' ').filter(function(x){return !!x});

  if (parsedCommand.lengt < 1) return false;
  
  this.command = parsedCommand.shift();
  this.args    = parsedCommand;

  return true;
};

Command.prototype.exec = function() {
  switch (this.command) {
    case POST_MESSAGE :
      postMessage(this.config, this.args);
      break;
  }
};

var postMessage = function(config, text) {
  var options = {
    token: config.token,
    channel: config.channel,
    text: text,
    username: 'BOT'
  };
  Slack.chat.postMessage(options, function (error, data) {
    // console.log(data);
  });
}

module.exports = Command;
