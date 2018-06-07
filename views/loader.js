var hyperdom = require('hyperdom');
var h = hyperdom.html;

function renderLoader() {
  return h("div.sk-circle",
    h("div.sk-circle1.sk-child"),
    h("div.sk-circle2.sk-child"),
    h("div.sk-circle3.sk-child"),
    h("div.sk-circle4.sk-child"),
    h("div.sk-circle5.sk-child"),
    h("div.sk-circle6.sk-child"),
    h("div.sk-circle7.sk-child"),
    h("div.sk-circle8.sk-child"),
    h("div.sk-circle9.sk-child"),
    h("div.sk-circle10.sk-child"),
    h("div.sk-circle11.sk-child"),
    h("div.sk-circle12.sk-child"))
}
module.exports = renderLoader
