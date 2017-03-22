var hyperdom = require('hyperdom');
var h = hyperdom.html;
var Model = require('./model')
var services = require('./services');
var h = require('hyperdom').html;

var m = new Model(services.createServices());

function render(model) {
  model.refresh = h.refresh;
  return h('div',
    h('button', {
      title: 'Login',
      onclick: function() {
        model.login()
      }
    }, 'Login'),

    model.currentUser ?
    h('div',
    h('h2',model.currentUser.name),
      h('img', {
        src: model.currentUser.img })
    ) : model.checkAuthenticated() 
  );
}

hyperdom.append(document.body, render, m);
