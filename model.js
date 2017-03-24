var shortid = require('shortid');

function Model(options) {
  options = options || {};
  this.screen = 'lendr';
  this.authService = null;
  this.debtService = null;
  this.owed = 0;
  this.owe = 0;
  this.net = 0
  this.currentUser = null;
  this.debts = {
    pending:{
      debtors:[],
      lenders:[]
    },
    approved:{
      debtors:[],
      lenders:[]
    }
  };
  this.modal = {

  }
  this.title = 'lendr';
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

Model.prototype.logout = function() {
  var self = this;
  return this.authService.signOut()
    .then(function () {
      self.currentUser = null
      self.refresh()
    })
};

Model.prototype.calculateTotal = function(debts) {
  return this.debtService.calculateTotal(debts)
};

Model.prototype.calculateNetForMe = function() {
  var totalImOwed = parseFloat(this.debtService.calculateTotal(this.debts.approved.debtors))
  var totalIOwe = parseFloat(this.debtService.calculateTotal(this.debts.approved.lenders))
  return (totalImOwed - totalIOwe).toString()
};

Model.prototype.loadDebts = function() {
  this.debtService.loadDebtors(this)
  this.debtService.loadLenders(this)
  this.owed = this.calculateTotal(this.debts.approved.debtors);
  this.owe = this.calculateTotal(this.debts.approved.lenders);
  this.net = this.calculateNetForMe()
};

Model.prototype.resolveDebt = function(debt) {
  var self = this;
  return this.debtService.resolve(debt)
};

Model.prototype.approveDebt = function(debt) {
  var self = this;
  return this.debtService.approve(debt)
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
