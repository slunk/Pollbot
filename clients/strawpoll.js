var http = require('http');

var createPoll = function(title, options, dataCallback) {
    var data = JSON.stringify({
        title: title,
        options: options,
        multi: true
    });
    var options = {
        hostname: "www.strawpoll.me",
        path: "/api/v2/polls",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'node-strawpoll'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function() {
            dataCallback(JSON.parse(body));
        });
    });
    req.write(data);
    req.end();
};

var pollUrl = function(poll) {
    return "www.strawpoll.me/" + poll.id;
}

module.exports = {
    createPoll: createPoll,
    pollUrl: pollUrl
};
