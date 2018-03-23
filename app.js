var express = require('express');
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


 
app.get('/', function (req, res) {
    res.render('home');
});
 
// app.listen(3000);
module.exports = app;