
import Vue from 'vue';
import numeral from 'numeral';

function num(str){
	if(isNaN(str) || !str){
	  return 0;
	} return parseFloat(str);
}

var number = function (value,format) {
  var _format = format || "0,0000"
  return numeral(value).format(_format).toUpperCase();//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
}
var min0 = function(num){
	return Math.max(num,0);
}

var roundA = function (n,places) {
	let _places = places || 0;
	let sign = n<0 ? -1 : 1;
	let numb = Math.abs(num(n));
	let baseLen = Math.round(Math.log10(numb))
	_places = (numb > 999) ? Math.min(2,_places) : Math.min(5,_places-baseLen-1);
	if(_places >= 5 && numb < 0.0001){
		let base5 = Math.pow(10,5);
		let base10 = Math.pow(10,10);
		return `${sign*Math.round(numb*base10)/base5}e-5`;
	} else {
		let base = Math.pow(10,_places)
		return sign*Math.round(numb*base)/base;
	}
};

var round2 = function (n,places) {
	let _places = places || 2;
	let base = Math.pow(10,_places)
	return number(Math.round(num(n)*base)/base);
}

var round5 = function (n,places) {
	//return roundA(n,places || 9);
	return roundA(n,9);
	// let _places = places || 5;
	// let base = Math.pow(10,_places)
	// return Math.round(num(n)*base)/base;
};
var round = function (n,places) {
	let _places = places || 0;
	let base = Math.pow(10,_places)
	return Math.round(num(n)*base)/base;
};
var capitalize = function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
var abs = function (n) {
	return Math.abs(n);
}

var formatter = {
	init : function(){

		Vue.filter('capitalize', capitalize);
		Vue.filter('round5',round5);
		Vue.filter('round2',round2);
		Vue.filter('round',round);
		Vue.filter('roundA',roundA);
		Vue.filter('abs',abs);
		Vue.filter('min0',min0);
		

		Vue.filter('instock_worth', function (summary) {
			let balance = summary.balance;
			if(!balance || !summary.ticker) return 0;
			return round2(num(balance.balance) * num(summary.ticker.last_price) * 0.999);
		});
		Vue.filter('wallet_pending_purchase', function (summary) {
			let onbuy_amount = summary.order ? summary.order.onbuy_amount : 0;
			if(!onbuy_amount) return 0;
			return round2(onbuy_amount);
		});
		Vue.filter('wallet_net_worth', function (summary) {
			let balance = summary.balance;
			if(!balance) return 0;
			let balanceCoins = num(balance.balance) + num(balance.locked_balance);
			return round2( 
				(balanceCoins) * summary.ticker.last_price * 0.999
			);
		});
		Vue.filter('wallet_balance', function (summary) {
			let balance = summary.balance;
			if(!balance) return "--";
			let balanceCoins = num(balance.balance) + num(balance.locked_balance);
			return balanceCoins;
		});
		Vue.filter('change_percent', function (ticker) {
			return round(
				ticker.change_24_hour,2
			);
		});
	},
	number : number,
	round2 :round2,
	round5 : round5,
	round : round,
	roundA : roundA,
	capitalize : capitalize,
	num : num,
	abs : abs,min0
};
formatter.init();
export default formatter;