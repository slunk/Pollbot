var WebClient = require('@slack/client').WebClient;
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var Dispatcher = require('./dispatcher');

var token = process.env.SLACK_API_TOKEN || ''; //see section above on sensitive data

var rtm = new RtmClient(token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    try {
        Dispatcher.handle(message.text, function(response) {
            rtm.sendMessage(response, message.channel);
        });
    } catch (err) {
        rtm.sendMessage("Something went wrong", message.channel);
    }
});
