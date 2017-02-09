var Constants = require('./constants');
var Nominations = require('./nominations');
var Strawpoll = require('./strawpoll');

var nomCommand = new RegExp(Constants.BOT_USER_ID + "\\s+nom\\s+(.*)");
var createCommand = new RegExp(Constants.BOT_USER_ID + "\\s+create");
var helpCommand = new RegExp(Constants.BOT_USER_ID + "\\s+help");

var nomHandler = function(message, matches, respond) {
    Nominations.addNomination(matches[1]);
    respond("Okay, added!");
};

var createHandler = function(message, matches, respond) {
    var nominations = Nominations.getNominations();
    if (nominations.length > 1) {
        Strawpoll.createPoll("Page Turners Poll",
            nominations,
            function (poll) {
                respond("Poll created! Visit it here: " + Strawpoll.pollUrl(poll));
            });
        Nominations.clearNominations();
    } else {
        respond("Sorry, I need more than one nomination to make a poll.")
    }
};

var helpHandler = function(message, matches, respond) {
    var toSend = "Here are the commands I support:\n";
    commands.forEach(function(command) {
        toSend += "* \"" + command.usage + "\" (" + command.description + ")\n"
    });
    respond(toSend);
}

var commands = [
    {
        regex: nomCommand,
        handler: nomHandler,
        usage: "@pollbot nom <book title>",
        description: "add a nomination to the next poll"
    },
    {
        regex: createCommand,
        handler: createHandler,
        usage: "@pollbot create poll",
        description: "create a poll"
    },
    {
        regex: helpCommand,
        handler: helpHandler,
        usage: "@pollbot help",
        description: "displays this message"
    },
];

var handle = function(message, respond) {
    commands.forEach(function(command) {
        var matches = command.regex.exec(message);
        if (matches) {
            command.handler(message, matches, respond);
        }
    });
};

module.exports = {
    handle: handle
};
