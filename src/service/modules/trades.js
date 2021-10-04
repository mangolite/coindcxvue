import Vue from 'vue';
import request from 'request';
import crypto from 'crypto';

//var baseurl = document.location.origin;  
var baseurl = 'https://pure-citadel-90943.herokuapp.com/https://api.coindcx.com'
var baseurlPublic =  'https://pure-citadel-90943.herokuapp.com/https://public.coindcx.com' 
      // Place your API key and secret below. You can generate it from the website.
var api_key_1 = localStorage.getItem("api_key_1") || localStorage.getItem("api_key");
var api_secret_1 = localStorage.getItem("api_secret_1") || localStorage.getItem("api_secret");

if(api_key_1){
  localStorage.setItem("api_key_1",api_key_1);
  localStorage.setItem("api_secret_1",api_secret_1);
}

var KEY_LIST = [];
var KEYS = {};
var INDEX = 0;
for(var i =1; i < 50; i++){
  KEYS["api_key_" + i] = localStorage.getItem("api_key_"+i);
  KEYS["api_secret_" + i] = localStorage.getItem("api_secret_"+i);
  KEYS["api_name_" + i] = localStorage.getItem("api_name_"+i) || ('Acct '+ i);
  if(KEYS["api_key_" + i]){
    KEY_LIST.push({
      id : i,
      name : KEYS["api_name_" + i],
      key : KEYS["api_key_" + i],
      secret : KEYS["api_secret_" + i],
    });
  }
}
INDEX = KEY_LIST.length;

var buyrate = function(qty,tqty,tcost,min,max){
  //let factor = tqty/qty;
  let avg = tcost/tqty;
  //let med = (max+min)/2;
  if(!(qty>0 && tqty>0 && tcost>0 && min>0 && max >0)){
    //console.log("buyrate",qty, tqty,tcost,min,max);
    return avg;
  }
  let havg = (max+avg)/2;
  //let hrng = (max-avg);
  let lrng = (avg-min);
  let rng = max-min;

  let hqty = tqty*lrng/rng;

  if(qty>hqty){
    return avg;
  }
  return buyrate(qty,hqty, hqty*havg,avg,max);
}
function num(str){
  if(isNaN(str) || !str){
    return 0;
  } return parseFloat(str);
}

var syncHistory = 0, syncTicker=0;
var newSummary = function(key,symbol){
return {
          key : key, 
          symbol : symbol,
          meta : {
            buy_quantity : 0 , buy_amount : 0,
            sell_quantity : 0 , sell_amount : 0,
            fee_amount : 0,
            starting_coins : 0,
            efective_rate : 0, now_rate : 0,
          }, 
          _showDetails : false,
          ticker : {},
          balance : {}
  }
}


const state = {
  items: [],
  selected : null, symbol : null,
  ticker : null,
  summary : {},
  nowIndex : 1, INDEX : INDEX, account : 1,
  orders : null, history : null,
  ranges : {},
  KEY_LIST : KEY_LIST,
  keyIndex : null,

  marketDetails : null,balances : null,candlesMap : {}
};

