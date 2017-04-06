var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderNewDebt(model) {
  return h('div.container',
  h('input.search', {
      binding: [model, 'friendsQuery'],
      type: 'search',
      placeholder: 'search friends...',
      onkeyup: function() {
        return model.filterForFriendsQuery()
      }
  }),

    renderTableForFriends(model)
  )
}

function renderTableForFriends(model){
  var array ;

  if(model.friendsQuery.length > 0){
    array = model.searchResults
  }
  else{
    array = model.friends;
  }

  return array.length > 0 ?
    array.map(function(friend) {
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
    :model.friends.length < 1 ? h('div.no-results','None of your facebook friends are using lendr, invite them !') : h('div.no-results','No Results')
}


module.exports = renderNewDebt
