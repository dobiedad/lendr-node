var AuthService = require('./services/authService');
var DebtService = require('./services/debtService');
var firebaseApp = require('./services/firebaseApp');

module.exports = {
  createServices: function() {
    return {
      authService: new AuthService(firebaseApp),
      debtService: new DebtService(firebaseApp)
    };
  }
};
