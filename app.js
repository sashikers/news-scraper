// require express
var express = require('express');
// initialize request
var app = express();

// middleware
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '/public')));

// handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// scraper dependencies
var mongojs = require('mongojs');
var request = require('request');
var cheerio = require('cheerio');

// database config
var databaseUrl = 'scraper';
var collections = ['scrapedData'];

var db = mongojs(databaseUrl, collections);
db.on('error', function(error) {
  console.log('Database error: ', error);
});

// ROUTES
// renders home page with handlebars
app.get('/', function (req, res) {
    res.render('home');
});

// retrieves data from the database

// scrape the data from CNN
app.get('/scrape', function(req, res) {
  var scrapeResults = [];
  request('http://www.e1.ru/news/spool/section_id-105.html', function(err, response, html) {
    var $ = cheerio.load(html);
    $('header.e1-article__header').each(function(i, element) {
      // var title = $(element).children().children().text();
      // var link = $(element).children().attr('href');

      var link = $(element).parent().attr("href");
      var title = $(element).children().text();

      scrapeResults.push({
        title: title,
        link: link
      });

      console.log("scrapeResults", scrapeResults);
    });
  });

  res.send('Scrape complete');

});



// app.listen(3000);
module.exports = app;
