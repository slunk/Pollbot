var RtmClient = require('@slack/client').RtmClient,
    RTM_EVENTS = require('@slack/client').RTM_EVENTS;
    Context = require('./context/context'),
    NOMINATIONS = Context.CHANNEL_CONTEXT_KEYS.NOMINATIONS,
    FileStorage = require('./context/fileStorage'),
    Dispatcher = require('./dispatch/dispatcher');

var token = process.env.SLACK_API_TOKEN || ''; //see section above on sensitive data

Context.registerChannelObserver(FileStorage.getFileStorageObserver(NOMINATIONS));
Context.registerChannelSupplier(FileStorage.getFileStorageSupplier(NOMINATIONS));

var rtm = new RtmClient(token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    try {
        Dispatcher.handle(message, function(response) {
            rtm.sendMessage("<@" + message.user + "> " + response, message.channel);
        });
    } catch (err) {
        console.log(err.stack);
        rtm.sendMessage("Something went wrong", message.channel);
    }
});
