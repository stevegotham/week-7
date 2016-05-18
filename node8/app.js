// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Create Express App Object \\
var app = express();

// Application Configuration \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// create and connect to the database
mongoose.connect('mongodb://localhost/Omega3Studio');
// define the collection and the schema
var Applicant = mongoose.model('Applicant', {
	name: {type: String, required: true},
	bio: {type: String},
	skills: {type: String},
	years: {type: Number},
	why: {type: String}
})

// Routes \\

app.get('/', function(req, res) {
	res.sendFile('html/index.html', {root : './public'});
});
app.get('/applicants', function(req, res){
	res.sendFile('html/applicants.html', {root : './public'});
});
app.get('/success', function(req, res) {
	res.sendFile('html/success.html', {root : './public'});
});

// creates an applicant and saves to database
app.post('/applicant', function(req, res){
	var newApplicant = new Applicant(req.body);
	newApplicant.save();
	res.redirect('/success');
});
// removes the applicant from database
app.post('/delete', function(req, res) {
	Applicant.findByIdAndRemove({_id: req.body.id}, function(err, data) {
		if (err) return res.send("Err : ", err);
		res.send(data);
	})
})
// sends down the applicants collection to be used in Angular
app.get('/applicantsDB', function(req, res){
	Applicant.find({}, function(err, data) {
		if(err) return res.send("Err : ", err);
		res.send(data);
	});
});

// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
