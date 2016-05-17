// routes.js
var router = require('express').Router();
var userCtrl = require('./controllers/users.js')
// user routes
router.route('/users')
  .post(userCtrl.create)   // create
  .get(userCtrl.find)    // read

router.route('users/:id')
  .post(userCtrl.update)   // update
  .delete(userCtrl.delete) // destroy

module.exports = router
