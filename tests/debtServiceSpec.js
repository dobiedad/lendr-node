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

    it('loads all my debtors', function() {
      var myFbId = "topdon" + shortid()
      var myDebt = debtBuilder().valid().withLender(myFbId).build()
      var myDebt2 = debtBuilder().valid().withLender(myFbId).build()
      var otherDebt = debtBuilder().valid().build()

      console.log(myDebt.lender)
      return debtService.create(myDebt)
        .then(function () {
          return debtService.create(myDebt2)
        })
        .then(function () {
          return debtService.create(otherDebt)
        })
        .then(function () {
          return debtService.loadDebtorsFor(myFbId)
        })
        .then(function (res) {
          expect(res.length).to.eql(2)
        })
    });

    it('loads all my lendors', function() {
      var myFbId = "topdon" + shortid()
      var myDebt = debtBuilder().valid().withDebtor(myFbId).build()
      var myDebt2 = debtBuilder().valid().withDebtor(myFbId).build()
      var otherDebt = debtBuilder().valid().build()

      console.log(myDebt.lender)
      return debtService.create(myDebt)
        .then(function () {
          return debtService.create(myDebt2)
        })
        .then(function () {
          return debtService.create(otherDebt)
        })
        .then(function () {
          return debtService.loadLendersFor(myFbId)
        })
        .then(function (res) {
          expect(res.length).to.eql(2)
        })
    });

  });

});
