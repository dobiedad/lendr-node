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

DebtService.prototype.loadDebtorsFor = function (id) {
  console.log(id)
  return this.firebaseApp.database().ref('debt')
  .orderByChild("lender")
  .equalTo(id)
    .once('value')
      .then(function (snapshot) {
        return enumerateDebt(snapshot.val())
      })

};

DebtService.prototype.loadLendersFor = function (id) {
  console.log(id)
  return this.firebaseApp.database().ref('debt')
  .orderByChild("debtor")
  .equalTo(id)
    .once('value')
      .then(function (snapshot) {
        return enumerateDebt(snapshot.val())
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
