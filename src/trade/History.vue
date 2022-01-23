<template>
  <div class="hello">
      <a-card :bordered="false" class="dashboard-bar-line header-solid">
        <div class="title"> {{title}}</div>

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
        <template #table-colgroup>
          <col
            key="symbol"
            :style="{ 'min-width' : '75px', 'max-width' : '80px'}"
          >
          <col
            key="side"
            :style="{ width:'25px'}"
          >
        </template>

        <template #cell(symbol)="trade">
          <router-link tag="span" :to="`/trade2/${$store.getters.account}/${trade.value}`" 
              v-tooltip="trade.item.last_price"
              class="text-sm pointer">
            <i class="text-xs fa pointer" :class="{
              'fa-long-arrow-alt-down' : trade.item.price > trade.item.last_price,
              'fa-long-arrow-alt-up' : trade.item.price < trade.item.last_price,
              'text-success' : trade.item.good,
              'text-danger' : !trade.item.good
            }" />&nbsp;{{trade.value}}
          </router-link>
        </template>

        <template #cell(side)="trade">
          <span v-if="trade.value == 'sell'" class="text-danger text-bold text-sm">
            S
          </span>
          <span v-else class="text-success text-bold text-sm">
            B
          </span>
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
      title : {
        type : String,
        default : "No Title"
      }
    },
    data: () => ({
        fields : [
            { key: 'symbol', label : "Coin"},
            { key: 'side', label : "S/B"},
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
        tradeMap[key].last_price = trade.last_price || 0;
        tradeMap[key].quantity = tradeMap[key].quantity  + formatter.num(trade.quantity);
        tradeMap[key].amount = tradeMap[key].amount  + (formatter.num(trade.quantity) * formatter.num(trade.price));
        tradeMap[key].price = tradeMap[key].amount/tradeMap[key].quantity;
        if(!tradeMap[key].pushed){
            tradeMap[key].pushed = true;
            trades.push(tradeMap[key]);
            return tradeMap[key];
        }
      });
      return trades.map(function(deal){
        if(deal.side == 'sell'){
          deal.good  = (deal.last_price < deal.price);
        } else {
          deal.good  = (deal.last_price > deal.price);
        }
        return deal;
      });
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
