var hyperdom = require('hyperdom');
var h = hyperdom.html;
var Model = require('./model')
var services = require('./services');
var h = require('hyperdom').html;

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
      model.screen != 'lendr'?
        h('button.back',{onclick:function () {
          model.screen = 'lendr'
        }})
      : undefined
      ,model.screen),
      model.screen == 'lendr' ?
        renderHome(model)
      : undefined,
      model.screen == 'New Debt' ?
        renderNewDebt(model)
      : undefined,
      model.screen == 'Notifications' ?
      renderNotifications(model)
      : undefined
    )
   : renderLogin(model)
  );
}

function renderLogin(model) {
  return h('div.container',
    h('img.logo', {
      src: 'logo.png' }),
    h('button.login-button', {
      title: 'Login',
      onclick: function() {
        model.login()
      }
    }, '')
  )
}

function renderNewDebt(model) {
  return h('div.container')
}

function renderNotifications(model) {
  return h('div.container')
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
      }, 'Notifications')
  ),
    h('ul.table-section',
      h('div.title',
        h('h3','friends who i owe')
      ),
      model.debts.lenders ?
      renderTableForLenders(model.debts.lenders):undefined
    ),
    h('ul.table-section',
      h('div.title',
        h('h3','friends who owe me')
      ),
      model.debts.debtors ?
      renderTableForDebtors(model.debts.debtors):undefined
    )
  )
}

function renderTableForDebtors(debts){
      return debts.map(function(debt) {
        return h('li.cell',
          h('img.cell-image', {src: debt.debtorImg }),
          h('div.text-container',debt.debtorName + ' owes you ' + debt.amount)
        )
      })
}

function renderTableForLenders(debts) {
      return debts.map(function(debt) {
        return h('li.cell',
          h('img.cell-image', {src: debt.lenderImg }),
          h('div','You owe ' + debt.lenderName + " " + debt.amount)
        )
      })
}

hyperdom.append(document.body, render, m);
