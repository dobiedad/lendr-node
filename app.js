var express = require('express');
var app = express();
var path = require('path');
var config = require("./firebaseConfig")

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/privacy', function (req, res) {
  res.sendFile(__dirname + '/public/privacy.html');
});

app.listen(process.env.PORT || 1234, function () {
  console.log('listening on port 1234!');
});

app.get('/env.js', function(req, res) {
  var env = {
    firebaseConfig: config
  };
  res.status(200).send('window.__env = ' + JSON.stringify(env) + ';');
});
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
