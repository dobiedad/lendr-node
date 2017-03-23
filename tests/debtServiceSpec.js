var expect = require('chai').expect;
var shortid = require('shortid');

var DebtService = require('../services/debtService');
var firebaseApp = require('../services/firebaseApp');
var debtBuilder = require('./builders/debtBuilder')
var userBuilder = require('./builders/userBuilder')

describe('Debt Service', function() {
  var debtService;

  beforeEach(function(){
    debtService = new DebtService(firebaseApp)
  })

  it('Creates a debt', function() {
    var debt = debtBuilder().valid().build()
    return debtService.create(debt)
      .then(function (res) {
        expect(res.id).to.eql(debt.id)
      })
  });

  context('When debt exists', function() {
    var debt;

    beforeEach(function(){
      debt = debtBuilder().valid().build()
    })

    it('approves a debt', function() {
      return debtService.approve(debt)
        .then(function (res) {
          expect(res.approved).to.eql(true)
        })
    });

    it('resolves a debt', function() {
      return debtService.resolve(debt)
        .then(function (res) {
          expect(res.paid).to.eql(true)
        })
    });

    it('loads my debtors', function() {
      var myFbId = "topdon" + shortid()
      var myDebt = debtBuilder().valid().withLender(myFbId).withApproved().build()
      var myDebt2 = debtBuilder().valid().withLender(myFbId).withApproved().build()
      var otherDebt = debtBuilder().valid().build()

      var model = {
        debts:{},
        currentUser:{ fbid : myFbId}
      }

      console.log(myDebt.lender)
      return debtService.create(myDebt)
        .then(function () {
          return debtService.create(myDebt2)
        })
        .then(function () {
          return debtService.create(otherDebt)
        })
        .then(function () {
           debtService.loadDebtors(model)
           setTimeout(function(){ expect(model.debts.debtors.length).to.eql(2) }, 2);
        })
    });

    xit('loads my lenders', function() {
      var myFbId = "topdon" + shortid()
      var myDebt = debtBuilder().valid().withDebtor(myFbId).withApproved().build()
      var myDebt2 = debtBuilder().valid().withDebtor(myFbId).withApproved().build()
      var otherDebt = debtBuilder().valid().build()

      var model = {
        debts:{},
        currentUser:{ fbid : myFbId}
      }

      return debtService.create(myDebt)
        .then(function () {
          return debtService.create(myDebt2)
        })
        .then(function () {
          return debtService.create(otherDebt)
        })
        .then(function () {
           debtService.loadLenders(model)
           setTimeout(function(){ expect(model.debts.lenders.length).to.eql(2) }, 2);
        })
    });

    it('calculates total i owe', function() {
      var myFbId = "topdon" + shortid()
      var myDebt = debtBuilder().valid().withDebtor(myFbId).withAmount("10.03").build()
      var myDebt2 = debtBuilder().valid().withDebtor(myFbId).withAmount("15.50").build()
      var myDebt3 = debtBuilder().valid().withDebtor(myFbId).withPaid(true).build()

      var debts = [myDebt,myDebt2,myDebt3]

      return debtService.calculateTotal(debts)
        .then(function (res) {
          return expect(res).to.eql("25.53")
        })
    });

  });

});
