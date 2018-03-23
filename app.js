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
app.get('/all', function(req, res) {
  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('whole database');
      console.log('scrapedData length', found.length);
      res.json(found);
    }
  });
});

// scrape the data from CNN
app.get('/scrape', function(req, res) {
  var scrapeResults = [];
  request('http://www.e1.ru/news/spool/section_id-105.html', function(err, response, html) {
    var $ = cheerio.load(html);
    $('header.e1-article__header').each(function(i, element) {

      var link = $(element).parent().attr("href");
      var title = $(element).children().text();
      var subtitle = $(element).parent().children('p').text();
      var timePosted = $(element).parent().children('.e1-article__tags').children('.e1-article__date-text').text();


      if (title && link) {
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            console.log(err);
          }
          else {
            console.log(inserted);
          }
        });
      }
      console.log("scrapeResults", scrapeResults);

    });
  });

  res.send('Scrape complete');

});



// app.listen(3000);
module.exports = app;
