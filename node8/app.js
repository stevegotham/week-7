// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Create and connect to the database
mongoose.connect('mongodb://localhost/Omega3Studio');
var Applicant = mongoose.model('Applicant', {
	name: {type: String, required: true},
	bio: {type: String},
	skills: {type: String},
	years: {type: Number},
	why: {type: String}
})
// Create Express App Object \\
var app = express();

// Application Configuration \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes \\

app.get('/', function(req, res) {
	res.sendFile('html/index.html', {root : './public'});
});

// displays a list of applicants
app.get('/applicants', function(req, res){
	res.sendFile('html/applicants.html', {root : './public'});
});
app.get('/applicantsDB', function(req, res){
	Applicant.find({}, function(err, data) {
		if(err) return res.send("Err: ", err);
		res.send(data);
	});
});
app.get('/success', function(req, res) {
	res.sendFile('html/success.html', {root : './public'});
});


app.post('/delete', function(req, res) {
	Applicant.findByIdAndRemove({_id: req.body.id}, function(err, data) {
		res.send(data);
	})
})


// creates and applicant
app.post('/applicant', function(req, res){
	// Here is where you need to get the data
	// from the post body and store it in the database
	var newApplicant = new Applicant(req.body);
	newApplicant.save();
	res.redirect('/success');
});
// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
