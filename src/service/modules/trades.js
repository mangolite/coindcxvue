import Vue from 'vue';
import requestOriginal from 'request';
import crypto from 'crypto';
import formatters from "../formatter.js"
import io from 'socket.io-client';

function myb2a(base){
  let enc = btoa(base).split('=');
  return "_" + enc[0]+"_"+ (enc.length-1)
}

var request = {
  POST(a,b,c,d){
    //console.log("aaa",a.url)
    //a.url = "https://app.mehery.xyz/xms/api/v1/message/send";
     a.headers = {
       'x-print-log' : 'true',
       'x-api-replacer' : 'X-at:X-Auth',
       'X-at-APIKEY':   a.headers['X-AUTH-APIKEY'],
       'X-at-SIGNATURE': a.headers['X-AUTH-SIGNATURE'],
    };
    return new Promise(function(resolve,reject){
      requestOriginal.post(a,function(error, response, body){
        if(response.statusCode==200){
          resolve({error, response, body});
        } else {
          reject({error, response, body});
        }
        if(typeof b == 'function')
            b(error, response, body);
      });
    });

  },
  post(a,b,c,d){
    return requestOriginal.post(a,b,c,d);
  },
  get(a,b,c,d){
    //a.url = "https://app.mehery.xyz/xms/api/v1/message/send";
    return requestOriginal.get(a,b,c,d);
  }
}


//var baseurl = document.location.origin;  
//var proxy_base  = 'https://web-production-4017.up.railway.app';
var proxy_base  = 'https://app.mehery.xyz/xms/proxch';
//var proxy_base  = 'https://app.local.com/xms/proxyh';

//var baseurl = proxy_base+'/https://api.coindcx.com'
var _baseurl = proxy_base+'/'+ myb2a('https://api.coindcx.com');

//var baseurlPublic =  proxy_base+'/https://public.coindcx.com' 
var _baseurlPublic =  proxy_base+'/' + myb2a('https://public.coindcx.com'); 

function baseurl(url){
  return _baseurl + "/"+ myb2a(url);
}

function baseurlPublic(url){
  return _baseurlPublic + "/" + myb2a(url);
}

      // Place your API key and secret below. You can generate it from the website.
const socketEndpoint = "wss://stream.coindcx.com";
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
var LOADED_STAMP = Date.now();
var SKIP = true;
var STATE_TBALANCES = 'state.TBALANCES_v2';
var WIP = {};
function locked(name){
  if(WIP[name] && WIP[name] <  Date.now()) {
    return true;
  }
  WIP[name] = Date.now() + 5000; 
}
function unlock(name){
  delete WIP[name];
}

var buyrate = function(symbol,qty,tqty,tcost,min,max,depth){
  depth = depth || 0;
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
  let rng = (max-min);

  let hqty = tqty*lrng/rng;

  if(qty>hqty){
    return avg;
  }

  return  buyrate(symbol,qty,hqty, hqty*havg,avg,max,++depth);
}
function num(str){
  if(isNaN(str) || !str){
    return 0;
  } return parseFloat(str);
}

var syncHistoryTimer = 0, syncTicker=0;
var newSummary = function(key,symbol, oldSummary){
return {
          key : key, 
          symbol : symbol,
          meta : {
            debt_quantity :0,debt_amount : 0, debt_rate : 0,
            buy_quantity : 0 , buy_amount : 0,
            sell_quantity : 0 , sell_amount : 0,
            earning : 0, extra_stock : 0,extra_amount : 0,
            fee_amount : 0,
            starting_coins : 0,
            buy_rate : 0, sell_rate : 0,
            efective_rate : 0, now_rate : 0, buy_rate_low : 0,buy_rate_high : 0,buy_rate_eff : 0,
            stock : oldSummary?.meta?.stock, stock_quantity : oldSummary?.meta?.stock_quantity,
            stock_worth : oldSummary?.meta?.stock_worth,
            postsale_profit : oldSummary?.meta?.postsale_profit,
            postsale_amount : 0 // has to be ZERO in the start,, otherwise new value will be added old value
          }, 
          order : {
            onsale_amount : 0, onbuy_amount : 0,
            onsale_qty : 0, onbuy_qty : 0,
            onsale_rate : 0, onbuy_rate : 0
          },
          range : {
          },
          _showDetails : false,
          ticker : {},
          balance : {}
  }
}


