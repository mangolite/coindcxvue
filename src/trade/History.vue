<template>
  <div class="hello">

      <div> Trades History</div>
      <a-card :bordered="false" class="dashboard-bar-line header-solid">
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

        <template #cell(time)="trade">
            <span v-if="trade.item.timestamp>day">24h</span>
            <span v-else-if="trade.item.timestamp>week">Wk</span>
        </template>

       </b-table>
      </a-card>

  </div>
</template>

<script>
export default {
    props: {
      selected : {},
      summary : {},
      myOrders : {},
      myTrades : {},
    },
    data: () => ({
        day : Date.now()-1000*60*60*24,
        week : Date.now()-1000*60*60*24*7,
        fields : [
            { key: 'symbol', label : "Coin"},
            { key: 'side', label : "Side"},
            { key: 'price', label : "Price"},
            { key: 'quantity', label : "TQty"},
            { key: 'amount', label : "Amount"},
            {key : 'time' , label : "When"}
        ]
  }),
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


</style>
