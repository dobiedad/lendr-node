function DebtService(firebaseApp) {
  this.firebaseApp = firebaseApp ;
  this.debtors = [] ;
  this.lenders = []
}

DebtService.prototype.create = function (debt) {
  return this.firebaseApp.database().ref('debt/' + debt.id).set(debt)
    .then(function () {
      return debt
    })
};

DebtService.prototype.delete = function (debt) {
  return this.firebaseApp.database().ref('debt/' + debt.id).remove()
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
  var self = this;
  var id = model.currentUser.fbid
  return this.firebaseApp.database().ref('debt')
  .orderByChild("lender")
  .equalTo(id)
    .on('value',function (snapshot) {
      self.debtors = snapshot.val()
      model.debts.approved.debtors = enumerateApprovedDebt(snapshot.val())
      model.debts.pending.debtors = enumeratePendingDebt(snapshot.val())
      model.refresh()
    })
};

DebtService.prototype.loadLenders = function (model) {
  var id = model.currentUser.fbid
  return this.firebaseApp.database().ref('debt')
  .orderByChild("debtor")
  .equalTo(id)
    .on('value',function (snapshot) {
      self.lenders = snapshot.val()
      model.debts.approved.lenders = enumerateApprovedDebt(snapshot.val())
      model.debts.pending.lenders = enumeratePendingDebt(snapshot.val())
      model.refresh()
    })
};

DebtService.prototype.loadPendingLenders = function (model) {
  return Promise.resolve(enumeratePendingDebt(this.lenders))
};

DebtService.prototype.loadPendingDebtors = function (model) {
  return Promise.resolve(enumeratePendingDebt(this.debtors))
};

DebtService.prototype.calculateTotal = function (debts) {
  var total  = 0;
  for (var debt of debts) {
    if(!debt.paid){
      total = total + parseFloat(debt.amount)
    }
 }
 return total.toString()
};

function enumerateApprovedDebt(object) {
  return Object.keys(object || {}).map(function(uid) {
    var debt = object[uid];
    debt.id = uid;
    if(!debt.approved){
      return
    }
    return debt;
  }).filter(function( element ) {
   return element !== undefined;
 });
}

function enumeratePendingDebt(object) {
  return Object.keys(object || {}).map(function(uid) {
    var debt = object[uid];
    debt.id = uid;
    if(debt.approved){
      return
    }
    return debt
  }).filter(function( element ) {
   return element !== undefined;
 });
}
module.exports = DebtService;