const getters = {
  KEY_LIST (state){
    return KEY_LIST;
  },
  KEYS (state){
    return KEYS;
  },
  INDEX (state){
    return INDEX;
  },
  candles (state){
    return state.symbol ? (state.candlesMap[state.symbol] || null) : null;
  },
  candles_all (state){
    return state.candlesMap || {};
  },
	account: (state) => state.account,
  symbol (state){
    return state.symbol;
  },
  selected (state){
    return state.symbol ? (state.summary[state.symbol] || null) : null;
  },
  summary(state){
    return state.summary;
  },
  wallets (state){
    return Object.values(state.summary).filter(function(value){
      return !!value.symbol;
    });
  },
  sortedWallets : function () {
    return Object.values(state.summary).filter(function(value){
      return !!value.symbol;
    }).sort(function (a,b) {
        if(a.balance && b.balance){
          var aStock = num(a.balance.balance) + num(a.balance.locked_balance);
          var bStock = num(b.balance.balance) + num(b.balance.locked_balance);
          return bStock-aStock;
        } else {
          return b.stock-a.stock;
        }
    });
  },
  total(state){
    if(!state.orders){
        return 0;
    }
    let TOTAL = {
      onBuy : 0, onSell : 0, afterSell : 0, netStockWorth : 0, inStockWorth : 0, netINR : 0,
      netWorth : 0, afterSellWorth  :0 
    };
    TOTAL=state.orders.reduce(function(total,n,i){
      if(n.side == 'buy')
        total.onBuy = total.onBuy + n.market_order_locked; //n.price_per_unit*n.total_quantity;
       else {
          total.afterSell = total.afterSell + (n.price_per_unit*n.total_quantity * 0.999);
          if(state.summary[n.market])
            total.onSell = total.onSell + (state.summary[n.market].ticker.last_price * n.total_quantity * 0.999);
       }
      return total;
    },TOTAL);

    if(state.summary.INR && state.summary.INR.balance)
      TOTAL.netINR = state.summary.INR.balance.balance;

    TOTAL = Object.keys(state.summary).map(function(key){
        return state.summary[key];
      }).reduce(function (total, n) {
      if(n.balance && n.ticker){
        let totalCoins = num(n.balance.balance) + num(n.balance.locked_balance);
        total.inStockWorth =  total.inStockWorth + num(n.balance.balance) * n.ticker.last_price
        total.netStockWorth = total.netStockWorth + num(totalCoins) * n.ticker.last_price;
      }
      return total;  
    },TOTAL);

    TOTAL.netWorth = num(TOTAL.netStockWorth) + num(TOTAL.netINR) + num(TOTAL.onBuy);
    TOTAL.afterSellWorth = num(TOTAL.afterSell) + num(TOTAL.inStockWorth) + num(TOTAL.onBuy) + num(TOTAL.netINR);

    return TOTAL;
  },
  orders (){
    if(!state.orders || !state.symbol){
        return [];
    }
    let symbol = state.symbol;
    let selected = state.summary[symbol];
    return [...state.orders,{
      side : 'Current Rate',
      market : symbol,
      price_per_unit : selected.ticker.last_price,
      total_quantity : selected.balance ? num(selected.balance.balance) : 0,
      _rowVariant : "warning"
    },{
       side : 'buyRate',
       market : symbol,
       price_per_unit : selected.meta.buy_rate,
       amount : selected.meta.buy_rate * (selected.balance ? selected.balance.total : 0),
       
    },{
       side : "buyRateStock", //_rowVariant : "info",
       market : symbol,
       price_per_unit : selected.meta.buy_rate_stock,
       amount : selected.meta.buy_rate_stock * (selected.balance ? selected.balance.total : 0)
    },{
       side : "24High",
       market : symbol,
       price_per_unit : selected.ticker.high,
       order : 10
    },{
       side : "24Low",
       market : symbol,
       price_per_unit : selected.ticker.low,
       order : -10
    },{
       side : "wkLow", order : -100,
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].wLow : selected.ticker.low,
    },{
       side : "wkHigh", order : 100,
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].wHigh : selected.ticker.high
    }, {
       side : "moHigh", order : 1000,
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].mHigh : selected.ticker.high
    },{
       side : "moLow", order : -1000,
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].mLow : selected.ticker.low
    }, {
      side : "yrHigh", order : 10000,
      market : symbol,
      price_per_unit : state.ranges[symbol] ? state.ranges[symbol].yHigh : selected.ticker.high
    },{
        side : "yrLow", order : -10000,
        market : symbol,
        price_per_unit : state.ranges[symbol] ? state.ranges[symbol].yLow : selected.ticker.low
    }].filter(function(order){
      return order.market == symbol;
    }).sort(function(a,b){
        let diff = b.price_per_unit - a.price_per_unit;
        if(diff == 0){
          return b.order - a.order;
        }
        return diff;
    });
  },
  trades (){
    if(!state.history || !state.symbol){
        return [];
    }
    let symbol = state.symbol;
    return state.history.filter(function(trade){
      return trade.symbol == symbol;
    }).sort(function(a,b){
        return b.timestamp - a.timestamp;
    });
  },
};

