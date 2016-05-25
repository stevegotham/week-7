var express = require('express'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    bodyParser= require('body-parser'),
    app = express(),
    port = 3000,
    bcrypt = require('bcryptjs'),
    cookieParser = require('cookie-parser'),
    jwt = require('jsonwebtoken'),
    mySpecialSecret = "boom"


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(__dirname+'/public'));
    app.use(logger("dev"));
    app.use(cookieParser());
    mongoose.connect('mongodb://localhost/users');
// user model and schema
var userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    password: String
});
// hash the password and save
userSchema.pre('save', function(next) {
  var user = this
  var hashPassword = bcrypt.hashSync(user.password, 8)
  user.password = hashPassword
  next()
})
// add method to userSchema to validate password
userSchema.methods.authenticate = function(userPassword) {
  var user = this
  console.log(userPassword)
  return bcrypt.compareSync(userPassword, user.password)
};

// create users database
var User = mongoose.model('User', userSchema);

// -=-=-=-=-=-=-=-=-=-=
// routes
    app.post('/signup', function(req, res) {
      var user = new User(req.body);
      user.save(function(err, user) {
        if (err) {
          res.json(err);
        }
        else {
          res.json(user);
        }
      });
    });
    app.post('/login', function(req, res) {
      User.findOne({username: req.body.username}, function(err, user) {
        if (err) res.json(err)
        else if (user) {
          if (user.authenticate(req.body.password)) {
            // cookies/sessions
            // var userSessionID = Math.random()
            // res.cookie('userSessionID', userSessionID, {httpOnly: true})
            // res.json({message: 'You have logged in!', success: true})

            // tokens
            var token = jwt.sign({
              name: user.username
              }, mySpecialSecret, {
                expiresIn: 1440
              });
            // Send back a success message with the JWT
            res.json({
              success: true,
              message: 'YOU get a token! YOU get a token! YOU get a token!',
              token: token
            })
          }
          else {
            res.json({message: 'Your password does not match :(', success: false})
          }
        }
        else {
          res.json({message: 'Could not find user:', success: false})
        }
      })
    })
    app.get('/api/friends', authorize, function(req, res) {
      var friends = ['Batman', 'Donald Trump', 'Snoopy', 'Kanye West']
      res.json({friends: friends, user: req.decoded.name})
    })

    function authorize(req, res, next) {
      // session/cookies
      // if (req.cookies.userSessionID) {
      //   next()
      // } else {
      //   res.json({message: 'Please log in to view that page'})
      // }

      //  tokens
      var token = req.body.token || req.param('token') || req.headers['x-access-token']

      if(token){
        jwt.verify(token, mySpecialSecret, function(err, decoded){
          if(err){
            return res.status(403).send({success:false, message:"can't authenticate token"})
          //		- if it CAN be decoded, save the decoded token to the request, and we'll keep processing the request
          } else {
            req.decoded = decoded;
            next()
          }
        })
      } else {
        // 3 - If we can't find a token at all, we'll just send back an error message
        return res.status(403).send({success: false, message: "no token provided"})
      }
    }
// -=-=-=-=-=-=-=-=-=-=
    app.listen(port)
