var Command = require('./command'),
    Constants = require('../../constants'),
    Context = require('../../context/context'),
    USER_CONTEXT_KEYS = Context.USER_CONTEXT_KEYS,
    CHANNEL_CONTEXT_KEYS = Context.CHANNEL_CONTEXT_KEYS,
    Goodreads = require('../../clients/goodreads'),
    Wrappers = require('./handlerWrappers'),
    responseTimeGatingHandler = Wrappers.responseTimeGatingHandler,
    dateRecordingHandler = Wrappers.dateRecordingHandler;

var handler = function(message, matches, respond) {
    var userContext = Context.getUserContext(message.channel, message.user);
    var channelContext = Context.getChannelContext(message.channel);

    var query = userContext.getAttribute(USER_CONTEXT_KEYS.QUERY);
    var results = userContext.getAttribute(USER_CONTEXT_KEYS.BOOK_SEARCH_RESULTS);
    var idx = userContext.getAttribute(USER_CONTEXT_KEYS.SUGGESTED_BOOK_IDX);
    if (query && results) {
        var selectedResult = results[idx];
        userContext.resetContext();
        channelContext.updateAttribute(CHANNEL_CONTEXT_KEYS.NOMINATIONS, function(nominations) {
            nominations.push({
                query: query,
                title: selectedResult.best_book.title,
                link: Goodreads.getUrl(selectedResult),
                user: message.user
            });
        }, []);
        respond("Great, added!");
    }
};

module.exports = new Command(
    new RegExp("^\\s*yes\\s*$", "i"),
    responseTimeGatingHandler(dateRecordingHandler(handler)),
    "yes",
    "answer the last question I asked"
);
