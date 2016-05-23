---
title: Encrypting Passwords with Express/Mongoose
type: lesson
duration: "1:25"
creator:
    name: Tony
    city: Boulder
competencies: Programming, Server Applications
---

# Encrypting Passwords with Express/Mongoose

### Objectives
*After this lesson, students will be able to:*

- Create a mongoose-backed User model with email & password
- Recall what encryption is and why it's important
- Generate a salt & encrypt a password
- Find a user based on email & password, and check against an encrypted password to authentication

### Preparation
*Before this lesson, students should already be able to:*

- Create a MVC app with Express
- Create a schema with mongoose and create/read documents

## Refresh Bcrypt and Authentication system - Intro (15 mins)

#### Authentication system

We've already implemented an authentication system in Rails, and the logic is the same in NodeJS. For this lesson, we will re-implement the login and signup logic over an api. In a later lesson, we will use different packages to make the authentication system easy to implement.

For this less, our app will have two routes:

- `POST    /signup`, we will send a password and an email; this will hash the password and save it in the database

- `POST    /login`, same, we send a password and an email and then the server will respond with a message and a http status to indicate if the credentials are right.


#### Bcrypt, hashing refresher

Remember, hashing is when a function is called on a variable - in this case a password - in order to produce a constant-sized output; it being a one-way function, there isn't a function to reverse or undo a hash and calling the function again - or reapplying the hash - isn't going to produce the same output again.

