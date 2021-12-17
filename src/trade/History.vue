<template>
  <div class="hello">

      
      <a-card :bordered="false" class="dashboard-bar-line header-solid">
        <div class="title"> Trades History</div>
       <b-table small striped :items="myTrades" id="myTrades" fixed
       :fields="fields">

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

        <template #cell(time)="trade">{{trade.item.timestamp | ago}}
        </template>

       </b-table>
      </a-card>

  </div>
</template>

<script>

import momnet from 'moment';

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
        ]
  }),
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

    color: #ffffff;
    font-weight: 700;
    text-align: center;
    font-size: 15px;
    text-shadow: 0px 1px 7px #232121;
    margin-top: -6px;
    margin-bottom: 6px;
  }


</style>
