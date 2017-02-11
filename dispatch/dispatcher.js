var Command = require('./commands/command'),
    Constants = require('../constants');

var helpHandler = function(message, matches, respond) {
    var toSend = "Here are the commands I support:\n";
    commands.forEach(function(command) {
        toSend += "* \"" + command.usage + "\" (" + command.description + ")\n"
    });
    respond(toSend);
};

var commands = [
    require('./commands/nominate'),
    require('./commands/create'),
    require('./commands/yes'),
    require('./commands/no'),
    new Command(
        new RegExp("^\\s*" + Constants.BOT_USER_ID + ".*$", "i"),
        helpHandler,
        "@pollbot help",
        "displays this message"
    )
];

var handle = function(message, respond) {
    commands.forEach(function(command) {
        var matches = command.regex.exec(message.text);
        if (matches) {
            command.handler(message, matches, respond);
            return;
        }
    });
};

module.exports = {
    handle: handle
};
