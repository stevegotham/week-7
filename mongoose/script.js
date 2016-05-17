var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/BaskinRobbins');

var iceSchrema = mongoose.Schema({
  flavor      :  {type: String},
  color       :  {type: String},
  toppings    :  {type: Array, default: []},
  name        :  {type: String},
  ingredients :  {type: Array, default: []},
  price       :  {type: Number},
});

var IceCream = mongoose.model('IceCream', iceSchrema);
// 'IceCream' will become 'icecreams' collection in mongodb shell

var myIceCream = {
  flavor      :  'Bubblegum',
  color       :  'Pink',
  toppings    :  ['pop rocks', 'nuts', 'sprinkles'],
  name        :  'Bubbleicious',
  ingredients :  ['ice cream', 'bubbles', 'xantham gum'],
  price       :  8.23,
};

var newIce = new IceCream(myIceCream);
newIce.save(function(err, doc) {
  console.log('Err : ', err);
  console.log('Doc : ', doc);
});

IceCream.find({name: "Bubbleicious"}, function(err, icecreams) {
  console.log('Err: ', err);
  console.log('From the db: ', icecreams)
})
