var express  = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('users', ['users']);
var bodyParser = require('body-parser');


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


app.get('/contactlist', function (req, res) {
  console.log('I received a GET request');

  db.users.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});


app.route('/name/:name/date/:date').get(function(req, res){
  console.log('name je prosao');
  var name = req.params.name;
  var date = req.params.date;
  console.log(name);
  console.log(date);
  db.users.find({name:name}, function(err, docs){
    res.json(docs);
  });
});

app.route('/friend/:friend').get(function(req, res){
  var friend = req.params.friend;
  db.users.find({name:friend}, function(err, docs){
    res.json(docs);
  });
});


app.route('/date/:date').get(function(req, res){
  console.log('date je prosao');
  var date = req.params.date;
  db.users.find({date:date}, function(err, docs){
    res.json(docs);
  });
  console.log(date);
});


app.post('/users', function (req, res) {
  console.log(req.body);
  db.users.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/users/:id', function(req, res){
  var id = req.params.id;
  db.users.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

app.put('/users/:id/name/:name', function(req, res){
  var id = req.params.id;
  var name = req.params.name;
  console.log(id);
  console.log(name);
  db.users.findAndModify({query: {_id: mongojs.ObjectId(id)},
  update: {$set: {pendingFriendReqName: name, pendingFriendReqID: id}},
  new: true},
  function (err, doc){
    res.json(doc);
  });
});

app.put('/accepted/:id/name/:name', function(req, res){
  var id = req.params.id;
  var name = req.params.name;
  console.log(id);
  db.users.findAndModify({query: {_id: mongojs.ObjectId(id)},
  update: {$addToSet: {friendListId: id, friendListName: name}, $set: {pendingFriendReqName: null, pendingFriendReqID: null}},
  new: true},
  function (err, doc){
    res.json(doc);
  });
});

app.put('/rejected/:id/name/:name', function(req, res){
  var id = req.params.id;
  var name = req.params.name;
  db.users.findAndModify({query: {_id: mongojs.ObjectId(id)},
  update: {$set: {pendingFriendReqName: null, pendingFriendReqID: null}},
  new: true},
  function (err, doc){
    res.json(doc);
  });
});

app.listen(3000);
