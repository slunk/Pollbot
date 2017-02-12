var Context = require('../../context/context'),
    Duration = require('duration'),
    LAST_INTERACTION_DATE = Context.USER_CONTEXT_KEYS.LAST_INTERACTION_DATE,
    MAX_RESPONSE_MINUTES = require('../../constants').MAX_RESPONSE_MINUTES;

var dateRecordingHandler = function(delegate) {
    return function(message, matches, respond) {
        delegate(message, matches, respond);
        var userContext = Context.getUserContext(message.channel, message.user);
        userContext.storeAttribute(LAST_INTERACTION_DATE, new Date());
    };
};

var responseTimeGatingHandler = function(delegate) {
    return function(message, matches, respond) {
        var userContext = Context.getUserContext(message.channel, message.user);
        var lastInteractionDate = userContext.getAttribute(LAST_INTERACTION_DATE);
        if (!lastInteractionDate || MAX_RESPONSE_MINUTES > new Duration(lastInteractionDate, new Date()).minutes) {
            delegate(message, matches, respond);
        }
    };
};

module.exports = {
    dateRecordingHandler: dateRecordingHandler,
    responseTimeGatingHandler: responseTimeGatingHandler
};
