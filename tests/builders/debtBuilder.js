var Debt = require('../../models/debt');
var shortid = require('shortid');

var gifs = {
  red: 'data:image/gif;base64,R0lGODlhAQABAPAAAP9QUP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
  blue: 'data:image/gif;base64,R0lGODlhAQABAPAAAB6q6v///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
  yellow: 'data:image/gif;base64,R0lGODlhAQABAPAAAP//mf///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
  green: 'data:image/gif;base64,R0lGODlhAQABAPAAAJn/mf///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
}

function DebtBuilder() {

}

DebtBuilder.prototype.valid = function() {
  this.id = shortid.generate();
  this.debtor = shortid.generate();
  this.lender = shortid.generate();
  this.amount = "23.25";
  this.debtorName = "debtor_" + shortid.generate();
  this.lenderName = "lender +" + shortid.generate();
  this.createdAt = new Date().getTime();
  this.lenderImg = 'http://portfoliotheme.org/enigmatic/wp-content/uploads/sites/9/2012/07/placeholder1.jpg';
  this.debtorImg = 'https://placeholdit.imgix.net/~text?txtsize=28&bg=0099ff&txtclr=ffffff&txt=300%C3%97300&w=300&h=300&fm=png';
  this.paid =  false;
  this.approved = false;
  return this;
};

DebtBuilder.prototype.build = function() {
  return new Debt(this);
};

DebtBuilder.prototype.withLender = function(lender) {
  this.lender = lender
  return this
};

DebtBuilder.prototype.withDebtor = function(debtor) {
  this.debtor = debtor
  return this
};

DebtBuilder.prototype.withAmount = function(amount) {
  this.amount = amount
  return this
};

DebtBuilder.prototype.withApproved = function(amount) {
  this.approved = true
  return this
};

DebtBuilder.prototype.withPaid = function(paid) {
  this.paid = paid
  return this
};

module.exports = function() {
  return new DebtBuilder();
};
