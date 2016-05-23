// requires and variables
var express    = require('express');
var bodyParser = require('body-parser');
var logger     = require('morgan');
var mongoose   = require('mongoose');
var app        = express();

// -=-=-=-=-=-=-=-=-=-=-=
// middleware
app.use(logger('dev'));
app.use(bodyParser({urlExtended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// -=-=-=-=-=-=-=-=-=-=-=
// routes
app.get('/countries', function(req, res) {
  console.log(res.body)
  res.json('countries.json');
});

// -=-=-=-=-=-=-=-=-=-=-=
// create server and listen on port
app.listen(3000, function(err) {
  if (err) console.log(`Shit...`, err);
  console.log(`Server listening on port: 3000`);
});

// -=-=-=-=-=-=-=-=-=-=-=
