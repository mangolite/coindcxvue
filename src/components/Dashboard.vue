<template>
  <div class="hello">
  
        <b-table small striped hover :items="items" :fields="fields" id="myMarket"
          stacked="sm" selected-variant="active" >
          <template #cell(buy_rate)="row">
              {{row.item.buy_rate | round5}} ~ <small> {{row.item.buy_rate_stock | round5}}</small>
          </template>  
          <template #cell(low_high)="row">
            <small class="text-success" :class="{'bg-light badge fw-bold' : row.item.signal_buy >0}" >{{row.item.signal_buy|round2}}%</small>
            <span>&nbsp;{{row.item.ticker.low | round5}} ~  {{row.item.ticker.high | round5}}&nbsp;</span>
            <small class="text-danger" :class="{'bg-light badge fw-bold' : row.item.signal_sell<0}" >{{row.item.signal_sell|round2}}%</small>
          </template> 
          <template #cell(symbol)="row">
              <router-link :to="`/trade/${account}/${row.item.symbol}`" 
                tag="button" class="btn btn-dark btn-sm">
                {{ row.item.symbol}}
              </router-link>
              
          </template>  
          <template #cell(efective_rate)="row">
            <span :class="{
              'fw-bold text-success' : row.item.efective_rate<0,
              'text-danger' : row.item.sell_rate>0 && row.item.efective_rate>row.item.buy_rate,
              'fw-bold' : (row.item.sell_rate>0 && row.item.efective_rate > row.item.sell_rate)
            }">
              {{ row.item.efective_rate | round5}}
            </span>
          </template>
          
          <template #cell(profit)="row">
            <b-row>
              <b-col>
                <b  :class="{
                  'fw-bold text-danger' : row.item.earning<0,
                  'fw-bold text-success' : row.item.earning>0
                }">{{row.item.earning | round2}}</b>
                &nbsp;<i class="bi-arrow-right-short"/>
              </b-col>
              <b-col>  
                <span v-if="row.item.ticker" style="font-size:18px" :class="{
                  'fw-bold text-danger' : row.item.efective_rate>row.item.ticker.last_price,
                  'fw-bold text-success' : row.item.efective_rate<row.item.ticker.last_price
                }">
                  {{row.item.stock*row.item.ticker.last_price * 0.999 + row.item.earning | round2}}
                </span>
              </b-col>  
              <b-col>  
                &nbsp;<i class="bi-arrow-right-short"/>
                <span v-if="row.item.order" :class="{
                  'fw-bold text-danger' : row.item.now_profit>row.item.postsale_profit,
                  'fw-bold text-success' : row.item.now_profit<row.item.postsale_profit
                }">
                  {{row.item.postsale_profit | round2}}
                </span>
                </b-col>
             </b-row>
          </template>

          <template #cell(now_rate)="row">
            <span v-if="row.item.ticker" :class="{
              'fw-bold text-success' : (row.item.ticker.last_price > row.item.buy_rate),
              'fw-bold text-danger' : (row.item.ticker.last_price < row.item.buy_rate),
            }">
              {{row.item.ticker.last_price | round5}}
            </span>
          </template>

        </b-table>


      <div >
        <b-card class="ml-auto"> 
          <b-row class="pb-2 pb-2 bg-dark text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end text-success">Total OnBuy</b-col>
            <b-col sm="2" lg="2" class="text-start fw-bold text-success">{{total.onBuy | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end text-danger">Total OnSell</b-col>
            <b-col sm="2" lg="2" class="text-start text-danger fw-bold">{{total.onSell | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end text-warning">Total AfterSell</b-col>
            <b-col sm="2" lg="2" class="text-start fw-bold text-warning">{{total.afterSell | round2}}</b-col>
            <b-col sm="2" lg="2" class="text-end fw-bold text-info">Total InStock</b-col>
            <b-col sm="2" lg="2" class="text-start fw-bold text-info">{{total.inStockWorth | round2}}</b-col>
            <b-col sm="2" lg="2" class="text-end fw-bold text-primary">Total NetStock</b-col>
            <b-col sm="2" lg="2" class="text-start fw-bold text-primary">{{total.netStockWorth | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end"> InStockeINR</b-col>
            <b-col sm="2" lg="2" class="text-start">{{total.netINR | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end"> NetWorth</b-col>
            <b-col sm="2" lg="2" class="text-start">{{total.netWorth | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end"> AfterSellWorth</b-col>
            <b-col sm="2" lg="2" class="text-start">{{total.afterSellWorth | round2}}</b-col>
          </b-row>
        </b-card>
      </div>


  </div>
</template>

<script>
export default {
    name: 'Dashboard',
    props: {
      account : {
      },
      items : {
      },
      total : {
      },
    },
    data: () => ({
        fields: [ { key: 'symbol', label : "Symbol", sortable: false, variant : "dark" }, 
                  { key: 'now_rate', label : "Now Rate", sortable: false,variant : "dark" },  
                  { key: 'low_high', label : "Low-High(24hrs)", sortable: false,variant : "secondary" }, 
                  { key: 'buy_rate', label: 'Avg Buy Rate',sortable: false, variant : "warning"},  
                  //{ key: 'buy_quantity', label: 'Buy Quantity',sortable: true, variant : "warning"}, 
                  //{ key: 'buy_amount', label: 'Buy Amount', sortable: true, variant : "warning" }, 
                  { key: 'sell_rate', label: 'Avg Sell Rate', sortable: false, variant : "info"},
                 // { key: 'sell_quantity', label: 'Sell Quantity', sortable: true, variant : "info"}, 
                  //{ key: 'sell_amount', label: 'Sell Amount', sortable: false, variant : "info"},
                  //{ key: 'fee_amount', label: 'Fee', sortable: false,variant : "danger"},
                  { key: 'efective_rate', label: 'Effective Rate', variant : "success"},
                  //{ key: 'stock', label: 'Stock', variant : "secondary"},
                  { key: 'profit', label: 'past-now-post', variant : "secondary"}
        ],
    }),
    computed: {
    },
    filters: {
    },
    created : function () {
    },
    methods: {
    },
    components : {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
