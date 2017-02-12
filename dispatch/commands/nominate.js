var Command = require('./command'),
    Constants = require('../../constants.js'),
    Context = require('../../context/context'),
    USER_CONTEXT_KEYS = Context.USER_CONTEXT_KEYS,
    CHANNEL_CONTEXT_KEYS = Context.CHANNEL_CONTEXT_KEYS,
    Goodreads = require('../../clients/goodreads'),
    dateRecordingHandler = require('./handlerWrappers').dateRecordingHandler;;

var handler = function(message, matches, respond) {
    var query = matches[1];
    var userContext = Context.getUserContext(message.channel, message.user);
    userContext.storeAttribute(USER_CONTEXT_KEYS.QUERY, query);
    Goodreads.getBooks(query, function(results) {
        if (results.length > 0) {
            userContext.storeAttribute(USER_CONTEXT_KEYS.BOOK_SEARCH_RESULTS, results);
            userContext.storeAttribute(USER_CONTEXT_KEYS.SUGGESTED_BOOK_IDX, 0);
            respond("Is this the book you're thinking of? "
                    + Goodreads.getUrl(results[0]));
        } else {
            var channelContext = Context.getChannelContext(message.channel);
            channelContext.updateAttribute(CHANNEL_CONTEXT_KEYS.NOMINATIONS, function(nominations) {
                nominations.push({
                    query: query,
                    user: message.user
                });
            }, []);
            respond("I couldn't find the book you were looking for, but I've added a nomination without a Goodreads link.");
        }
    });
};

module.exports = new Command(
    new RegExp("^\\s*" + Constants.BOT_USER_ID + "\\s+nom\\s+(.*)$", "i"),
    dateRecordingHandler(handler),
    "@pollbot nom <book title>",
    "add a nomination to the next poll for the current channel"
);
