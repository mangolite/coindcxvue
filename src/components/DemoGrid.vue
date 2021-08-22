<template>
  <div class="hello">
        
        <b-table small striped hover :items="items" :fields="fields"
          @row-selected="onRowSelected" selectable select-mode="single"
          stacked="sm" selected-variant="active">

          <template #cell(symbol)="row">
              {{ row.item.symbol}}
              <i :class="[
              { 'far fa-thumbs-up text-success' : row.item.efective_rate<0 }
            ]"></i>
          </template>  
          <template #cell(efective_rate)="row">
            <span :class="{
              'fw-bold text-success' : row.item.efective_rate<0,
              'text-danger' : row.item.efective_rate>row.item.buy_rate,
              'fw-bold' : (row.item.sell_rate>0 && row.item.ticker.last_price < row.item.sell_rate)
            }">
              {{ row.item.efective_rate | round5}}
            </span>
          </template>
          
          <template #cell(profit)="row">
            <span v-if="row.item.stock" :class="{
              'fw-bold text-success' : row.item.efective_rate<0
            }">
              {{row.item.stock*row.item.ticker.last_price + row.item.earning | round2}}
            </span>
          </template>

          <template #cell(now_rate)="row">
            <span v-if="row.item.ticker" :class="{
              'fw-bold text-success' : (row.item.ticker.last_price > row.item.buy_rate),
              'text-danger' : (row.item.ticker.last_price < row.item.buy_rate),
            }">
              {{row.item.ticker.last_price | round5}}
            </span>
          </template>

        </b-table>

        <b-card v-if="selected">
          <b-row class="pb-2 pb-2 bg-dark text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">currency</b-col>
            <b-col sm="2" lg="2" class="text-start fw-bold">{{selected.symbol}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My INR Balalnce</b-col>
            <b-col sm="2" lg="2" class="text-start"
              v-if="summary.INR && summary.INR.balance"
            ><small>₹ </small>{{summary.INR.balance.balance | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-dark text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">Market Rate</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.ticker.last_price}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end"> NetWorth <small>(Earning+Stok) </small> </b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.earning+selected.stock*selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 pb-2 bg-warning">
            <b-col sm="2" lg="2" class="fw-bold text-end">Starting Coins</b-col>
            <b-col sm="2" lg="2" class="text-start" v-if="selected.balance">
              {{(selected.buy_quantity - selected.sell_quantity - selected.balance.locked_balance - selected.balance.balance) | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">Starting Coins Worth</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.starting_coins*selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-warning" >
            <b-col sm="2" lg="2" class="fw-bold text-end " >Purchased Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.buy_quantity | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">INR Debit</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small>{{selected.buy_amount | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-info bg-gradient">
            <b-col sm="2" lg="2" class="fw-bold text-end">Sold Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.sell_quantity | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">INR Credit</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small>{{selected.sell_amount | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-info bg-gradient text-dark" v-if="selected.balance">
            <b-col sm="2" lg="2" class="fw-bold text-end">onSale Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.balance.locked_balance}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">onSale Worth</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.balance.locked_balance * selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-secondary text-light" v-if="selected.balance">
            <b-col sm="2" lg="2" class="fw-bold text-end">inStock Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.balance.balance | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">inStock Worth</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.balance.balance * selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-secondary  text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">My Total Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.stock | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My Total Coins Worth</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small>{{selected.stock*selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-success text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end"> </b-col>
            <b-col sm="2" lg="2" class="text-start">  </b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My Earnings</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small> {{selected.earning |round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-success text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">Net BuyRate</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.efective_rate | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My Profit</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.stock*selected.ticker.last_price + selected.earning | round2}}</b-col>
          </b-row>

        </b-card>

  <b-button v-b-modal.modal-prevent-closing>Update Keys</b-button>

   <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Submit Your Name"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Api Key"
          label-for="api-key-input"
          invalid-feedback="ApiKey is required"
          :state="apiKeyState"
        >
          <b-form-input
            id="api-key-input"
            v-model="apiKey"
            :state="apiKeyState"
            required
          ></b-form-input>

        </b-form-group>

      <b-form-group
          label="Api Secret"
          label-for="api-secret-input"
          invalid-feedback="ApiSecret is required"
          :state="apiSecretState"
        >

          <b-form-input
            id="api-secret-input"
            v-model="apiSecret"
            :state="apiSecretState"
            required
          ></b-form-input>

        </b-form-group>

      </form>
    </b-modal>


  </div>
</template>

<script>

import request from 'request';
//import axios from 'axios';
import crypto from 'crypto';
import numeral from 'numeral';

//var baseurl = document.location.origin;  
var baseurl = 'https://pure-citadel-90943.herokuapp.com/https://api.coindcx.com'
      // Place your API key and secret below. You can generate it from the website.

var api_key  =  localStorage.getItem("api_key");
var api_secret   =  localStorage.getItem("api_secret");

  var number = function (value,format) {
      var _format = format || "0,0000"
      return numeral(value).format(_format).toUpperCase();//.replace(/(?:\r\n|\r|\n)/g, '<br/>').trim();
  }
  var sync_history = 0, sync_ticker=0;
  var newSummary = function(key,symbol){
    return {
              key : key, ticker : {},
              symbol : symbol,
              buy_quantity : 0 , buy_amount : 0,
              sell_quantity : 0 , sell_amount : 0,
              fee_amount : 0,
              starting_coins : 0,
              efective_rate : 0, now_rate : 0
      }
  }


export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: () => ({
        fields: [ { key: 'symbol', label : "Symbol", sortable: false, variant : "dark" }, 
                  { key: 'now_rate', label : "Now Rate", sortable: false,variant : "dark" },  
                  { key: 'buy_rate', label: 'Avg Buy Rate',sortable: false, variant : "warning"},  
                  //{ key: 'buy_quantity', label: 'Buy Quantity',sortable: true, variant : "warning"}, 
                  //{ key: 'buy_amount', label: 'Buy Amount', sortable: true, variant : "warning" }, 
                  { key: 'sell_rate', label: 'Avg Sell Rate', sortable: false, variant : "info"},
                 // { key: 'sell_quantity', label: 'Sell Quantity', sortable: true, variant : "info"}, 
                  //{ key: 'sell_amount', label: 'Sell Amount', sortable: false, variant : "info"},
                  //{ key: 'fee_amount', label: 'Fee', sortable: false,variant : "danger"},
                  { key: 'efective_rate', label: 'Effective Rate', variant : "success"},
                  //{ key: 'stock', label: 'Stock', variant : "secondary"},
                  { key: 'profit', label: 'Profit', variant : "secondary"},
               
        ],
        items: [],
        selected : null,
        ticker : null,
        summary : {},
        apiKey : api_key, apiKeyState : null,
        apiSecret : api_secret, apiSecretState : null
  }),
  computed: {
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    round5 : function (num,places) {
        let _places = places || 5;
        var base = Math.pow(10,_places)
        return Math.round(num*base)/base;
    },
    round2 : function (num,places) {
        let _places = places || 2;
        var base = Math.pow(10,_places)
        return number(Math.round(num*base)/base);
    },

  },
  created : function () {
    var THAT = this;
    THAT.sync_ticker();
    THAT.sync_history();

    setInterval(function(){
      THAT.sync_ticker();
      THAT.sync_history();
    },20000);

  },
  methods: {
    onRowSelected : function(items){
      this.selected = items ? items[0] : null;
    },
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    sync_ticker: function() {
        var THIS = this;
        let summary = this.summary;
        request.get(baseurl + "/exchange/ticker",function(error, response, body) {
            let tickers = JSON.parse(body);
            for(var i in tickers){
              var ticker = tickers[i];
              if(summary[ticker.market]){
                summary[ticker.market].ticker = ticker;
              }
            }
          clearTimeout(sync_ticker);
          sync_ticker = setTimeout(()=>THIS.sync_ticker(),2000);
        });
    },
    sync_balance: function() {
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

        request.post(options,function(error, response, body) {
            let balances = body;
            for(var i in balances){
              var balance = balances[i];
              let market = balance.currency + "INR";
              if(summary[market]){
                summary[market].balance = balance;
              } else if(balance.currency == "INR"){
                summary.INR = { balance : balance}
              }
            }
        });
    },
    sync_history: function() {
         
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
          
          for(var i in body){
            let deal = body[i];
            let key = deal.symbol;
            summary[key] = summary[key] || newSummary(key,deal.symbol);
            if(deal.side == "sell"){
              summary[key].sell_quantity += (deal.quantity-0);
              summary[key].sell_amount += (deal.price * (deal.quantity-0));
            } else  {
              summary[key].buy_quantity+= (deal.quantity-0);
              summary[key].buy_amount+= (deal.price * (deal.quantity-0));
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
              summary[key].efective_rate =  -1*(summary[key].earning)/summary[key].stock;
            }
        

          }
          
          if(THIS.items.length == 0){
            for(var j in THIS.summary){
              console.log("summary===",THIS.summary[j])
              THIS.items.push(THIS.summary[j])
            }
          }

          THIS.sync_balance();
          clearTimeout(sync_history);
          sync_history = setTimeout(()=>THIS.sync_history(),5000);
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
        // Push the name to submitted names
        api_key = this.apiKey;
        api_secret = this.apiSecret;

        localStorage.setItem("api_key",api_key);
        localStorage.setItem("api_secret",api_secret);

        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
