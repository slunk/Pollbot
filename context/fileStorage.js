var fs = require('fs'),
    Observer = require('./observer'),
    Supplier = require('./supplier');

var STORAGE_PATH_PREFIX = "/var/tmp/";

var getFilePath = function(contextId, key) {
    return STORAGE_PATH_PREFIX +  contextId + "." + key + ".json";
};

var getFileStorageObserver = function(key) {
    return new Observer(key, function(contextId, value) {
        fs.writeFileSync(getFilePath(contextId, key), JSON.stringify(value));
    });
}

var getFileStorageSupplier = function(key) {
    return new Supplier(key, function(contextId) {
        var path = getFilePath(contextId, key);
        if (!fs.existsSync(path)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(path));
    });
}

module.exports = {
    getFileStorageObserver: getFileStorageObserver,
    getFileStorageSupplier: getFileStorageSupplier
};