function newDate(){
  return {
    items: [],
    selected : null, symbol : null,
    ticker : null,
    summary : {},
    nowIndex : 1, INDEX : INDEX, account : 1,
    orders : null, history : null,
    ranges : {},
    KEY_LIST : KEY_LIST,
    keyIndex : null,

    marketDetails : null,balances : null,candlesMap : {},
    local : { LOADED_STAMP : 0},
    TBALANCES : []
  }
}

const state = newDate();

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
  local: (state) => state.local,
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
  sortedWallets : function (state) {
    return Object.values(state.summary).filter(function(value){
      return !!value.symbol 
        && (
              !!Math.round(num(value?.meta?.stock_worth)) 
            || !!Math.round(num(value?.meta?.onbuy_amount))
            || !!Math.round(num(value?.meta?.onsale_amount))
            //!!value?.order?.onbuy_qty || !!value.order?.onsale_qty  ||
            //!!num(value?.balance?.balance) || !!num(value?.balance?.locked_balance)
          );
    });
  },
  total(state){
    if(!state.orders){
        return 0;
    }
    let TOTAL = {
      onBuy : 0, onSell : 0, afterSell : 0, netStockWorth : 0, inStockWorth : 0, netINR : 0,
      netWorth : 0, afterSellWorth  :0 , earning : 0,investment : 0, now_profit : 0,
      net_debit : 0, net_credit : 0, buy_amount : 0,extra_amount : 0,
      buy_rate_stock_amount : 0,buy_rate_avg_amount : 0, onsale_amount_total : 0
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
      if(n.balance){
        let totalCoins = num(num(n.balance.balance) + num(n.balance.locked_balance));
        if(n.ticker){
          let last_price = num(n.ticker.last_price)
          total.inStockWorth =  total.inStockWorth + num(n.balance.balance) * last_price
          total.netStockWorth = total.netStockWorth + num(totalCoins) * last_price;
          if(n.meta && n.meta.stock_quantity != totalCoins){
            n.meta.extra_stock = num(totalCoins - n.meta.stock_quantity);
            n.meta.extra_amount = Math.round(n.meta.extra_stock * last_price);
            total.extra_amount  = total.extra_amount + n.meta.extra_amount;
          }
        }
      }
      total.earning = (total.earning + num(n?.meta?.earning))
      total.net_debit = (total.net_debit) + num(n?.meta?.net_debit);
      total.buy_amount = num(total.buy_amount) + num(n?.meta?.buy_amount);
      total.net_credit = num(total.net_credit) + num(n?.meta?.net_credit);
      total.buy_rate_stock_amount = num(total.buy_rate_stock_amount) + (
        num(n?.meta?.buy_rate_stock || 0) * num(n?.balance?.total || 0)
      );
      total.buy_rate_avg_amount = num(total.buy_rate_avg_amount) + (
        num(n?.meta?.buy_rate || 0) * num(n?.balance?.total || 0)
      );
      total.onsale_amount_total = num(total.onsale_amount_total) + (
        Math.max(num(n?.order?.onsale_rate || 0),num(n?.ticker?.last_price || 0)) * num(n?.balance?.total || 0)
      );

      return total;  
    },TOTAL);

    TOTAL.netWorth = num(TOTAL.netStockWorth) + num(TOTAL.netINR) + num(TOTAL.onBuy);
    TOTAL.afterSellWorth = num(TOTAL.afterSell) + num(TOTAL.inStockWorth) + num(TOTAL.onBuy) + num(TOTAL.netINR);
    TOTAL.investment =  TOTAL.earning -  TOTAL.netINR - TOTAL.onBuy - TOTAL.extra_amount;
    TOTAL.now_profit = TOTAL.netWorth + TOTAL.investment;

    return TOTAL;
  },
  totalBalance(state){
    let TOTAL = {
      onBuy : 0, onSell : 0, afterSell : 0, netStockWorth : 0, inStockWorth : 0, netINR : 0,
      netWorth : 0, afterSellWorth  :0, now_profit : 0, investment : 0,net_debit : 0, net_credit : 0, buy_amount : 0
    };
    return state.TBALANCES.reduce(function(TOTAL,b){
      if(b){
        TOTAL.onBuy+= num(b.onBuy);
        TOTAL.onSell+= num(b.onSell);
        TOTAL.afterSell+= num(b.afterSell);
        TOTAL.netStockWorth+= num(b.netStockWorth);
        TOTAL.inStockWorth+= num(b.inStockWorth);
        TOTAL.netINR+= num(b.netINR);
        TOTAL.netWorth+= num(b.netWorth);
        TOTAL.afterSellWorth+= num(b.afterSellWorth);
        TOTAL.now_profit+= num(b.now_profit);
        TOTAL.investment+= num(b.investment);
        TOTAL.net_debit+=num(b.net_debit);
        TOTAL.net_credit+=num(b.net_credit);
        TOTAL.buy_amount+=num(b.buy_amount);
      }
      return TOTAL;
    },TOTAL);
  },
  orders (state){
    if(!state.orders || !state.symbol){
        return [];
    }
    let symbol = state.symbol;
    let selected = state.summary[symbol];
    return [...state.orders,{
      side : 'Current Rate',
      market : symbol,
      price_per_unit : selected.ticker.last_price,
      total_quantity : (selected.balance ? selected.balance.total : 0),
      _rowVariant : "warning"
    },{
      side : "Buy Rate High", //_rowVariant : "info",
      market : symbol, order : 20, 
      price_per_unit : selected.meta.buy_rate_high,
      amount : selected.meta.buy_rate_high * (selected.balance ? selected.balance.total : 0),
      total_quantity : (selected.balance ? selected.balance.total : 0),
       _rowVariant : "buyRateStock"
    },{
      side : "Buy Rate Stock", //_rowVariant : "info",
      market : symbol,  order : 10, 
      price_per_unit : selected.meta.buy_rate_stock,
      amount : selected.meta.buy_rate_stock * (selected.balance ? selected.balance.total : 0),
      total_quantity : (selected.balance ? selected.balance.total : 0),
       _rowVariant : "buyRateStock"
    },{
      side : 'Buy Rate Avg',
      market : symbol, order : 0, 
      price_per_unit : selected.meta.buy_rate,
      amount : selected.meta.buy_rate * selected.meta.buy_quantity,
      total_quantity : selected.meta.buy_quantity,
       _rowVariant : "buyRate"
   }, {
      side : 'Buy Rate Alpha',
      market : symbol,  order : -5, 
      price_per_unit : selected.meta.buy_rate_alpha,
      amount : selected.meta.buy_rate_alpha * (selected.balance ? selected.balance.total : 0),
      total_quantity : (selected.balance ? selected.balance.total : 0),
       _rowVariant : "buyRateStock"
  },{
      side : "Buy Rate Eff.", //_rowVariant : "info",
      market : symbol,order : -10, 
      price_per_unit : selected.meta.buy_rate_eff,
      amount : selected.meta.buy_rate_eff * (selected.balance ? selected.balance.total : 0),
      total_quantity : (selected.balance ? selected.balance.total : 0),
      _rowVariant : "buyRateStock"
    },{
      side : "Buy Rate Low", //_rowVariant : "info",
      market : symbol, order : -20, 
      price_per_unit : selected.meta.buy_rate_low,
      amount : selected.meta.buy_rate_low * (selected.balance ? selected.balance.total : 0),
      total_quantity : (selected.balance ? selected.balance.total : 0),
       _rowVariant : "buyRateStock"
    },{
       side : "Sell Rate",_rowVariant : "SellRate",
       market : symbol,
       price_per_unit : selected.meta.sell_rate,
       total_quantity : selected.meta.sell_quantity,
       amount : selected.meta.sell_amount,
    },{
       side : "OnSale",_rowVariant : "OnSell",  desc : "Coins you have put on SELL",
       market : symbol,
       price_per_unit : selected.order.onsale_rate,
       total_quantity : selected.order.onsale_qty,
       amount : selected.meta.postsale_amount,
    },{
       side : "OnBuy",_rowVariant : "OnBuy", desc : "Coins you have ordered to BUY",
       market : symbol, 
       price_per_unit : selected.order.onbuy_rate,
       total_quantity : selected.order.onbuy_qty,
       amount : selected.meta.postbuy_amount,
    },{
       side : "24-High", _rowVariant : "24-High",
       market : symbol,
       price_per_unit : selected.ticker.high,
       order : 10
    },{
       side : "24-Low", _rowVariant : "24-Low",
       market : symbol,
       price_per_unit : selected.ticker.low,
       order : -10
    },{
       side : "Wk-Low", order : -100,  _rowVariant : "Wk-Low",
       market : symbol,
       price_per_unit : Math.min(state.ranges[symbol] ? state.ranges[symbol].wLow : selected.ticker.low,selected.ticker.low),
    },{
       side : "Wk-High", order : 100, _rowVariant : "Wk-High",
       market : symbol,
       price_per_unit : Math.max(state.ranges[symbol] ? state.ranges[symbol].wHigh : selected.ticker.high,selected.ticker.high)
    },{
       side : "Mo-High", order : 1000,  _rowVariant : "Mo-High",
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].mHigh : selected.ticker.high
    },{
       side : "Mo-Low", order : -1000,  _rowVariant : "Mo-Low",
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].mLow : selected.ticker.low
    },{
       side : "3Mo-High", order : 5000,  _rowVariant : "3Mo-High", desc : "Three months HIGH",
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].m3High : selected.ticker.high
    },{
       side : "3Mo-Low", order : -5000,  _rowVariant : "3Mo-Low", desc : "Three months LOW",
       market : symbol,
       price_per_unit : state.ranges[symbol] ? state.ranges[symbol].m3Low : selected.ticker.low
    },{
      side : "Yr-High", order : 10000,  _rowVariant : "Yr-High",
      market : symbol,
      price_per_unit : state.ranges[symbol] ? state.ranges[symbol].yHigh : selected.ticker.high
    },{
        side : "Yr-Low", order : -10000,  _rowVariant : "Yr-Low",
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
    }).map(function(order){
      if(order.price_per_unit > selected.ticker.ask){
        order.sidex =  'SELL';
      } else if(order.price_per_unit < selected.ticker.bid){
        order.sidex =  'BUY';
      } else {
        order.sidex =  'BUYSELL';
      }
      return order;
    });
  },
  trades (state){
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
  alltrades (state){
    if(!state.history){
        return [];
    }
    let lastWeek = Date.now() - 1000*60*60*24*7;
    return state.history.sort(function(a,b){
      return b.timestamp - a.timestamp;
    }).filter(function(trade,i){
      return trade.timestamp > lastWeek || i < 50;
    });
  }
};



