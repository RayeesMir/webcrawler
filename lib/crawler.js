var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var EventEmitter = require('events');
var eventEmitter = new events.EventEmitter();


function Crawler(url, limit) {
    this.url = url;
    this.limit = limit;
}

Crawler.prototype.pageCollector = function (url, callback) {
    return new Promise(function () {
        request(url, function (error, response, body) {
            if (error) {
                console.log(error);
                if (typeof callback == 'function')
                    return callback(error);
            }
            if (typeof callback == 'function')
                return callback(null, response, body);
            resolve([response, body]);
        })
    });
};
Crawler.prototype.linkCollector = function (url) {
    var self = this;
    var links = [];
    this.pageCollector(url)
        .then(function (data) {
            var res = data[0];
            var body = data[1];
            if (res.statusCode == 200)
                var $ = cheerio.load(body);
            var ablinks = $("a[href^=" + self.url + "]");
            ablinks.forEach(function () {
                links.push($(this).attr('href'))
            })
        })
        .catch(function (e) {
            console.log(e);
        })
};
