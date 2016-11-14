var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var EventEmitter = require("events").EventEmitter;


function
Crawler(url, current, concurrent) {
    this.url = url;
    if (typeof concurrent == 'number')
        this.RequestQueue = new Array(concurrent);
    else
        this.RequestQueue = new Array(5);
    this.links = [];
    this.current = current;
}
Crawler.prototype.init = function () {
    var self = this;
    self.pageCollector(self.url)
        .then(function (data) {
            self.linkCollector(data)
        })
        .catch(function (e) {
            console.log(e)
        })
};
Crawler.prototype.pageCollector = function (url, callback) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                if (typeof callback == 'function')
                    return callback(error);
                reject(error);
            }
            if (typeof callback == 'function')
                return callback(null, response, body);
            resolve([response, body]);
        })
    });
};
Crawler.prototype.linkCollector = function (data) {
    var self = this;
    var res = data[0];
    var body = data[1];
    var url;
    if (this.current)
        url = this.url;
    else
        url = 'http';
    if (res.statusCode == 200) {
        var $ = cheerio.load(body);
        var linksInsidePage = $("a[href^='" + url + "']");
        linksInsidePage.each(function (index, link) {
            self.links.push(link.attribs.href);
        });
    }
};
Crawler.prototype.executor = function () {

};
module.exports = Crawler;