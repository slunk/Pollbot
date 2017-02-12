var Command = require('./command'),
    Constants = require('../../constants'),
    Context = require('../../context/context'),
    NOMINATIONS = Context.CHANNEL_CONTEXT_KEYS.NOMINATIONS,
    Strawpoll = require('../../clients/strawpoll');

var handler = function(message, matches, respond) {
    var channelContext = Context.getChannelContext(message.channel);
    var nominations = channelContext.getAttributeOrDefault(NOMINATIONS, []);
    if (nominations.length > 1) {
        Strawpoll.createPoll("Page Turners Poll",
            nominations.map(function(nomination) {
                var title = nomination.title || nomination.query;
                var link = nomination.link;
                return link ? title + " -- " + link : title;
            }),
            function (poll) {
                respond("Poll created! Visit it here: "
                        + Strawpoll.pollUrl(poll));
            });
        channelContext.storeAttribute(NOMINATIONS, []);
    } else {
        respond("Sorry, I need more than one nomination to make a poll.")
    }
};

module.exports = new Command(
    new RegExp("^\\s*" + Constants.BOT_USER_ID + "\\s+create\\s*$", "i"),
    handler,
    "@pollbot create",
    "create a poll from the current nominations in a channel"
);
