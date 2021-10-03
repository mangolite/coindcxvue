<template>
  <div class="hello">

      <div> Trades History</div>
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

       </b-table>

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
        fields : [
            { key: 'symbol', label : "Symbol"},
            { key: 'side', label : "Side"},
            { key: 'price', label : "Price"},
            { key: 'quantity', label : "TQty"},
            { key: 'amount', label : "Amount"}
        ]
  }),
}

</script>
  

<style scoped>

</style>
