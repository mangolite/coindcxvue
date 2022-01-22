<template>
  <div class="hello">
      <a-card :bordered="false" class="dashboard-bar-line header-solid">
        <div class="title"> Trades History</div>

      <b-form-group v-slot="{ ariaDescribedby }" class="text-center">
        <b-form-radio-group
          id="btn-radios-1" size="xs"
          v-model="timewindow"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radios-btn-default"
          buttons
        ></b-form-radio-group>
      </b-form-group>

       <b-table small striped :items="trades" id="myTrades" fixed
       :fields="fields" :sort-by="'time'" :sort-desc="false">

        <template #cell(side)="trade">
          <span :data-value="trade.value" :class="{
           'text-danger' : (trade.value == 'sell'),  'text-success' : (trade.value == 'buy')
          }">{{trade.value}}</span>
        </template>
        
        <template #cell(price)="trade">
            <span :data-value="trade.value">{{trade.value | round5}}</span>
        </template>

        <template #cell(quantity)="trade">
           <span :data-value="trade.value"> {{trade.value | round5}}</span>
        </template>

        <template #cell(amount)="trade">
            {{(trade.item.quantity * trade.item.price) | round2}}
        </template>

        <template #cell(time)="trade">
          <small>{{trade.item.timestamp | ago}}</small>
        </template>

       </b-table>
      </a-card>

  </div>
</template>

<script>

import momnet from 'moment';
import formatter from '@/service/formatter.js';

export default {
    props: {
      selected : {},
      summary : {},
      myOrders : {},
      myTrades : {},
    },
    data: () => ({
        fields : [
            { key: 'symbol', label : "Coin"},
            { key: 'side', label : "Side"},
            { key: 'price', label : "Price"},
            { key: 'quantity', label : "TQty"},
            { key: 'amount', label : "Amount"},
            {key : 'time' , label : "When"}
        ],
        timewindow: 1,
        options: [
          { text: 'None', value: 1 },
          { text: 'Daily', value: 1000*60*60*24 },
          { text: 'Weekly', value: 1000*60*60*24*7 },
          { text: 'Monthly', value: 1000*60*60*24*30 }
        ]
  }),
  computed : {
    trades : function(){
      let tradeMap = {};
      let trades = [];
      let day = this.timewindow;
      let now = Date.now();
      this.myTrades.map(function(trade){
        let time =  Math.floor(trade.timestamp/day)*day;
        let key = trade.symbol + "/" + trade.side + "/" + time;
        tradeMap[key] = tradeMap[key] || {
          pushed : false,
          quantity : 0,
          amount : 0
        };

        tradeMap[key].timestamp = Math.min(time,tradeMap[key].timestamp || time);
        tradeMap[key].symbol = trade.symbol;
        tradeMap[key].side = trade.side;
        tradeMap[key].quantity = tradeMap[key].quantity  + formatter.num(trade.quantity);
        tradeMap[key].amount = tradeMap[key].amount  + (formatter.num(trade.quantity) * formatter.num(trade.price));
        tradeMap[key].price = tradeMap[key].amount/tradeMap[key].quantity;

        if(!tradeMap[key].pushed){
            tradeMap[key].pushed = true;
            trades.push(tradeMap[key]);
            return tradeMap[key];
        }
      });
      return trades;
    }
  },
  filters : {
    ago : function (timestamp) {
      return momnet(timestamp).fromNow();
    }
  }
}

</script>
  

<style >

    #myTrades tr td{
    border: 0px!important ;
  }  
   


    #myTrades   {
    border: 0px!important ;
  }  

  #myTrades thead tr th{
    background-color: white;
    color: black!important;
    border: 0px;
    font-weight: 1000;
  }

  .table > :not(:first-child) {
     border-top: 0px solid ;
}
    

    .title{

   color: #000000;
    font-weight: 900;
    text-align: center;
    font-size: 20px;
    text-shadow: 1px 1px 1px #8484848c;
    margin-top: -6px;
    margin-bottom: 6px;
    font-family: monospace;
  }


</style>
