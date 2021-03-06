// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3009;

// initialize express
var app = express();

// middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '/public')));

// connect to mongo db
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/e1scrapper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});
console.log("MONGODB_URI", MONGODB_URI);
// mongoose.connect("mongodb://localhost/e1scrapper", {
// 	useMongoClient: true
// });


// handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// ROUTES

// scrape the data from E1
app.get('/', function(req, res) {
	// setTimeout(function() {}, 6000);
  request('http://www.e1.ru/news/spool/section_id-105.html', function(err, response, html) {
		var $ = cheerio.load(html);
    $('header.e1-article__header').each(function(i, element) {

			var result = {};

      var link = $(element).parent().attr("href");
      var title = $(element).children().text();
      var subtitle = $(element).parent().children('p').text();
      var timePosted = $(element).parent().children('.e1-article__tags').children('.e1-article__date-text').text();
			var imageLink = $(element).parent().children('.e1-article__photo').children('.e1-article__img').attr("src");

			result.title = title;
			result.subtitle = subtitle;
			result.link = link;
			result.timePosted = timePosted;
			result.imageLink = imageLink;
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
	res.render('home');
  console.log('Scrape complete');
});

// get all articles
app.get("/articles", function(req, res) {
	db.Article.find({})
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// get a single article by id
app.get("/articles/:id", function(req, res) {
	db.Article.findOne({ _id: req.params.id })
		.populate("notes")
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// update a single article by id
app.post("/articles/:id", function(req, res) {
	db.Note.create(req.body)
		.then(function(dbNote) {
			return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
		})
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(err) {
			res.json(err);
		});
});



//
// app.get('/', function (req, res) {
//     res.render('home');
// });

// start server
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
