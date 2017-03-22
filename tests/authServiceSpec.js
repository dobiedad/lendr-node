var expect = require('chai').expect;

var AuthService = require('../services/authService');
var firebaseApp = require('../services/firebaseApp');
var userBuilder = require('./builders/userBuilder')

describe('Auth Service', function() {
  var authService;

  beforeEach(function(){
    authService = new AuthService(firebaseApp)
  })

  it('Creates a user', function() {
    var user = userBuilder().valid().build()
    return authService.createUser(user)
      .then(function (res) {
        expect(res.id).to.eql(user.id)
      })
  });


});
