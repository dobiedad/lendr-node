var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderModal(model) {
  return h('a.modal',
    h('div.alert',
      h('img.logo-small', {
        src: 'logo.png' }),
      h('h3.modal-text',model.modal.content),
      model.modal.amount ?
        h('input', {
           class: 'debt-amount',
           name: 'debt',
           required: true,
           placeholder: 'e.g. 23.43',
           type: 'number',
           step:'0.01',
           binding: [model, 'newDebtAmount']
        })
      : undefined,
      h('button.modal-button',model.modal.options, model.modal.title),
      h('button.modal-button',{onclick:function () {
        model.modal = {}
      }},'Cancel')
    )
  )
}

module.exports = renderModal
