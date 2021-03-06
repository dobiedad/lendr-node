var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderNotifications(model) {
  return h('div.container',
    h('ul.table-section',
      h('div.title',
        h('h3','friends who claim i owe them money')
      ),
      model.debts.pending.debtors ?
      renderTableForPendingDebtors(model):undefined
    ),
    h('ul.table-section',
      h('div.title',
        h('h3','friends who owe me money')
      ),
      model.debts.pending.lenders ?
      renderTableForPendingLender(model,model.debts.pending.debtors):undefined
    )
  )
}

function renderTableForPendingDebtors(model){
  return model.debts.pending.lenders.map(function(debt) {
    return h('li.cell',
      h('a',{ href:'#', onclick:function (e) {
        e.preventDefault();
        model.modal = {
          title:'Confirm',
          content:'You owe ' + debt.lenderName + ' ' + "£"+ model.formatNumber(debt.amount) + '?',
          options: {href:'#',onclick:function () {
            return model.approveDebt(debt)
          }}
        }
        model.refresh()
      }},
      h('img.cell-image', {src: debt.lenderImg }),
      h('div.text-container',debt.lenderName + ' claims you owe ' + model.formatNumber(debt.amount))
    ))
  })
}

function renderTableForPendingLender(model,debts) {
  return debts.map(function(debt) {
    return h('li.cell',
    h('a',{ href:'#', onclick:function (e) {
      e.preventDefault();
      model.modal = {
        title:'Confirm',
        content:'Cancel debt of £ ' + model.formatNumber(debt.amount) + ' for ' + debt.debtorName,
        options: {href:'#',onclick:function () {
          return model.deleteDebt(debt)
        }}
      }
      model.refresh()
    }},
      h('img.cell-image', {src: debt.debtorImg }),
      h('div.text-container','Waiting for ' + debt.debtorName + " to accept debt of £" + model.formatNumber(debt.amount))
    ))
  })
}

module.exports = renderNotifications
