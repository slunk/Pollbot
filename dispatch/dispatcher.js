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
    for (var i = 0; i < commands.length; i++) {
        var matches = commands[i].regex.exec(message.text);
        if (matches) {
            commands[i].handler(message, matches, respond);
            break;
        }
    }
};

module.exports = {
    handle: handle
};
