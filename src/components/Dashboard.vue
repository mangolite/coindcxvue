<template>
  <div class="DashBaord">
      
        <DashboardSummary
          :total="total"
        ></DashboardSummary>

        <b-table small striped hover :items="items" :fields="fields" id="myMarket"
          stacked="sm" selected-variant="active" >
          <template #cell(buy_rate)="row">
             <span class="float-start">
               {{row.item.buy_rate | round5}} 
             </span> ~
            <small class="float-end"> {{row.item.buy_rate_stock | round5}}</small>
          </template>  

          <template #cell(symbol)="row">
              <router-link :to="`/trade/${account}/${row.item.symbol}`" 
                tag="button" class="btn btn-dark btn-sm">
                {{ row.item.symbol}}
              </router-link>
          </template> 
          <template #cell(now_rate)="row">
            
            <span class="float-start">
                <small class="text-light fw-normal next-line " style="font-size: 10px">{{row.item.ticker.low | round5}}</small>
                <small class="text-success float-start next-line "  style="font-size: 8px;"
                  :class="{'bg-light badge fw-bold' : row.item.signal_buy >0}" >{{row.item.signal_buy|round2}}%</small>
            </span>


            <span v-if="row.item.ticker" :class="{
              'fw-bold text-success' : (row.item.ticker.last_price > row.item.buy_rate),
              'fw-bold text-danger' : (row.item.ticker.last_price < row.item.buy_rate),
            }">
              {{row.item.ticker.last_price | round5}}
            </span>
            

            <span class="float-end">
              <small class="text-light fw-normal next-line " style="font-size: 10px">{{row.item.ticker.high | round5}}</small>
              <small class="text-danger float-end next-line " style="font-size: 8px"
                :class="{'bg-light badge fw-bold' : row.item.signal_sell<0}" >{{row.item.signal_sell|round2}}%</small>
            </span>    
          </template>

          <template #cell(low_high)="row">
            <small class="text-success" :class="{'bg-light badge fw-bold' : row.item.signal_buy >0}" >{{row.item.signal_buy|round2}}%</small>
            <span>&nbsp;{{row.item.ticker.low | round5}} ~  {{row.item.ticker.high | round5}}&nbsp;</span>
            <small class="text-danger" :class="{'bg-light badge fw-bold' : row.item.signal_sell<0}" >{{row.item.signal_sell|round2}}%</small>
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

          <template #cell(stock)="row">
            <b-row>
              <b-col v-if="row.item.balance" class="fw-bold text-primary text-end" cols="5">
                {{row.item.balance.balance | round5}}
              </b-col>
              <b-col class="text-center" cols="1">+</b-col>
              <b-col v-if="row.item.balance" class="fw-bold text-danger text-start" cols="5">
                {{row.item.balance.locked_balance | round5}}
              </b-col>
            </b-row>
          </template>

          <template #cell(worth)="row">
            <span v-if="row.item.order" class="float-start text-success fw-bold">{{row.item.order.onbuy_amount}}</span>
            <span v-if="row.item" class="float-none text-primary fw-bold text-center" >{{row.item | instock_worth}}</span>
            <span v-if="row.item.order" class="float-end text-danger fw-bold">{{row.item.order.onsale_amount}}</span>
          </template>

        </b-table>

        <DashboardSummary
          :total="total"
        ></DashboardSummary>




  </div>
</template>

<script>
  import DashboardSummary from './DashboardSummary.vue';

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
                  { key: 'now_rate', label : "Rate", sortable: false,variant : "dark" },  
                  //{ key: 'low_high', label : "L-H,24h", sortable: false,variant : "secondary" }, 
                  { key: 'buy_rate', label: 'AvBRate',sortable: false, variant : "warning"},  
                  //{ key: 'buy_quantity', label: 'Buy Quantity',sortable: true, variant : "warning"}, 
                  //{ key: 'buy_amount', label: 'Buy Amount', sortable: true, variant : "warning" }, 
                  //{ key: 'sell_rate', label: 'Avg Sell Rate', sortable: false, variant : "info"},
                 // { key: 'sell_quantity', label: 'Sell Quantity', sortable: true, variant : "info"}, 
                  //{ key: 'sell_amount', label: 'Sell Amount', sortable: false, variant : "info"},
                  //{ key: 'fee_amount', label: 'Fee', sortable: false,variant : "danger"},
                  //{ key: 'efective_rate', label: 'EffRate', variant : "success"},
                  { key: 'worth', label: 'Worth', variant : "primary"},
                  { key: 'stock', label: 'stock', variant : "danger"},
                  { key: 'profit', label: 'p-n-f', variant : "secondary"}
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
      DashboardSummary
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @media (max-width: 575.98px) {
    #myMarket.table.b-table.b-table-stacked-sm > tbody > tr > [data-label]::before {
      width: 20%;
    }
  }
</style>
