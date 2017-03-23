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
  return h('div',
    model.currentUser ?
    h('div',
      h('div.navbar',model.title),
      renderHome(model)
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

function renderHome(model) {
  return h('div.container',
    h('h2',model.currentUser.name),
      h('img', {
        src: model.currentUser.img })
  )
}

hyperdom.append(document.body, render, m);
