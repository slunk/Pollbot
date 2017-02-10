var fs = require('fs');

var STORAGE_PATH = "/var/tmp/poll_storage.json";

var load = function() {
    if (!fs.existsSync(STORAGE_PATH)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(STORAGE_PATH));
}

var store = function(nominations) {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(nominations));
}

var clear = function() {
    fs.unlink(STORAGE_PATH, function(err) {
        console.log(err);
    });
}

module.exports = {
    load: load,
    store: store,
    clear: clear
};
