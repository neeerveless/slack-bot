var fs         = require('fs');
var RtmClient  = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
var token  = config.token || '';

var rtm = new RtmClient(token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(msg) {
  console.log('Message:', msg);
});
