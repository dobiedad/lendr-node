var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderNewDebt(model) {
  return h('div.container',
  h('div.title',
    h('h2','facebook friends using lendr')
  ),
    renderTableForFriends(model)
  )
}

function renderTableForFriends(model){
  return model.friends.map(function(friend) {
    return h('li.cell',
      h('a',{href:'#',onclick:function () {
        model.modal = {
          title:'Create',
          content:'How much does ' + friend.name + ' owe you ?',
          options: { href:'#', onclick:function () {
            return model.createDebtFor(friend)
              .then(function () {
                model.modal = {}
                model.refresh()
              })
          }},
          amount:true
        }
        model.refresh()
      }},
        h('img.cell-image', {src: friend.img }),
        h('div.text-container',friend.name)
      )
    )
  })
}


module.exports = renderNewDebt
