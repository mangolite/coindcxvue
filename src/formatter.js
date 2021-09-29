
import Vue from 'vue';
import numeral from 'numeral';


var number = function (value,format) {
  var _format = format || "0,0000"
  return numeral(value).format(_format).toUpperCase();//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
}

var round2 = function (num,places) {
	let _places = places || 2;
	let base = Math.pow(10,_places)
	return number(Math.round(num*base)/base);
}

var round5 = function (num,places) {
	let _places = places || 5;
	let base = Math.pow(10,_places)
	return Math.round(num*base)/base;
};
var capitalize = function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

var formatter = {
	init : function(){

		Vue.filter('capitalize', capitalize);
		Vue.filter('round5',round5);
		Vue.filter('round2',round2);

		Vue.filter('instock_worth', function (summary) {
			let balance = summary.balance;
			if(!balance) return 0;
			return round2(balance.balance * summary.ticker.last_price * 0.999);
		});
	}
};
formatter.init();
export default formatter;