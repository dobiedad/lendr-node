var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderUserProfile(model) {
  var obj;
  if(model.viewingDebtUser.type =='whereIamLender'){
    obj = {
      owe:model.totalIOweTo[model.viewingDebtUser.fbid],
      owed:model.totalImOwedFrom[model.viewingDebtUser.fbid]
    }
  }
  else{
    obj = {
      owe:model.totalIOweTo[model.viewingDebtUser.fbid],
      owed:model.totalImOwedFrom[model.viewingDebtUser.fbid]
    }
  }
  return h('div.container',
  h('div.info-left',
    h('h1','You Owe'),
    h('h2.amount',"£"+obj.owe)
  ),
  h('img.profile-image', {src: model.viewingDebtUser.img }),
  h('div.info-right',
    h('h1','Owes you'),
    h('h2.amount',"£"+obj.owed)
  ),
  h('h1','Net'),
  h('h2',"£" + (obj.owed - obj.owe)),
  h('div.debt-content',
    h('h1','Debt'),
    h('h2.debt',"£" + model.viewingDebtUser.debt.amount),
    model.viewingDebtUser.debt.paid ?
      h('img.paid-large', {src: 'paid_straight.png' })
    : undefined,
    model.viewingDebtUser.type == 'whereIamLender' && !model.viewingDebtUser.debt.paid?
    h('div.debt-buttons',
      h('button.resolve-button',{onclick:function () {
        model.modal = {
          title:'Confirm',
          content:'Has ' + model.viewingDebtUser.name + ' paid you ' + "£"+ model.viewingDebtUser.debt.amount + '?',
          options: {href:'#',onclick:function () {
            return model.resolveDebt(model.viewingDebtUser.debt)
              .then(function () {
                model.modal = {}
                model.refresh()
              })
          }}
        }
        model.refresh()
      }},'Confirm'),
      h('button.delete-button',{onclick:function () {
        model.deleteDebt(model.viewingDebtUser.debt)
      }},'Delete')
    ) : undefined

  )
)

}

module.exports = renderUserProfile
