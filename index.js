var hyperdom = require('hyperdom');
var h = hyperdom.html;

function render(model) {
  return h('div',
    h('h1', "lendr")
  );
}

hyperdom.append(document.body, render, {name: ''});
