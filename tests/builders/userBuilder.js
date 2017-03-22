var User = require('../../models/user');
var shortid = require('shortid');

function UserBuilder() {

}

UserBuilder.prototype.valid = function() {
  this.id = shortid.generate();
  this.name = "leo" + shortid.generate();
  this.fbid = shortid.generate();
  this.email = "leo" + shortid.generate() + "@hotmail.com";
  this.img = 'data:image/gif;base64,R0lGODlhAQABAPAAAP9QUP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
  return this;
};

UserBuilder.prototype.build = function() {
  return new User(this);
};

module.exports = function() {
  return new UserBuilder();
};
