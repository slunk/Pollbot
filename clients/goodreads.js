var http = require('http');
var parseString = require('xml2js').parseString;

var KEY = process.env.GOODREADS_KEY;

var getBooks = function(query, handleResponse) {
    var options = {
        hostname: "www.goodreads.com",
        path: "/search/index.xml?key=" + KEY + "&q=" + encodeURIComponent(query),
        method: "GET"
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function() {
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: true
            }, function(err, result) {
                handleResponse(result.GoodreadsResponse.search.results.work || []);
            });
        });
    });
    req.end();
};

var getUrl = function(result) {
    return "https://www.goodreads.com/book/show/" + result.best_book.id;
};

module.exports = {
    getBooks: getBooks,
    getUrl: getUrl
}