const snippet = {
  async fetchHistory({
    api_secret,api_key
  }){
    let hasMore = true;
    let from_id = null;
    let hist = [];
    while(hasMore){
      var timeStamp = Math.floor(Date.now());
      let body = {
        //"limit": 5000,
        "timestamp": timeStamp
      };
      if(from_id){
        body.from_id = from_id;
      }
      const payload = new Buffer(JSON.stringify(body)).toString();
      const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')
      const options = {
        url: baseurl ( "/exchange/v1/orders/trade_history"),
        headers: {
          'X-AUTH-APIKEY': api_key,
          'X-AUTH-SIGNATURE': signature
        },
        json: true,
        body: body
      } 
      let resp = await request.POST(options);
      hasMore = !(resp.body.length<500);
      from_id = resp.body[resp.body.length-1].id;
      hist = [...hist,...resp.body];
    }
    return hist;
  }
};

const actions = {
  async setAccount({ commit ,dispatch},account) {
    console.log("setAccount",account);
    account = (account || 1);
    account = (account  <= INDEX) ? account : 1;

    let newState = newDate();
    Object.keys(newState).map(function(key){
      state[key] = newState[key];
    });

    state.summary = {};
    state.marketDetails = null;
    state.orders = null;
    state.balances = null;
    try{
      state.TBALANCES  = JSON.parse(localStorage.getItem(STATE_TBALANCES),"[]");
      commit('TBALANCES',state.TBALANCES);
    } catch(e){
      state.TBALANCES = [];
    }

    commit('history',state.history);
    commit('summary',state.summary);
    commit('orders',state.orders);
    commit('balances',state.balances);

    //commit('items',[]);
  	commit('account',account);
    dispatch('syncTicker');
    dispatch('syncHistory');
    dispatch('updateLocal');
    dispatch('TBALANCES');
    dispatch('syncAccount');
    
  },
  async setSymbol({ commit,dispatch },symbol) {
    console.log("setSymbol",symbol);
    if(symbol){
      commit('symbol',symbol);
      dispatch('fetchMarketDetails');
    } else {
      commit('symbol',null);
    }
    dispatch('TBALANCES');
  },

  async TBALANCES({ commit,dispatch,getters }){
    let _index = state.account;
    state.TBALANCES = state.TBALANCES || [];
    state.TBALANCES[_index-1] = {
    };
    Object.keys(getters.total).map(function(key){
      state.TBALANCES[_index-1][key] = num(getters.total[key]);
    });

    try {
      localStorage.setItem(STATE_TBALANCES,JSON.stringify(state.TBALANCES || []));
    } catch(e){
      console.log("Not Saved")
    }
    commit('TBALANCES',state.TBALANCES);
  },
  async syncHistory({ commit,dispatch,getters },gap){
      clearTimeout(syncHistoryTimer);
      syncHistoryTimer = setTimeout(()=>dispatch('fetchHistory'),gap);
      dispatch('TBALANCES');
  },

  async fetchHistory({ commit,dispatch },index){
    if(locked("fetchHistory")) return ;
    console.log("NaN:fetchHistory");
    let _index = state.account;
    let api_key = KEYS["api_key_" + _index];
    let api_secret = KEYS["api_secret_" + _index];
    if(!api_key && !api_secret){
      return;
    }

    try {
      let resp = await snippet.fetchHistory({
        api_key : api_key,
        api_secret : api_secret,
      });
      console.log("fetchHistory:resp",resp);

      let THIS = state;
      (function(body) {
          for (var k in THIS.summary) {
            THIS.summary[k].meta = newSummary(k,k,THIS.summary[k] || {}).meta;
          }
          var summary = THIS.summary;
          THIS.history = body.sort(function(a,b){
            if(a.side == b.side){
              return a.price - b.price;
            } else if(a.side == "sell") {
              return -1
            }
            return 1;
          });
          for(var i in THIS.history){
            let deal = THIS.history[i];
            deal.i = i;
            //let key = _index + "." + deal.symbol;
            let key = deal.symbol;
            summary[key] = summary[key] || newSummary(key,deal.symbol,{});
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
            deal.last_price = summary[key]?.ticker?.last_price;
            meta.fee_amount+= (deal.fee_amount - 0);
  
            meta.stock_quantity = meta.buy_quantity - meta.sell_quantity;
            meta.stock = Math.max(meta.stock_quantity,0);
            meta.net_debit = meta.buy_amount + meta.fee_amount
            meta.net_credit = meta.sell_amount;
            meta.earning = meta.net_credit - meta.net_debit;
  
  
            if(meta.buy_quantity && !isNaN(meta.buy_quantity)){
              meta.debt_rate =  num(meta.net_debit)/num(meta.buy_quantity);
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
                meta.efective_rate =  (-1*(meta.earning)/meta.stock);
              } else {
                meta.efective_rate =  0;
              }
            }
  
            if(deal.side == "buy"){
              if(meta.buy_quantity > meta.sell_quantity){
                meta.debt_quantity+= num(deal.quantity);
                meta.debt_amount+= (num(deal.price) * num(deal.quantity));
                meta.debt_rate = meta.debt_amount/ meta.debt_quantity;
              }
            }
  
            meta.buy_rate_stock = meta.debt_rate || buyrate(
              key,
              meta.stock,
              meta.buy_quantity,
              meta.net_debit,
              meta.buy_rate_min,
              meta.buy_rate_max
            );
            meta.buy_rate_eff = Math.max(meta.efective_rate,meta.buy_rate_min);
            meta.buy_rate_low = Math.min(meta.buy_rate,meta.buy_rate_eff);
            meta.buy_rate_high = Math.max(meta.buy_rate_max,meta.buy_rate_eff,meta.buy_rate);
            meta.buy_rate_alpha = (meta.buy_rate_eff+meta.buy_rate_stock)/2;
  
            state.summary = summary;
          }
          commit('summary',state.summary);
          commit('history',state.history);
          dispatch('fetchBalance');
          dispatch('fetchMarketDetails');
          dispatch('updateLocal');
          dispatch('TBALANCES');
          unlock("fetchHistory");
        })(resp);

    } catch(e){
      console.log(e);
    }
  },
  //
  async fetchMarketDetails({ commit,dispatch },index){
    if(state.marketDetails){
      dispatch('updateMarketDetails');
    } else {
      request.get(baseurl("/exchange/v1/markets_details"),function(error, response, markets_details) {
        state.marketDetails = JSON.parse(markets_details);
        dispatch('updateMarketDetails', true);
      });
    }
  },
  async updateMarketDetails({ commit,dispatch },isFetched){
    console.log("updateMarketDetails",state.symbol);
    let summary = state.summary;
    if(state.symbol){
      //THIS.sync_highlow();
    }
    for(var i in state.marketDetails){
        if(summary[state.marketDetails[i].symbol]){
          summary[state.marketDetails[i].symbol].details =  state.marketDetails[i];
          if(isFetched){
            (function(params,gap){
                  setTimeout(()=>dispatch('fetchHigLow',params),gap)
            })({ 
                  pair : summary[state.marketDetails[i].symbol].details.pair,
                  symbol : state.marketDetails[i].symbol
            },1000*i);
          }
        }
    }
    commit('summary',summary);
    dispatch('fetchHigLowSelected');
    dispatch('updateLocal');
    dispatch('TBALANCES');
  },
  //

  async fetchHigLowSelected({ commit,dispatch,getters },index){
      let selected = getters.selected;
      if(!selected || !selected.details){
        return;
      }
      dispatch('fetchHigLow',{ pair : selected.details.pair, symbol : state.symbol });
  },

  async fetchHigLow({ commit,dispatch,getters },{pair,symbol}){
    if(!symbol){
      return;
    }    
    let ranges = state.ranges;
    let summary = state.summary;
    let endTime = Date.now();
    let startTime = endTime - (1000*60*60*24*365);
    let monthTime = endTime - (1000*60*60*24*31);
    let m3Time = endTime - (1000*60*60*24*31*3);
    let wkTime = endTime - (1000*60*60*24*7);
    let dayTime = endTime - (1000*60*60*24);

    request.get(baseurlPublic('/market_data/candles') + `?pair=${pair}&interval=8h&startTime=${startTime}&endTime=${endTime}`,function(error, response, candles) {
        if(!symbol){
            console.log("Cannot find symbol",symbol)
            return;          
        } 
        candles = JSON.parse(candles);
        let range =  ranges[symbol] || {
          dHigh : null, dLow : null,
          wHigh : null, wLow : null,
          mHigh : null, mLow : null,
          m3High : null, m3Low : null,
          yHigh : null, yLow : null,
          highest : null, lowest : null
        };
        range.wHigh = candles[0].high;
        range.wLow = candles[0].low;
        candles.map(function (candle) {
           range.yHigh = (range.yHigh  === null) ? candle.high : Math.max(range.yHigh,candle.high);
           range.yLow = (range.yLow  === null) ? candle.low : Math.min(range.yLow,candle.low);
          
            //Three Months Time
           if(candle.time > m3Time){
              range.m3High = (range.m3High  === null) ? candle.high : Math.max(range.m3High,candle.high);
              range.m3Low = (range.m3Low  === null) ? candle.low : Math.min(range.m3Low,candle.low);

                 //Month Time
                 if(candle.time > monthTime){
                    range.mHigh = (range.mHigh  === null) ? candle.high : Math.max(range.mHigh,candle.high);
                    range.mLow = (range.mLow  === null) ? candle.low : Math.min(range.mLow,candle.low);
                    
                    //Week Time
                    if(candle.time > wkTime){
                        range.wHigh = (range.wHigh  === null) ? candle.high : Math.max(range.wHigh,candle.high);
                        range.wLow = (range.wLow  === null) ? candle.low : Math.min(range.wLow,candle.low);

                        //Day Time
                        if(candle.time > dayTime){
                            range.dHigh = (range.dHigh  === null) ? candle.high : Math.max(range.dHigh,candle.high);
                            range.dLow = (range.dLow  === null) ? candle.low : Math.min(range.dLow,candle.low);
                        }
                    }
                }
            }
        })
        ranges[symbol] = range;
        if(summary[symbol]){
          console.log("Added Range");
          summary[symbol].range = range;
        } else {
          console.log("NotAdded Range");
        }
        commit('ranges',ranges);
        commit('summary',summary);
        state.candlesMap[symbol] = candles;
        commit('candles',state.candlesMap);
        dispatch('updateLocal');
        dispatch('TBALANCES');
    });

  },
  //
  async syncTicker({ commit,dispatch,getters },index){
    if(locked("syncTicker")) return ;

    let summary = state.summary;
    request.get(baseurl ("/exchange/ticker"),function(error, response, body) {
        let tickers = JSON.parse(body);
        for(var i in tickers){
          var ticker = tickers[i];
          var market = ticker.market
          if(summary[market]){
            let summItem = summary[market];
            summItem.ticker = ticker;
            summItem.meta.stock_worth = summItem.meta.stock * summItem.ticker.last_price * 0.999;
            summItem.meta.now_profit = summItem.meta.stock_worth + summItem.meta.earning;
            summItem.meta.signal_sell = (summItem.ticker.high-summItem.ticker.last_price)/(summItem.ticker.high-summItem.meta.buy_rate_stock)*-100
            summItem.meta.signal_buy = (summItem.ticker.last_price-summItem.ticker.low)/(summItem.meta.buy_rate_stock-summItem.ticker.low)*100;
            //summary[market].signal_sell = summary[market].ticker.high-summary[market].ticker.last_price;
          }
        }
        commit('summary',summary);
        dispatch('updateLocal');
        clearTimeout(syncTicker);
        syncTicker = setTimeout(function(){
          dispatch('syncTicker');
          dispatch('TBALANCES');
        },2000);
        unlock("syncTicker");
    });
  },
  //
  async fetchBalance({ commit,dispatch,getters },index){
    if(locked("fetchBalance")) return ;

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
        url: baseurl("/exchange/v1/users/balances"),
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
      dispatch('updateLocal');
      dispatch('fetchOrders');
      dispatch('TBALANCES');
    };
    if(getters.balances) onBalance(getters.balances);
    request.post(options,function(error, response, body) {
        let balances = body;
        console.log("balances",balances)
        onBalance(balances);
        unlock("fetchBalance");
    });
  },
  //
  async fetchOrders({ commit,dispatch,getters },index){
    if(locked("fetchOrders")) return;

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
        url: baseurl ("/exchange/v1/orders/active_orders"),
        headers: {
            'X-AUTH-APIKEY': api_key,
            'X-AUTH-SIGNATURE': signature
        },
        json: true,
        body: body
    }
    request.post(options,function(error, response, body) {
        let orders = body.orders;
        
        for(var keyi in summary){
          summary[keyi].order = newSummary(keyi,keyi).order;
        }
        for(var i in orders){
          var order = orders[i];
          var market = order.market;
          //var key = _index + "." + market;
          var key = market;
          if(summary[key]){
            //summary[key].order = summary[key].order;
            if(order.side=='sell') {
              summary[key].order.onsale_qty += order.remaining_quantity;
              summary[key].order.onsale_amount += (order.price_per_unit * order.remaining_quantity);
           } else {
              summary[key].order.onbuy_qty += order.remaining_quantity;
              summary[key].order.onbuy_amount += (order.price_per_unit * order.remaining_quantity);
            }

            summary[key].meta.postbuy_amount = summary[key].order.onbuy_amount * 0.999;
            summary[key].meta.postsale_amount = summary[key].order.onsale_amount * 0.999;
            summary[key].meta.postsale_profit =  summary[key].meta.postsale_amount + summary[key].meta.earning  
            //summary[key].postsale_profit =  summary[key].order.onsale_amount * 0.999 + summary[key].earning


            summary[key].order.onsale_rate = summary[key].meta.postsale_amount/summary[key].order.onsale_qty;
            summary[key].order.onbuy_rate = summary[key].meta.postbuy_amount/summary[key].order.onbuy_qty;

          }  
        }
        commit('orders',orders);
        commit('summary',summary);
        dispatch('updateLocal');
        dispatch('syncHistory',5000);
        dispatch('TBALANCES');
        unlock("fetchOrders")
    });
},


