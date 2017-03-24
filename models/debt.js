var shortid = require('shortid');

function Debt(options) {
  this.id = options.id || shortid();
  this.debtor = options.debtor;
  this.lender = options.lender;
  this.amount = options.amount;
  this.debtorName = options.debtorName;
  this.lenderName = options.lenderName;
  this.createdAt = options.createdAt|| new Date().getTime();
  this.lenderImg = options.lenderImg;
  this.debtorImg = options.debtorImg;
  this.paid = options.paid || false;
  this.approved = options.approved || false;
}

module.exports = Debt;
