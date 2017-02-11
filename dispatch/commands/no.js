var Command = require('./command'),
    Constants = require('../../constants'),
    Context = require('../../context/context'),
    USER_CONTEXT_KEYS = Context.USER_CONTEXT_KEYS,
    CHANNEL_CONTEXT_KEYS = Context.CHANNEL_CONTEXT_KEYS,
    Goodreads = require('../../clients/goodreads');

var handler = function(message, matches, respond) {
    var userContext = Context.getUserContext(message.channel, message.user);
    var channelContext = Context.getChannelContext(message.channel);

    var query = userContext.getAttribute(USER_CONTEXT_KEYS.QUERY);
    var results = userContext.getAttribute(USER_CONTEXT_KEYS.BOOK_SEARCH_RESULTS);
    var idx = userContext.getAttribute(USER_CONTEXT_KEYS.SUGGESTED_BOOK_IDX);
    if (query && results) {
        if (++idx < 2) {
            respond("How about this one? " + Goodreads.getUrl(results[idx]));
            userContext.storeAttribute(USER_CONTEXT_KEYS.SUGGESTED_BOOK_IDX, idx);
        } else {
            userContext.resetContext();
            channelContext.updateAttribute(CHANNEL_CONTEXT_KEYS.NOMINATIONS, function(nominations) {
                nominations.push({
                    query: query,
                });
            }, []);
            respond("Okay, I've added a nomination without a Goodreads link.");
        }
    }
}

module.exports = new Command(
    new RegExp("^\\s*no\\s*$", "i"),
    handler,
    "no",
    "answer the last question I asked"
);