const actions = {
  async setAccount({ commit ,dispatch},account) {
    console.log("setAccount",account);
    account = (account || 1);
    account = (account  <= INDEX) ? account : 1;
    commit('summary',{});
    //commit('items',[]);
  	commit('account',account);
    dispatch('syncTicker');
    dispatch('fetchHistory');
  },
  async setSymbol({ commit,dispatch },symbol) {
    console.log("setSymbol",symbol);
    if(symbol){
      commit('symbol',symbol);
      dispatch('fetchMarketDetails');
    } else {
      commit('symbol',null);
    }
  },

  async fetchHistory({ commit,dispatch },index){
    console.log("fetchHistory")
    let _index = state.account;
    let api_key = KEYS["api_key_" + _index];
    let api_secret = KEYS["api_secret_" + _index];
    if(!api_key && !api_secret){
      return;
    }
    var timeStamp = Math.floor(Date.now());
    let body = {
      //"from_id": 352622,
      "limit": 5000,
      "timestamp": timeStamp
    }
    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')
    const options = {
      url: baseurl + "/exchange/v1/orders/trade_history",
      headers: {
        'X-AUTH-APIKEY': api_key,
        'X-AUTH-SIGNATURE': signature
      },
      json: true,
      body: body
    }

    let THIS = state;
    request.post(options, function(error, response, body) {
        for (var k in THIS.summary) {
          THIS.summary[k].meta = newSummary(k,k).meta;
        }
        var summary = THIS.summary;
        THIS.history = body;  
        for(var i in body){
          let deal = body[i];
          //let key = _index + "." + deal.symbol;
          let key = deal.symbol;
          summary[key] = summary[key] || newSummary(key,deal.symbol);
          let meta = summary[key].meta;
          if(deal.side == "sell"){
            meta.sell_quantity += num(deal.quantity);
            meta.sell_amount += num(deal.price * num(deal.quantity));
          } else if(deal.side == "buy"){
            meta.buy_quantity+= num(deal.quantity);
            meta.buy_amount+= (num(deal.price) * num(deal.quantity));
            meta.buy_rate_min = meta.buy_rate_min || 99999999999999;
            meta.buy_rate_min =  Math.min(meta.buy_rate_min,deal.price);
            meta.buy_rate_max = meta.buy_rate_max || 0;
            meta.buy_rate_max =  Math.max(meta.buy_rate_max,deal.price);

          }
          meta.fee_amount+= (deal.fee_amount - 0);

          meta.stock = meta.buy_quantity - meta.sell_quantity;
          meta.net_debit = meta.buy_amount + meta.fee_amount
          meta.net_credit = meta.sell_amount;
          meta.earning = meta.net_credit - meta.net_debit;

          if(meta.buy_quantity && !isNaN(meta.buy_quantity)){
            meta.buy_rate =  num(meta.buy_amount)/num(meta.buy_quantity);
            if(isNaN(meta.buy_rate)){
              console.log("buy_rate:isNaN",meta.buy_amount,meta.buy_quantity);
            }
          }

          meta.sell_rate = meta.sell_amount>0 ? num(meta.sell_amount)/num(meta.sell_quantity) : 0;

          if(meta.net_debit > meta.net_credit ){
            meta.efective_rate =  (meta.net_debit - meta.net_credit)/meta.stock;
          } else {
            if(meta.stock != 0){
              meta.efective_rate =  -1*(meta.earning)/meta.stock;
            } else {
              meta.efective_rate =  0;
            }
          }

          meta.buy_rate_stock = buyrate(
            meta.stock,
            meta.buy_quantity,
            meta.net_debit,
            meta.buy_rate_min,
            meta.buy_rate_max 
          );
          state.summary = summary;
        }
        commit('summary',state.summary);
        dispatch('fetchBalance');
        dispatch('fetchMarketDetails');
    });
  },
  //
  async fetchMarketDetails({ commit,dispatch },index){
    if(state.marketDetails){
      dispatch('updateMarketDetails');
    } else {
      request.get(baseurl + "/exchange/v1/markets_details",function(error, response, markets_details) {
        state.marketDetails = JSON.parse(markets_details);
        dispatch('updateMarketDetails');
      });
    }
  },
  async updateMarketDetails({ commit,dispatch },index){
    console.log("updateMarketDetails",state.symbol);
    let summary = state.summary;
    if(state.symbol){
      //THIS.sync_highlow();
    }
    for(var i in state.marketDetails){
        if(summary[state.marketDetails[i].symbol]){
          summary[state.marketDetails[i].symbol].details =  state.marketDetails[i];
        }
    }
    commit('summary',summary);
    dispatch('fetchHigLow');
  },
  //
  async fetchHigLow({ commit,dispatch,getters },index){
    console.log("fetchHigLow",state.symbol);
    if(!state.symbol){
      return;
    }    
    let ranges = state.ranges;
    let summary = state.summary;
    let endTime = new Date().getTime();
    let startTime = endTime - (1000*60*60*24*365);
    let monthTime = endTime - (1000*60*60*24*31);
    let selected = getters.selected;
    
    if(!selected || !selected.details){
      return;
    }

    request.get(baseurlPublic + `/market_data/candles?pair=${selected.details.pair}&interval=8h&startTime=${startTime}&endTime=${endTime}`,function(error, response, candles) {
        if(!state.symbol) return;
        candles = JSON.parse(candles);
        let range =  ranges[state.symbol] || {
          wHigh : null, wLow : null,
          mHigh : null, mLow : null,
          yHigh : null, yLow : null,
          highest : null, lowest : null
        };
        range.wHigh = candles[0].high;
        range.wLow = candles[0].low;
        candles.map(function (candle) {
           range.yHigh = (range.yHigh  === null) ? candle.high : Math.max(range.yHigh,candle.high);
           range.yLow = (range.yLow  === null) ? candle.low : Math.min(range.yLow,candle.low);
           if(candle.time > monthTime){
            range.mHigh = (range.mHigh  === null) ? candle.high : Math.max(range.mHigh,candle.high);
            range.mLow = (range.mLow  === null) ? candle.low : Math.min(range.mLow,candle.low);
           }
        })
        ranges[state.symbol] = range;
        if(summary[state.symbol]){
          summary[state.symbol].range = range;
        }
        commit('ranges',ranges);
        commit('summary',summary);
        state.candlesMap[state.symbol] = candles;
        commit('candles',state.candlesMap);
    });

  },
  //
  async syncTicker({ commit,dispatch,getters },index){
    let summary = state.summary;
    request.get(baseurl + "/exchange/ticker",function(error, response, body) {
        let tickers = JSON.parse(body);
        for(var i in tickers){
          var ticker = tickers[i];
          var market = ticker.market
          if(summary[market]){
            let summItem = summary[market];
            summItem.ticker = ticker;
            summItem.meta.stock_worth = summItem.meta.stock*summItem.ticker.last_price * 0.999;
            summItem.meta.now_profit = summItem.meta.stock_worth + summItem.meta.earning;
            summItem.meta.signal_sell = (summItem.ticker.high-summItem.ticker.last_price)/(summItem.ticker.high-summItem.meta.buy_rate_stock)*-100
            summItem.meta.signal_buy = (summItem.ticker.last_price-summItem.ticker.low)/(summItem.meta.buy_rate_stock-summItem.ticker.low)*100;
            //summary[market].signal_sell = summary[market].ticker.high-summary[market].ticker.last_price;
          }
        }
        commit('summary',summary);
        clearTimeout(syncTicker);
        syncTicker = setTimeout(function(){
          dispatch('syncTicker');
        },2000);
    });
  },
  //
  async fetchBalance({ commit,dispatch,getters },index){
    console.log("fetchBalance",getters.symbol);
    let _index = getters.account;
    let api_key = KEYS["api_key_" + _index];
    let api_secret = KEYS["api_secret_" + _index];

   
    var timeStamp = Math.floor(Date.now());
    // To check if the timestamp is correct
    let body = {
        "timestamp": timeStamp
    }
    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')

    const options = {
        url: baseurl + "/exchange/v1/users/balances",
        headers: {
            'X-AUTH-APIKEY': api_key,
            'X-AUTH-SIGNATURE': signature
        },
        json: true,
        body: body
    }
    let summary = getters.summary;
    let onBalance = function(balances){
      //state.balances = balances;
      //console.log("onBalance",balances);
      for(var i in balances){
        var balance = balances[i];
        let market = balance.currency + "INR";
        let mytotal = num(balance.balance) + num(balance.locked_balance);
        balance.total = mytotal;
        if(summary[market]){
          summary[market].balance = balance;
        } else if(balance.currency == "INR"){
          summary.INR = { balance : balance}
        } else if(mytotal > 0){
          console.log("market",market)
          //summary[market] = summary[market] || newSummary(market,market);
          //summary[market].balance = balance;
        }
      }
      commit('balances',balances);
      commit('summary',summary);
      dispatch('fetchOrders');
    };
    if(getters.balances) onBalance(getters.balances);
    request.post(options,function(error, response, body) {
        let balances = body;
        console.log("balances",balances)
        onBalance(balances)
    });
  },
  //
  async fetchOrders({ commit,dispatch,getters },index){
    let _index = getters.account;
    let api_key = KEYS["api_key_" + _index];
    let api_secret = KEYS["api_secret_" + _index];
    console.log("_index",_index)
    if(!api_key && !api_secret){
      return;
    }

    let summary = state.summary;
    var timeStamp = Math.floor(Date.now());
    // To check if the timestamp is correct
    console.log(timeStamp);
    let body = {
        "timestamp": timeStamp
    }
    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')

    const options = {
        url: baseurl + "/exchange/v1/orders/active_orders",
        headers: {
            'X-AUTH-APIKEY': api_key,
            'X-AUTH-SIGNATURE': signature
        },
        json: true,
        body: body
    }
    request.post(options,function(error, response, body) {
        let orders = body.orders;
        
        for(var i in orders){
          var order = orders[i];
          var market = order.market;
          //var key = _index + "." + market;
          var key = market;
          if(summary[key]){
            summary[key].order = summary[key].order || {
              onsale_amount : 0, onbuy_amount : 0
            };
            if(order.side=='sell')
              summary[key].order.onsale_amount+=(order.price_per_unit*order.remaining_quantity);
            else 
              summary[key].order.onbuy_amount+=(order.price_per_unit*order.remaining_quantity);

            summary[key].meta.postsale_amount = summary[key].order.onsale_amount * 0.999;
            summary[key].meta.postsale_profit =  summary[key].meta.postsale_amount + summary[key].meta.earning  
            //summary[key].postsale_profit =  summary[key].order.onsale_amount * 0.999 + summary[key].earning
          }  
        }
        commit('orders',orders);
        commit('summary',summary);
        clearTimeout(syncHistory);
        syncHistory = setTimeout(()=>dispatch('fetchHistory'),5000);
    });
},



  

};

const mutations = {
  account(state, account) {
    state.account = account;
  },
  symbol(state, symbol) {
    state.symbol = symbol;
  },
  summary(state, summaries) {
      state.summary = Object.assign({}, state.summary, summaries)
  }, 
  balances(state, balances) {
    state.balances = balances;
  },
  ranges(state, ranges) {
    state.ranges = ranges;
  },
  orders(state, orders) {
    state.orders = orders;
  },
  candles(state, candlesMap) {
    state.candlesMap = Object.assign({}, state.candlesMap, candlesMap);
  },
  items(state, items) {
    state.items = items;
  },
  


  KEYS(state, KEYS) {
    state.KEYS = KEYS;
  },
  KEY_LIST(state, KEY_LIST){
    state.KEY_LIST = KEY_LIST;
  },
  INDEX(state, INDEX) {
    state.INDEX = INDEX;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};
