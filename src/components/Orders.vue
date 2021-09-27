<template>
  <div class="hello">

      <div> Orders </div>

      <b-table small striped :items="myOrders" dark id="myOrders" fixed
       :fields="fields">

        <template v-slot:cell(side)="order">
          <span :data-value="order.value" :class="{
           'text-danger' : (order.value == 'sell'), 
           'text-danger text-bold fw-bold' : (['24High','wHigh','mHigh'].indexOf(order.value) > -1), 
           'text-success text-bold fw-bold' : (['24Low','wLow','mLow'].indexOf(order.value) > -1), 
           'text-success' : (order.value == 'buy'),
           'text-warning' : (order.value == 'Current Rate'),
           'text-info' : (order.value == 'buyRateStock'),
           'text-primary' : (order.value == 'buyRate')
          }">{{order.value}}</span>
        </template>

        <template v-slot:cell(ppu)="order">
          <span :data-value="order.value">
            {{order.item.price_per_unit | round5}}
          </span>
        </template>

        <template v-slot:cell(price_per_unit)="order">
          <span :data-value="order.value">
            {{order.item.price_per_unit | round5}}
          </span>
        </template>

        <template v-slot:cell(total_quantity)="order">
          <span :data-value="order.value">{{order.value | round5}}</span>
        </template>

          <template #cell(amount)="order">
            {{(order.item.price_per_unit * order.item.total_quantity) | round2}}
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
      ofields : {},
    },
    data: () => ({
        fields : [
            { key: 'market', label : "Symbol"},
            { key: 'side', label : "Side"},
            { key: 'ppu', label : "Price"},
            { key: 'total_quantity', label : "TQty"},
            { key: 'amount', label : "Amount"}
        ]
    }),
}
</script>
  

<style scoped>

</style>
