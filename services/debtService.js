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

module.exports = DebtService;
