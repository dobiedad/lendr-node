var shortid = require('shortid');

function Model(options) {
  options = options || {};
  this.screen = 'launch';
  this.authService = null;
  this.debtService = null;
  this.currentUser = null;

  for (var key in options) {
    if (typeof(this[key]) == 'undefined') {
      throw new Error('Invalid model option ' + key);
    }
    this[key] = options[key];
  }
}

Model.prototype.login = function() {
  var self = this;
  return this.authService.signIn()
    .then(function (user) {
      self.currentUser = user
      self.refresh()
    })
};

Model.prototype.checkAuthenticated = function() {
  var self = this;
  return this.authService.checkAuthenticated()
    .then(function (online) {
      if(online){
        return self.authService.loadMyProfile()
          .then(function (user) {
            self.currentUser = user;
            self.refresh()
            return online
          })
      }
      return online
    })
};

module.exports = Model;
