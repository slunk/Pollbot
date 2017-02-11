var USER_CONTEXT_KEYS = {
    QUERY: "QUERY",
    BOOK_SEARCH_RESULTS: "BOOK_SEARCH_RESULTS",
    SUGGESTED_BOOK_IDX: "SUGGESTED_BOOK_IDX"
};

var CHANNEL_CONTEXT_KEYS = {
    NOMINATIONS: "NOMINATIONS"
};

var contextStorage = {
    channel: {},
    user: {}
};

var channelObservers = [];
var channelSuppliers = [];

function Context(contextStorage, contextId, observers, suppliers) {
    this.contextStorage = contextStorage;
    this.contextId = contextId;
    this.observers = observers;
    this.suppliers = suppliers;
    if (!(contextId in contextStorage)) {
        contextStorage[contextId] = {};
    }
}

Context.prototype.notifyObservers = function(key) {
    var contextStorage = this.contextStorage;
    var contextId = this.contextId;
    this.observers.forEach(function(observer) {
        observer.notify(contextId, key,
                contextStorage[contextId][key]);
    });
};

Context.prototype.storeAttribute = function(key, value) {
    this.contextStorage[this.contextId][key] = value;
    this.notifyObservers(key);
};

Context.prototype.trySupply = function(key) {
    if (!(key in this.contextStorage[this.contextId])) {
        var supplier = this.suppliers.filter(function(supplier) {
            return supplier.canSupply(key);
        })[0];
        if (supplier) {
            var val = supplier.supply(this.contextId, key);
            if (val !== null) {
                this.contextStorage[this.contextId][key] = val;
            }
        }
    }
};

Context.prototype.getAttribute = function(key) {
    this.trySupply(key);
    return this.contextStorage[this.contextId][key];
};

Context.prototype.getAttributeOrDefault = function(key, def) {
    this.trySupply(key);
    if (!(key in this.contextStorage[this.contextId])) {
        this.storeAttribute(key, def);
    }
    return this.getAttribute(key);
};

Context.prototype.updateAttribute = function(key, updateCallback, defaultValue) {
    var value = this.getAttributeOrDefault(key, defaultValue);
    updateCallback(this.contextStorage[this.contextId][key]);
    this.notifyObservers(key);
};

Context.prototype.resetContext = function() {
    this.contextStorage[this.contextId] = {};
};

var getUserContext = function(channel, user) {
    if (!(channel in contextStorage.user)) {
        contextStorage.user[channel] = {};
    }
    return new Context(
            contextStorage.user[channel],
            user,
            [],
            []);
};

var getChannelContext = function(channel) {
    return new Context(
            contextStorage.channel,
            channel,
            channelObservers,
            channelSuppliers);
}

var registerChannelObserver = function(observer) {
    channelObservers.push(observer);
};

var registerChannelSupplier = function(supplier) {
    channelSuppliers.push(supplier);
};

module.exports = {
    getUserContext: getUserContext,
    getChannelContext: getChannelContext,
    registerChannelObserver: registerChannelObserver,
    registerChannelSupplier: registerChannelSupplier,
    USER_CONTEXT_KEYS: USER_CONTEXT_KEYS,
    CHANNEL_CONTEXT_KEYS: CHANNEL_CONTEXT_KEYS
};
