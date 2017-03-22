var firebase = require("firebase");

function AuthService(firebaseApp) {
  this.firebaseApp = firebaseApp
}

AuthService.prototype.signIn = function () {
  var self = this;
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email')
  return this.firebaseApp.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;

    var user = {
      fbid:result.user.providerData[0].uid,
      email:result.user.email,
      name:result.user.displayName,
      img:result.user.photoURL
    }
    console.log(result.user)
    return self.createUser(user)
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
};

AuthService.prototype.createUser = function (user) {
  var self = this;

  return this.firebaseApp.database().ref('users/' + user.fbid).set(user)
    .then(function () {
      return self.mapToFbId(user)
    })
};

AuthService.prototype.checkAuthenticated = function () {
  var self = this;
  return this.firebaseApp.checkAuthenticated()
};

AuthService.prototype.loadMyProfile = function () {
  var self = this;
    console.log( this.firebaseApp.getCurrentUserId())
  return this.firebaseApp.database().ref('firebaseIds/' + this.firebaseApp.getCurrentUserId()).once('value')
    .then(function (snapshot) {

      return self.loadUserWithFbid(snapshot.val())
    })
};

AuthService.prototype.loadUserWithFbid = function (fbid) {
  return this.firebaseApp.database().ref('users/' + fbid).once('value')
    .then(function (snapshot) {
      return snapshot.val()
    })
};

AuthService.prototype.mapToFbId = function (user) {
  return this.firebaseApp.database().ref('firebaseIds/' + this.firebaseApp.getCurrentUserId()).set(user.fbid)
    .then(function () {
      return user
    })
};



module.exports =  AuthService
