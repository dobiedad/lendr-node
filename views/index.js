var hyperdom = require('hyperdom');
var h = hyperdom.html;
var Model = require('../model')
var services = require('../services');
var notifications = require('./notifications');
var newDebt = require('./newDebt');
var modal = require('./modal')

var m = new Model(services.createServices());

function render(model) {
  model.refresh = h.refresh;
  if(!model.currentUser){
     model.checkAuthenticated()
  }
  else{
    if(!model.debts.lenders || !model.debts.debtors){
       model.loadDebts()
    }
  }

  return h('div',
    model.currentUser ?
    h('div.main',
      h('div.navbar',
      model.screen == 'lendr'?
        renderPowerButton(model)
      : renderBackButton(model)
      ,model.screen),
      model.screen == 'lendr' ?
        renderHome(model)
      : undefined,
      model.screen == 'New Debt' ?
        newDebt(model)
      : undefined,
      model.screen == 'Notifications' ?
      notifications(model)
      : undefined,
      model.modal.title ?
      modal(model) : undefined
    )
   : renderLogin(model)
  );
}

function renderBackButton(model){
  return h('button.back',{onclick:function () {
    model.screen = 'lendr'
  }})
}

function renderPowerButton(model){
  return h('button.power',{onclick:function () {
    return model.logout()
  }})
}

function renderLogin(model) {
  return h('div.container',
    h('img.logo-large', {
      src: 'logo.png' }),
    h('button.login-button', {
      title: 'Login',
      onclick: function() {
        model.login()
      }
    }, '')
  )
}

function renderHome(model) {
  return h('div.container',
    h('img.profile-image', {src: model.currentUser.img }),
    h('h1',model.currentUser.name),
    h('div.menu-buttons',
      h('button.main-button', {
        title: 'New Debt',
        onclick: function() {
          model.screen = 'New Debt'
        }
      }, 'New Debt'),
      h('button.main-button', {
        title: 'Notifications',
        onclick: function() {
          model.screen = 'Notifications'
        }
      },
      model.debts.pending.lenders  &&  model.debts.pending.lenders.length > 0 ?
        h('a.notification', model.debts.pending.lenders.length)
      : undefined,
       'Notifications')
  ),
    h('ul.table-section',
      h('div.title',
        h('h2','friends who owe me')
      ),
      model.debts.approved.debtors ?
      renderTableForDebtors(model,model.debts.approved.debtors):undefined
    ),
    h('ul.table-section',
      h('div.title',
        h('h2','friends who i owe')
      ),
      model.debts.approved.lenders ?
      renderTableForLenders(model.debts.approved.lenders):undefined
    )
  )
}


function renderTableForDebtors(model,debts){
  return debts.map(function(debt) {
    var paidLabel = debt.paid ? ' paid you ' : ' owes you '
    return h('li.cell',
      h('a',{disabled:debt.paid,href:'#',onclick:!debt.paid ? function () {
        model.modal = {
          title:'Confirm',
          content:'Has ' + debt.debtorName + ' paid you ' + debt.amount + '?',
          options: {href:'#',onclick:function () {
            return model.resolveDebt(debt)
          }}
        }
        model.refresh()
      }:undefined},
        h('img.cell-image', {src: debt.debtorImg }),
        h('div.text-container',debt.debtorName + paidLabel + debt.amount),
        debt.paid ?   h('div.paid') : undefined
      )
    )
  })
}

function renderTableForLenders(debts) {
      return debts.map(function(debt) {
        var paidLabel = debt.paid ? 'You paid ' : 'You owe '
        return h('li.cell',
          h('img.cell-image', {src: debt.lenderImg }),
          h('div.text-container',paidLabel + debt.lenderName + " " + debt.amount),
          debt.paid ?   h('div.paid') : undefined
        )
      })
}

hyperdom.append(document.body, render, m);
