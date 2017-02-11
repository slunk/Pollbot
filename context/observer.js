function ContextObserver(key, notify) {
    this.key = key;
    this._notify = notify;
}

ContextObserver.prototype.notify = function(contextId, key, value) {
    if (this.key === key) {
        this._notify(contextId, value);
    }
};

module.exports = ContextObserver;
