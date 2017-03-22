var expect = require('chai').expect;

var DebtService = require('../services/debtService');
var firebaseApp = require('../services/firebaseApp');
var debtBuilder = require('./builders/debtBuilder')

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

  });

});