async updateLocal({ commit,dispatch,getters }){
  let lastRates = localStorage.getItem('lastRates');
  if(lastRates == 'null') lastRates = null;
  state.local = lastRates ? JSON.parse(lastRates) : (state.local || { LOADED_STAMP : 0});
  let toUpdate = state.local.LOADED_STAMP != LOADED_STAMP && (LOADED_STAMP - state.local.LOADED_STAMP)> 300000;
  if(toUpdate) state.local.LOADED_STAMP = LOADED_STAMP;
  let anyUpdate = false;
  for(var s in state.summary){
    let sum = state.summary[s];
    if(toUpdate || !state.local[sum.symbol]){
      state.local[sum.symbol+"_last"] =  state.local[sum.symbol] || state.local[sum.symbol+"_last"] || 0;
      state.local[sum.symbol] =  sum?.ticker?.last_price || state.local[sum.symbol] || 0;
      anyUpdate = true;
    }
  }
  if(anyUpdate){
    commit('local',state.local);
    localStorage.setItem('lastRates',JSON.stringify(state.local));
  } 
},

    async subscriber(){

            let _index = getters.account;
            let api_key = KEYS["api_key_" + _index];
            let api_secret = KEYS["api_secret_" + _index];
            console.log("_index",_index)
            if(!api_key && !api_secret){
              return;
            }

          //connect to server.
          const socket = io(socketEndpoint, {
            transports: ['websocket']
          });

          const secret = "secret";
          const key = "key";


          const body = { channel: "coindcx" };
          const payload = new Buffer(JSON.stringify(body)).toString();
          const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')

          //Join channel
          socket.emit('join', {
            'channelName': "coindcx",
            'authSignature': signature,
            'apiKey' : api_key
          });


          //Listen update on eventName
          socket.on("balance-update", (response) => {
            if (response.event == "balance-update") {
              console.log("****balance-update",response.data);
            }
          });

          socket.on("trade-update", (response) => {
            console.log("****trade-update",response.data);
          });



    },

    async cancelOrder({commit,getters},order){

      if(!window.confirm(`
        Are you sure you want to cancel?
        ${order.price_per_unit}x${order.total_quantity}=${order.amount}
      `)){
        return;
      }


      let _index = getters.account;
      let api_key = KEYS["api_key_" + _index];
      let api_secret = KEYS["api_secret_" + _index];
      console.log("_index",_index)
      if(!api_key && !api_secret){
        return;
      }
      console.log("cancelOrder",order.id)
      var timeStamp = Math.floor(Date.now());
      // To check if the timestamp is correct
      console.log(timeStamp);
      let body = {
          "timestamp": timeStamp,
          id : order.id
      }
      const payload = new Buffer(JSON.stringify(body)).toString();
      const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')
  
      const options = {
          url: baseurl ("/exchange/v1/orders/cancel"),
          headers: {
              'X-AUTH-APIKEY': api_key,
              'X-AUTH-SIGNATURE': signature
          },
          json: true,
          body: body
      }

      request.post(options,function(error, response, body) {
        Vue.$toast.success(body.message);
      });

    },


    async makeOrder({commit,getters},order){

      if(!window.confirm(`
        Are you sure you want to make ${order.type}? 
        ${order.ppu}x${order.quantity}=${order.amount}
      `)){
        return;
      }


      let _index = getters.account;
      let api_key = KEYS["api_key_" + _index];
      let api_secret = KEYS["api_secret_" + _index];
      console.log("_index",_index)
      if(!api_key && !api_secret){
        return;
      }
      console.log("cancelOrder",order.id)
      var timeStamp = Math.floor(Date.now());
      // To check if the timestamp is correct
      console.log(timeStamp);
      let body = {
          "timestamp": timeStamp,
          side : order.type.toLowerCase(),
          "order_type": "limit_order",
          "market": order.market,
          "price_per_unit": order.ppu,
          total_quantity : order.quantity
      }
      const payload = new Buffer(JSON.stringify(body)).toString();
      const signature = crypto.createHmac('sha256', api_secret).update(payload).digest('hex')
  
      const options = {
          url: baseurl ("/exchange/v1/orders/create"),
          headers: {
              'X-AUTH-APIKEY': api_key,
              'X-AUTH-SIGNATURE': signature
          },
          json: true,
          body: body
      }

      request.post(options,function(error, response, body) {
        Vue.$toast.success(body.message || order.type + " Success");
      });

    }
};

const mutations = {
  account(state, account) {
    state.account = account;
  },
  symbol(state, symbol) {
    state.symbol = symbol;
  },
  summary(state, summaries) {
      for(var s in summaries){
        let wallet = summaries[s];
        let last_price_seen = parseFloat(state.local[wallet.symbol]);
        wallet.last_price_seen = last_price_seen;
        if(wallet.ticker){
          wallet.volatlity = (wallet.ticker.high - wallet.ticker.low)/wallet.ticker.high;
          wallet.seen_delta = 100 * (
              parseFloat(wallet?.ticker?.last_price || 0) - last_price_seen
          ) / last_price_seen;
        }
      }
      state.summary = Object.assign({}, state.summary, summaries);
  }, 
  local(state, local) {
    state.local = Object.assign({}, state.local,local);
  },
  balances(state, balances) {
    state.balances = balances;
  },
  history(state, history) {
    state.history = history;
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
  TBALANCES(state,TBALANCES){
    console.log("TBALANCES",TBALANCES);
    state.TBALANCES = Object.assign([], state.TBALANCES , TBALANCES);
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
