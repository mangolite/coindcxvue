import Vue from 'vue';
import request from 'request';
import store from './store';
//import axios from 'axios';
import crypto from 'crypto';

import formatter from '../formatter';
import Dashboard from './Dashboard.vue';
import Summary from './Summary.vue';
import Orders from './Orders.vue';
import History from './History.vue';



export default {
  data: () => ({
        items: [],
        selected : null, selected_symbol : null,
        ticker : null,
        summary : {},
        nowIndex : 1, INDEX : INDEX,
        apiName : null, apiNameState :  null,
        apiKey : null, apiKeyState : null,
        apiSecret : null, apiSecretState : null,
        orders : null, history : null,
        ranges : {},
        KEY_LIST : KEY_LIST,
        keyIndex : null
  }),
    reload : function () {
      this.setIndex();
      this.onCurrencySelect();
    },
    setIndex : function(){
      console.log("Account Changed ", this.$route.params.account);
      var index = (this.$route.params.account || 1)
      this.nowIndex = (index  <= INDEX) ? index : 1;
      //this.apiKey = KEYS["api_key_" + this.nowIndex];
      //this.apiSecret = KEYS["api_secret_" + this.nowIndex];
      this.items = []
      this.summary = {};

      clearTimeout(sync_ticker);
      clearTimeout(sync_history);
      this.sync_ticker(0);
      this.sync_history(0);
    },
    onCurrencySelect : function(){
        var currency = this.$route.params.currency;
        if(currency){
            this.selected = this.items.filter(function(item) {
              return item.symbol == currency;
            })[0];
            //if(this.selected_symbol != currency){
              this.sync_markets_details();
            //}
            this.selected_symbol = currency;
            console.log("row._showDetails",this.selected_symbol);
        } else {
          this.selected = null;
          this.selected_symbol = null;
        }
    },
    getIndex : function () {
      console.log("getIndex",this.nowIndex,INDEX);
      if(this.nowIndex <= INDEX){
         return this.nowIndex;
       } return 1;
    },
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    sync_markets_details : function () {
      console.log("sync_markets_details","this.summary",this.summary);
      let THIS = this;
      let summary = this.summary;
      if(this.selected && this.selected.details){
        THIS.sync_highlow();
      }
      request.get(baseurl + "/exchange/v1/markets_details",function(error, response, markets_details) {
        let marketsDetails = JSON.parse(markets_details);
        for(var i in marketsDetails){
            if(summary[marketsDetails[i].symbol]){
              summary[marketsDetails[i].symbol].details =  marketsDetails[i];
            }
        }
        THIS.sync_highlow();
      });
    },
    sync_highlow: function() {
        var THIS = this;
        
        console.log("sync_highlow",THIS.selected);
        if(!THIS.selected  ||   !THIS.selected.details){
          return;
        }
        let ranges = this.ranges;

        let endTime = new Date().getTime();
        let startTime = endTime - (1000*60*60*24*32)


        request.get(baseurlPublic + `/market_data/candles?pair=${this.selected.details.pair}&interval=1w&startTime=${startTime}&endTime=${endTime}`,function(error, response, candles) {
            if(!THIS.selected) return;
            candles = JSON.parse(candles);
            let range =  ranges[THIS.selected.symbol] || {
              wHigh : null, wLow : null,
              mHigh : null, mLow : null,
              highest : null, lowest : null
            };

            range.wHigh = candles[0].high;
            range.wLow = candles[0].low;
            candles.map(function (candle) {
               range.mHigh = (range.mHigh  === null) ? candle.high : Math.max(range.mHigh,candle.high);
               range.mLow = (range.mLow  === null) ? candle.low : Math.min(range.mLow,candle.low);

            })
            ranges[THIS.selected.symbol] = range;
        });

    },
    sync_ticker: function() {
        var THIS = this;
        let summary = this.summary;
        request.get(baseurl + "/exchange/ticker",function(error, response, body) {
            let tickers = JSON.parse(body);
            for(var i in tickers){
              var ticker = tickers[i];
              var market = ticker.market
              if(summary[market]){
                summary[market].ticker = ticker;
                summary[market].stock_worth = summary[market].stock*summary[market].ticker.last_price * 0.999;
                summary[market].now_profit = summary[market].stock_worth + summary[market].earning;
                summary[market].signal_sell = (summary[market].ticker.high-summary[market].ticker.last_price)/(summary[market].ticker.high-summary[market].buy_rate_stock)*-100
                summary[market].signal_buy = (summary[market].ticker.last_price-summary[market].ticker.low)/(summary[market].buy_rate_stock-summary[market].ticker.low)*100;
                //summary[market].signal_sell = summary[market].ticker.high-summary[market].ticker.last_price;
              }
            

            }
          clearTimeout(sync_ticker);
          sync_ticker = setTimeout(()=>THIS.sync_ticker(),2000);
        });
    },
    sync_balance: function(index) {
        let _index = this.getIndex(index)
        let api_key = KEYS["api_key_" + _index];
        let api_secret = KEYS["api_secret_" + _index];
        console.log("_index",_index)

        let summary = this.summary;
        var timeStamp = Math.floor(Date.now());
        // To check if the timestamp is correct
        console.log(timeStamp);
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
        let THIS = this;
        request.post(options,function(error, response, body) {
            let balances = body;
            for(var i in balances){
              var balance = balances[i];
              let market = balance.currency + "INR";
              if(summary[market]){
                summary[market].balance = balance;
                //summary[market].instock_worth= (balance.balance * summary[market].ticker.last_price * 0.999);
              } else if(balance.currency == "INR"){
                summary.INR = { balance : balance}
              }

            }
          THIS.sync_orders(_index);
        });
    },
   sync_orders : function(index) {
        let _index = this.getIndex(index)
        let api_key = KEYS["api_key_" + _index];
        let api_secret = KEYS["api_secret_" + _index];
        console.log("_index",_index)
        if(!api_key && !api_secret){
          return;
        }

        let summary = this.summary;
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
        var THIS =  this;
        request.post(options,function(error, response, body) {
            THIS.orders = body.orders;
            
            for(var i in THIS.orders){
              var order = THIS.orders[i];
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

                summary[key].postsale_amount = summary[key].order.onsale_amount * 0.999;
                summary[key].postsale_profit =  summary[key].postsale_amount + summary[key].earning  
                //summary[key].postsale_profit =  summary[key].order.onsale_amount * 0.999 + summary[key].earning
              }  
            }
            clearTimeout(sync_history);
            sync_history = setTimeout(()=>THIS.sync_history(_index),5000);
        });
    },
    sync_history: function(index) {
      let _index = this.getIndex(index)
      let api_key = KEYS["api_key_" + _index];
      let api_secret = KEYS["api_secret_" + _index];

      if(!api_key && !api_secret){
        return;
      }

      console.log("_index",_index)

      var timeStamp = Math.floor(Date.now());
      /// To check if the timestamp is correct
      console.log(timeStamp);

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

      let THIS = this;
      console.log("Here:Request:",options);
      request.post(options, function(error, response, body) {
          for (var k in THIS.summary) {
            THIS.summary[k] = newSummary(k,k);
          }
          
          var summary = THIS.summary;
          THIS.history = body;
          for(var i in body){
            let deal = body[i];
            //let key = _index + "." + deal.symbol;
            let key = deal.symbol;
            summary[key] = summary[key] || newSummary(key,deal.symbol);
            
            if(deal.side == "sell"){
              summary[key].sell_quantity += (deal.quantity-0);
              summary[key].sell_amount += (deal.price * (deal.quantity-0));
            } else  {
              summary[key].buy_quantity+= (deal.quantity-0);
              summary[key].buy_amount+= (deal.price * (deal.quantity-0));
              
              summary[key].buy_rate_min = summary[key].buy_rate_min || 99999999999999;
              summary[key].buy_rate_min =  Math.min(summary[key].buy_rate_min,deal.price);
              summary[key].buy_rate_max = summary[key].buy_rate_max || 0;
              summary[key].buy_rate_max =  Math.max(summary[key].buy_rate_max,deal.price);

            }
            summary[key].fee_amount+= (deal.fee_amount - 0);

            summary[key].stock = summary[key].buy_quantity - summary[key].sell_quantity;
            summary[key].net_debit = summary[key].buy_amount + summary[key].fee_amount
            summary[key].net_credit = summary[key].sell_amount;
            summary[key].earning = summary[key].net_credit - summary[key].net_debit;

            summary[key].buy_rate =  (summary[key].buy_amount)/summary[key].buy_quantity;
            summary[key].sell_rate = summary[key].sell_amount>0 ? (summary[key].sell_amount)/summary[key].sell_quantity : 0;

            if(summary[key].net_debit > summary[key].net_credit ){
              summary[key].efective_rate =  (summary[key].net_debit - summary[key].net_credit)/summary[key].stock;
            } else {
              if(summary[key].stock != 0){
                summary[key].efective_rate =  -1*(summary[key].earning)/summary[key].stock;
              } else {
                summary[key].efective_rate =  0;
              }
            }

            summary[key].buy_rate_stock = buyrate(
                summary[key].stock,
                summary[key].buy_quantity,
                summary[key].net_debit,
                summary[key].buy_rate_min,
                summary[key].buy_rate_max 
            );

          }
          
          if(THIS.items.length == 0){
            for(var j in THIS.summary){
              //console.log("summary===",THIS.summary[j])
              THIS.items.push(THIS.summary[j])
            }
          }

          THIS.onCurrencySelect();
          THIS.sync_balance(_index);
          //console.log("Here:Reponse:",body);
      });

      // axios.post(options.url, {}, {
      //   mode: 'no-cors',
      //   withCredentials: false,
      //   headers: {"Access-Control-Allow-Origin": "*"}
      // }).then(blob => blob.json())
      // .then(data => {
      //     console.table(data);
      //     return data;
      // }).catch(e => {
      //     console.log(e);
      //     return e;
      // });

    },


      showEditor(){
        this.apiName = KEYS["api_name_" + this.keyIndex];
        this.apiKey = KEYS["api_key_" + this.keyIndex];
        this.apiSecret = KEYS["api_secret_" + this.keyIndex];
        this.$bvModal.show('modal-prevent-closing')
      },
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.apiKeyState = valid
        this.apiSecretState = valid
        return valid
      },
      resetModal() {
        //this.apiKey = ''
        //this.apiKeyState = null;
        //this.apiSecret = ''
        //this.apiSecretState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }

        if(!this.keyIndex) this.keyIndex = ++INDEX;

        // Push the name to submitted names
        KEYS["api_name_" + this.keyIndex] = this.apiName;
        KEYS["api_key_" + this.keyIndex] = this.apiKey;
        KEYS["api_secret_" + this.keyIndex] = this.apiSecret;

        localStorage.setItem("api_name_"+this.keyIndex,this.apiName);
        localStorage.setItem("api_key_"+this.keyIndex,this.apiKey);
        localStorage.setItem("api_secret_"+this.keyIndex,this.apiSecret);

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        });
        this.$router.push("/trade/"+this.keyIndex);
        window.location.reload();
      },
      deleteCurrentKey(){

        let name  = KEYS["api_name_" + this.keyIndex] || KEYS["api_key_" + this.keyIndex] ;

        var r = window.confirm("Are you sure you want to delete "+ name);

        if(r==true){
            delete KEYS["api_name_" + this.keyIndex];
            delete KEYS["api_key_" + this.keyIndex];// = this.apiKey;
            delete KEYS["api_secret_" + this.keyIndex];// = this.apiSecret;

            localStorage.removeItem("api_name_"+this.keyIndex);
            localStorage.removeItem("api_key_"+this.keyIndex);
            localStorage.removeItem("api_secret_"+this.keyIndex);
            window.location.reload();
        }

      }
};
