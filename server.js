// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var mongoose = require("mongoose");
var request = require("request");

var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3009;

// initialize express
var app = express();

// middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '/public')));

// connect to mongo db
mongoose.Promise = Promise;
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/e1scrapper";
//
// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.connect(MONGODB_URI, {
//   // useMongoClient: true
// });
mongoose.connect("mongodb://localhost/e1scrapper", {
	useMongoClient: true
});

// ROUTES
app.get("/articles", function(req, res) {

});

// scrape the data from E1
app.get('/scrape', function(req, res) {
  request('http://www.e1.ru/news/spool/section_id-105.html', function(err, response, html) {
		var $ = cheerio.load(html);
    $('header.e1-article__header').each(function(i, element) {

			var result = {};

      var link = $(element).parent().attr("href");
      var title = $(element).children().text();
      var subtitle = $(element).parent().children('p').text();
      var timePosted = $(element).parent().children('.e1-article__tags').children('.e1-article__date-text').text();

			result.title = title;
			result.subtitle = subtitle;
			result.link = link;
			result.timePosted = timePosted;

			// console.log("result", result);

			db.Article.create(result)
				.then(function(dbArticle) {
					console.log(dbArticle);
				})
				.catch(function(err) {
					console.log(err);
				});

    });
  });
  res.send('Scrape complete');
});


app.listen(PORT, function() {
	console.log("=================================");
	console.log("=================================");
	console.log("=================================");
	console.log("****App running on port " + PORT + "****");
	console.log("=================================")
	console.log("=================================");
	console.log("=================================");
});

// var app = require('./app');
// const PORT = process.env.PORT || 3008;
//
// app.listen(PORT, () => {
// 	console.log('=========================Server running on port: ' + PORT + '=========================');
// });
