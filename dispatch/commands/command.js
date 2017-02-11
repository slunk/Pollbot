module.exports = function(regex, handler, usage, description) {
    this.regex = regex;
    this.handler = handler;
    this.usage = usage;
    this.description = description;
}
