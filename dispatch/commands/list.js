var Command = require('./command'),
    Constants = require('../../constants'),
    Context = require('../../context/context'),
    CHANNEL_CONTEXT_KEYS = Context.CHANNEL_CONTEXT_KEYS;

var handler = function(message, matches, respond) {
    var channelContext = Context.getChannelContext(message.channel);
    var nominations = channelContext.getAttribute(CHANNEL_CONTEXT_KEYS.NOMINATIONS) || [];
    var toSend = "Here are the current nominations in <#" + message.channel + ">:\n";
    nominations.forEach(function(nomination) {
        var title = nomination.title || nomination.query;
        toSend += "\u2022 " + title;
        if (nomination.link) {
            toSend += " (" + nomination.link + ")";
        }
        if (nomination.user) {
            toSend += " -- <@" + nomination.user + ">";
        }
        toSend += "\n";
    });
    respond(toSend);
};

module.exports = new Command(
    new RegExp("^\\s*" + Constants.BOT_USER_ID + "\\s+list\\s*$"),
    handler,
    "@pollbot list",
    "list the current nominations in a channel"
);
