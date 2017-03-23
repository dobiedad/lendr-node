var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderModal(model) {
  return h('a.modal',{ href: '#', onclick:function () {
      model.modal = {}
    }},
    h('div.alert',
      h('img.logo-small', {
        src: 'logo.png' }),
      h('h3.modal-text',model.modal.content),
      h('button.modal-button',model.modal.options, model.modal.title),
      h('button.modal-button',{onclick:function () {
        model.modal = {}
      }},'Cancel')
    )
  )
}

module.exports = renderModal
