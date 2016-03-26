var SlackApi = require('slack-api');

Slack = function(config) {
  this.config = config;

  this.postMessage = function(args) {
    var options = {
      token: this.config.token,
      channel: this.fetchChannel(args.shift())||this.config.channel,
      text: args.join(' '),
      username: this.config.username,
      icon_url: this.config.icon_url
    };
  
    SlackApi.chat.postMessage(options, function (error, data) {});
  };

  this.fetchChannel = function(channel) {
    var reg = new RegExp('^<#(.*)>$');
    return (reg.exec(channel)||[])[1]||channel;
  };
}

module.exports = Slack;
