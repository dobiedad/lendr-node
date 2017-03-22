var clientSideConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

function readKey(name) {
  if (name in this) return this[name];
  throw Error('Key ' + name + ' missing from local firebase.json');
}

var overridePath = './firebase.json';
if (require('fs').existsSync(overridePath)) {
  var json = require(overridePath);
  var key = readKey.bind(json);
  var databaseURL = 'https://' + key('project_id') + '.firebaseio.com';
  var storageBucket = key('project_id') + '.appspot.com';
  clientSideConfig = {
    apiKey: json.api_key,
    authDomain: json.project_id + '.firebaseapp.com',
    databaseURL: databaseURL,
    storageBucket: storageBucket
  };
}

module.exports = clientSideConfig
