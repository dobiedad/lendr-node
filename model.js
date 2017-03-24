var shortid = require('shortid');
var Debt  = require('./models/debt')

function Model(options) {
  options = options || {};
  this.screen = 'lendr';
  this.authService = null;
  this.debtService = null;
  this.owed = 0;
  this.owe = 0;
  this.net = 0
  this.currentUser = null;
  this.totalIOweTo = {} ;
  this.totalImOwedFrom = {} ;
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
  this.modal = {};
  this.friends = [];
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
      self.loadFriends()
      self.refresh()
      return user
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

Model.prototype.loadFriends = function () {
  this.authService.loadFriends(this)
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

Model.prototype.calculateTotalIOweTo = function(id) {
  var self = this;
  var total = 0;
  this.debts.approved.lenders.map(function (debt) {
    if(debt.lender == id){
      total = total + parseFloat(debt.amount)
    }
  })
  this.totalIOweTo[id] = total
};

Model.prototype.calculateTotalImOwedFrom = function(id) {
  var self = this;
  var total = 0;
  this.debts.approved.debtors.map(function (debt) {
    if(debt.debtor == id){
      total = total + parseFloat(debt.amount)
    }
  })
  this.totalImOwedFrom[id] = total
};

Model.prototype.deleteDebt = function(debt) {
  return this.debtService.delete(debt)
};

Model.prototype.createDebtFor = function(options) {
  var self = this;

  var obj = {
    debtor : options.fbid,
    debtorName : options.name,
    debtorImg : options.img,
    lender : this.currentUser.fbid,
    lenderImg :this.currentUser.img,
    lenderName : this.currentUser.name,
    amount : this.newDebtAmount
  }
  var debt = new Debt(obj)
  console.log(debt)
  return this.debtService.create(debt)
};

Model.prototype.checkAuthenticated = function() {
  var self = this;
  return this.authService.checkAuthenticated()
    .then(function (online) {
      if(online){
        return self.authService.loadMyProfile()
          .then(function (user) {
            self.currentUser = user;
            self.loadFriends()
            self.refresh()
            return online
          })
      }
      return online
    })
};

module.exports = Model;
