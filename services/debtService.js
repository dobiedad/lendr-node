function DebtService(firebaseApp) {
  this.firebaseApp = firebaseApp
}

DebtService.prototype.create = function (debt) {
  return this.firebaseApp.database().ref('debt/' + debt.id).set(debt)
    .then(function () {
      return debt
    })
};

DebtService.prototype.approve = function (debt) {
  debt.approved = true
  return this.create(debt)
};

DebtService.prototype.resolve = function (debt) {
  debt.paid = true
  return this.create(debt)
};

DebtService.prototype.loadDebtors = function (model) {
  var id = model.currentUser.fbid
  return this.firebaseApp.database().ref('debt')
  .orderByChild("lender")
  .equalTo(id)
    .on('value',function (snapshot) {
      model.debts.debtors = enumerateDebt(snapshot.val())
      model.refresh()
    })
};

DebtService.prototype.loadLenders = function (model) {
  var id = model.currentUser.fbid
  return this.firebaseApp.database().ref('debt')
  .orderByChild("debtor")
  .equalTo(id)
    .on('value',function (snapshot) {
      model.debts.lenders = enumerateDebt(snapshot.val())
      model.refresh()
    })
};

function enumerateDebt(object) {
  return Object.keys(object || {}).map(function(uid) {
    var debt = object[uid];
    debt.id = uid;
    return debt;
  });
}

module.exports = DebtService;
