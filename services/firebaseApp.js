var firebase = require("firebase");

// if (window.__env && window.__env.firebaseConfig) {
//   app = firebase.initializeApp(window.__env.firebaseConfig);
//   console.log('env')
// } else {
  var config = require("../firebaseConfig")
  app = firebase.initializeApp(config);
// }

app.getCurrentUserId = function() {
  var user = app.auth().currentUser;
  return user ? user.uid : null;
};

app.isOnline = function() {
  var connectedRef = firebase.database().ref('.info/connected');
  return connectedRef.once('value')
    .then(function(snapshot) {
      return snapshot.val();
    });
};

app.checkAuthenticated = function() {
  return new Promise(function(resolve) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

module.exports = app;
