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
  this.lenderImg = gifs.red;
  this.debtorImg = gifs.blue;
  this.paid =  false;
  this.approved = false;
  return this;
};

DebtBuilder.prototype.build = function() {
  return new Debt(this);
};

module.exports = function() {
  return new DebtBuilder();
};
