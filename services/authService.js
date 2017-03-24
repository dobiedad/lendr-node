var firebase = require("firebase");
var FB = require('fb'),
    fb = new FB.Facebook({});

function AuthService(firebaseApp) {
  this.firebaseApp = firebaseApp
}

AuthService.prototype.signIn = function () {
  var self = this;
  var provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('email,public_profile,user_friends')
  return this.firebaseApp.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    FB.setAccessToken(token);
    var promise = new Promise(function (resolve) {
      FB.api('me', { fields: ['picture.width(400).height(400)'],limit:5000, access_token: token }, function (res) {
        var user = {
          fbid:result.user.providerData[0].uid,
          email:result.user.email,
          name:result.user.displayName,
          img:res.picture.data.url
        }
        resolve(user)
      });
    })

    return promise
      .then(function (user) {
        console.log(user);
        return self.createUser(user)
      })
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

AuthService.prototype.loadFriends = function () {
  var self = this;
  var promise = new Promise(function (resolve) {
    FB.api('me/friends', {limit:5000 }, function (res) {
      console.log(res)
      resolve(res)
    });
  })

  return promise
};

AuthService.prototype.signOut = function () {
  var self = this;
  return this.firebaseApp.auth().signOut()
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
