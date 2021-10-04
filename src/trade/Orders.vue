<template>
  <a-card :bordered="false" class="dashboard-bar-line header-solid">
      <b-table small striped :items="myOrders"  id="myOrders" fixed head-dark light
       :fields="fields">
        <template v-slot:cell(side)="order">
          <span :data-value="order.value" :class="{
           'text-danger' : (order.value == 'sell'), 

           'text-danger text-bold fw-bold' : ('24High' == order.value), 
           'text-success text-bold fw-bold' : ('24Low' == order.value), 

           'text-danger-1 text-bold fw-bold' : ('wkHigh' == order.value), 
           'text-success-1 text-bold fw-bold' : ('wkLow' == order.value), 

            'text-danger-2 text-bold fw-bold' : ('moHigh' == order.value), 
            'text-success-2 text-bold fw-bold' : ('moLow' == order.value), 

            'text-danger-3 text-bold fw-bold' : ('yrHigh' == order.value), 
            'text-success-3 text-bold fw-bold' : ('yrLow' == order.value),

           'text-success' : (order.value == 'buy'),
           'text-dark text-bold' : (order.value == 'Current Rate'),
           'text-info text-bold' : (order.value == 'buyRateStock'),
           'text-primary text-bold' : (order.value == 'buyRate')
          }">{{order.value}}</span>
        </template>

        <template v-slot:cell(ppu)="order">
          <span :data-value="order.value" class="fw-bold">
            {{order.item.price_per_unit | round5}}
          </span>
        </template>

        <template v-slot:cell(price_per_unit)="order">
          <span :data-value="order.value" class="fw-bold">
            {{order.item.price_per_unit | round5}}
          </span>
        </template>

        <template v-slot:cell(total_quantity)="order">
          <span :data-value="order.value" class="fw-bold">{{order.value | round5}}</span>
        </template>

          <template #cell(amount)="order">
            <span class="fw-bold">{{(order.item.amount || (order.item.price_per_unit * order.item.total_quantity)) | round2}}</span>
          </template>

      </b-table>

  </a-card>
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
            { key: 'market', label : "Orders"},
            { key: 'side', label : "Side"},
            { key: 'ppu', label : "Price"},
            { key: 'total_quantity', label : "TQty"},
            { key: 'amount', label : "Amount"}
        ]
    }),
}
</script>
  

<style>
  #myOrders {
    border: 1px solid #808080;
  }
  #myOrders thead tr th{
    background-color: rgb(59, 59, 59);
    color: rgb(255, 255, 255)!important;
  }
</style>