From another [stack post](http://stackoverflow.com/questions/1602776/what-is-password-hashing):

_"Hashing a password will take a clear text string and perform an algorithm on it (depending on the hash type) to get a completely different value. This value will be the same every time, so you can store the hashed password in a database and check the user's entered password against the hash."_

This prevents you from storing the cleartext passwords in the database (bad idea).

Bcrypt is recognized as one of the most secure ways of encrypting passwords because of the per-password salt. Even with it being slower than any other algorithms, a lot of companies still prefer to use bcrypt for security reasons.

#### But wait, what's a salt?

A salt is random data that can be added as additional input to a one-way function, in our case a one-way function that  hashes a password or passphrase. We use salts to defend against dictionary attacks, a technique for "cracking" an authentication mechanism by trying to determine the decryption key.


## Using bcrypt with Express - Codealong (20 mins)

Take the starter-code an unzip it.

First of all, we are going to declare the user model:

* in user.js *

```javascript
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var User = new mongoose.Schema({
    name:  { type: String }
    email: { type: String, required: true,  unique: true },
    password: { type: String, required: true }
});


```

Nothing new here - we declare the fields and their respective types, but we need to make sure that the email is unique, hence the `{unique: true}`.

Now we will create the `signup` route.

In app.js:

```javascript
router.post("/signup", function(req, res) {
  var userObject = new User(req.body.user);

  userObject.save(function(err, user) {
  if(err){
    return res.status(401).send({message: err.errmsg});
  }else{
    return res.status(200).send({message: "user created"});
  }

  });

})

```

Once again, nothing new here: we just create the route handler for the signup and save a user Document based on the params received in the request body; therefore the request body should be something like...

```javascript
"user" :{
     "email"       : "XXXXXX",
     "password"    : "YYYYYY"
   }
```

Great. we can create user by posting to this route.


#### Signup

Now we need to implement the logic to encrypt the email when a user is created.

In `user.js` , we are going to add a Middlewarethat will be executed every time a save action is performed for a user model:

```javascript

User.pre('save', function(next) {

});

```

The code in this function will now be executed for every call to create, save and update.

Inside this method let's add the logic to hash the password:

```javascript
User.pre('save', function(next) {


  // the first arguments corresponds to the number of "salting rounds that will be applied"
  bcrypt.genSalt(5, function(err, salt) {
    //now we use the salt generated
    bcrypt.hash(this.password, salt, function(err, hash) {
      // the method hash will return the password hashed with the salt, we replace the original password attribute with the hashed one
      this.password = hash;
      next();
    });
  });
});

```

Here we are calling two methods to encrypt the password: the first one, `genSalt()` will send a salt token to the callback method; the argument `5` corresponds to the number or round that will be executed when generating a token - the higher the number, the more complex the salt will be.

Now the second method `bcrypt.hash()` will take the original password and hash it with the salt token passed as a second argument. Then the callback receive the hashed password.

We do not need the original password anymore, so we can replace it by the hashed one: `this.password = hash;`  The call to `next()` will now go to the next Middleware or execute the save action.


This logic will work every time a save action is called on a user document, which is an issue, because every time save and update will be called on a user document, the password will be re-hashed; therefore, the original clear password will not correspond to the new hashed password.

So we need to hash the password only when the value of the password is different than the one stored - meaning the user/admin updated this password.  When the document is created, the field is set to null, so if the request contains a string for the password, Mongoose will perform a comparison between the value null and the new value.  Now, this test will work for a new document and for a document that is updated.  


At the start of the Middleware `pre` callback method, add :

```javascript
User.pre('save', function(next) {

  if (!this.isModified('password')) return next();

  ...
```

Now the password will be hashed only when the value changed.

That's all for encoding the password!

## Create a user document with cURL - Independent Practice (5 mins)

To make sure your auth works, try to create a user document using a curl command:

```bash

curl -i -H "Content-Type: application/json" -d '{
  "user" :{
  "email"       : "gerry@ga.co",
  "password"    : "password"
  }

}' http://localhost:3000/users/authenticate

```

#### Setting up the Login - Codealong (15 mins)

For the login, we will add another route `/signin` that will also receive an email and password under the same format than signup:

```javascript
"user" :{
     "email"       : "XXXXXX",
     "password"    : "YYYYYY"
   }
```

But in sign-in, we will perform a search based on the email and then ask bcrypt to compare the value sent in the request and the hashed password stored in mongo:

```javascript

router.post("/signin", function(req, res) {
  var userParams = req.body.user;
  User.findOne({ email: userParams.email }, function(err, user) {

    user.authenticate(userParams.password, function(err, isMatch) {
      if (err) throw err;
      if(isMatch){
        return res.status(200).send({message: "Valid Credentials !"});
      }else{
        return res.status(401).send({message: "the credentials provided do not correspond to a registered user"});


      }

    })
  })
})

```

So the method authenticate (that we need to add in the model) will take the password as an argument and a callback method.  This callback will receive any error that occurred and then a boolean corresponding to wether or not the password is valid. Based on this boolean, the route handler will respond with a different message and a different http status.

Let's write the method `authenticate` in the user model:

```javascript
User.methods.authenticate = function(password, callback) {
  // compare is a bcrypt method that will return a boolean if the first argument once encrypted corresponds to the second argument
  bcrypt.compare(password, this.password, function(err, isMatch) {
      callback(null, isMatch);
  });
};


```

The call to `bcrypt.compare()` will take care of rehashing the password and comparing both versions, sending a boolean to the callback method, and the logic goes back to the route handler.


## Test your auth with a cURL - Independent Practice (5 mins)

You can test this using this curl command:

```javascript

curl -i -H "Content-Type: application/json" -d '{
  "user" :{
  "name"        : "gerry",
  "email"       : "gerry@ga.co",
  "password"    : "password"
  }

}' http://localhost:3000/signin

```

There we go! we've implemented a login system with bcrypt, Mongoose and Express.

## Add validations and explicit messages - You Do (20 mins)

Now try to add detailed error messages:

- When the email is wrong
- When the email is already taken
- Also, try to use a password confirmation using [virtuals](http://mongoosejs.com/docs/2.7.x/docs/virtuals.html) attributes


## Conclusion (5 mins)

This is far from a complete authentication solution, and implementing full authentication logic would takes days and days if it had to be done manually. Luckily for us, tools exists to make developers' lives easier, and we will discover those tools later.

- How does hashing work with salts?
- Why is bcrypt trusted over other algorithms or using decryption keys?
