<template>

	<a-card :bordered="false" class="dashboard-bar-line header-solid">
        <b-table small striped hover :items="items" :fields="fields" id="myMarket" class="text-center"
          stacked="sm" selected-variant="active" >

          <template #table-colgroup>
            <col
              key="symbol"
              :style="{ width:'120px'}"
            >
          </template>

          <template #cell(symbol)="row">
              <router-link :to="`/trade2/${account}/${row.item.symbol}`" 
                tag="button" class="btn btn-dark btn-sm fw-bold">
                {{ row.item.symbol}}
              </router-link>
          </template> 

          <template #cell(buy_rate)="row">
             <div v-if="row.item.meta"  class="text-light fw-bold"> {{row.item.meta.buy_rate_stock | round5}}</div>
              <div v-if="row.item.meta"  class="text-light fw-bold text-sm" :id="row.item.meta.buy_rate">
               {{row.item.meta.buy_rate | round5}} 
             </div>
          </template>  

          <template #cell(now_rate)="row">
            <div>
            <span class="float-start">
                <small v-if="row.item.ticker" class="text-light fw-normal next-line " style="font-size: 10px">{{row.item.ticker.low | round5}}</small>
           </span>

              <span v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
                'fw-bold text-success' : (row.item.ticker.last_price > row.item.meta.buy_rate),
                'fw-bold text-danger' : (row.item.ticker.last_price < row.item.meta.buy_rate),
              }">
                {{row.item.ticker.last_price | round5}}
              </span>  
              <span class="float-end">
                 <small v-if="row.item.ticker" class="text-light fw-normal next-line " style="font-size: 10px">{{row.item.ticker.high | round5}}</small>
              </span>  
            </div>

            <small>
                 <span v-if="row.item.ticker"  class=" fw-bold  badge p-range">
                   {{(row.item.range.dHigh-row.item.range.dLow)/row.item.range.dHigh*100 | round}}<small>%</small>
                  </span>
                  <span v-if="row.item.range"  class=" fw-bold badge p-range">
                   {{(row.item.range.wHigh-row.item.range.wLow)/row.item.range.wHigh*100 | round}}<small>%</small>
                 </span>  
                  <span v-if="row.item.range"  class=" fw-bold badge p-range">
                   {{(row.item.range.mHigh-row.item.range.mLow)/row.item.range.mHigh*100 | round}}<small>%</small>
                 </span> 
                  <span v-if="row.item.range"  class="fw-bold badge p-range">
                   {{(row.item.range.m3High-row.item.range.m3Low)/row.item.range.m3High*100 | round}}<small>%</small>
                 </span> 
                  <span v-if="row.item.range"  class="fw-bold badge p-range">
                   {{(row.item.range.yHigh-row.item.range.yLow)/row.item.range.yHigh*100 | round}}<small>%</small>
                 </span>
              </small>
          </template>

          <template #cell(low_high)="row">
            <small v-if="row.item.meta" class="text-success" :class="{'bg-light badge fw-bold' : row.item.meta.signal_buy >0}" >{{row.item.meta.signal_buy|round2}}%</small>
            <span v-if="row.item.ticker">&nbsp;{{row.item.ticker.low | round5}} ~  {{row.item.ticker.high | round5}}&nbsp;</span>
            <small v-if="row.item.meta"  class="text-danger" :class="{'bg-light badge fw-bold' : row.item.signal_sell<0}" >{{row.item.signal_sell|round2}}%</small>
          </template> 
 
          <template #cell(efective_rate)="row">
            <span v-if="row.item.meta"  :class="{
              'fw-bold text-success' : row.item.meta.efective_rate<0,
              'text-danger' : row.item.meta.sell_rate>0 && row.item.meta.efective_rate>row.item.meta.buy_rate,
              'fw-bold' : (row.item.meta.sell_rate>0 && row.item.meta.efective_rate > row.item.meta.sell_rate)
            }">
              {{ row.item.meta.efective_rate | round5}}
            </span>
          </template>
          
          <template #cell(profit)="row">
            <b-row>
              <b-col>
                <b v-if="row.item.meta"  :class="{
                  'fw-bold text-danger' : row.item.meta.earning<0,
                  'fw-bold text-success' : row.item.meta.earning>0
                }">{{row.item.meta.earning | round2}}</b>
                &nbsp;<i class="bi-arrow-right-short"/>
              </b-col>
              <b-col>  
                <span v-if="row.item.ticker && row.item.meta"  style="font-size:18px" :class="{
                  'fw-bold text-danger' : row.item.meta.efective_rate>row.item.ticker.last_price,
                  'fw-bold text-success' : row.item.meta.efective_rate<row.item.ticker.last_price
                }">
                  {{row.item.meta.stock*row.item.ticker.last_price * 0.999 + row.item.meta.earning | round2}}
                </span>
              </b-col>  
              <b-col>  
                &nbsp;<i class="bi-arrow-right-short"/>
                <span v-if="row.item.order" :class="{
                  'fw-bold text-danger' : row.item.meta.now_profit>row.item.meta.postsale_profit,
                  'fw-bold text-success' : row.item.meta.now_profit<row.item.meta.postsale_profit
                }">
                  {{row.item.meta.postsale_profit | round2}}
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
            <span v-if="row.item.order" class="float-start text-success fw-bold">{{row.item.order.onbuy_amount | round2}}</span>
            <span v-if="row.item" class="float-none text-primary fw-bold text-center" >{{row.item | instock_worth}}</span>
            <span v-if="row.item.order" class="float-end text-danger fw-bold">{{row.item.order.onsale_amount | round2}}</span>
          </template>

        </b-table>
	</a-card>

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
        fields: [ { key: 'symbol', label : "Coin  ", sortable: false, variant : "1dark" }, 
                  { key: 'now_rate', label : "Price", sortable: false,variant : "dark" },  
                  //{ key: 'low_high', label : "L-H,24h", sortable: false,variant : "secondary" }, 
                  { key: 'buy_rate', label: 'Buy-Range',sortable: false, variant : "secondary"},  
                  //{ key: 'valotile', label: 'Volatile%',sortable: false, variant : "secondary"},
                  //{ key: 'buy_quantity', label: 'Buy Quantity',sortable: true, variant : "warning"}, 
                  //{ key: 'buy_amount', label: 'Buy Amount', sortable: true, variant : "warning" }, 
                  //{ key: 'sell_rate', label: 'Avg Sell Rate', sortable: false, variant : "info"},
                 // { key: 'sell_quantity', label: 'Sell Quantity', sortable: true, variant : "info"}, 
                  //{ key: 'sell_amount', label: 'Sell Amount', sortable: false, variant : "info"},
                  //{ key: 'fee_amount', label: 'Fee', sortable: false,variant : "danger"},
                  //{ key: 'efective_rate', label: 'EffRate', variant : "success"},
                  { key: 'stock', label: 'Total coins  ( Stock - Sell )', variant : "danger"},
                  { key: 'worth', label: ' Worth INR ( Buy-Stk-Sell )', variant : "primary"},
                  
                  { key: 'profit', label: ' Profit p-n-f', variant : "1secondary"}
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

<style>
  @media (max-width: 575.98px) {
    #myMarket.table.b-table.b-table-stacked-sm > tbody > tr > [data-label]::before {
      width: 20%;
    }
  }

  #myMarket{
    border-color: transparent;
  }

   #myMarket thead  th{
        background-color: white!important;
    color: #000000!important;
    font-weight: 900;

   }

  #myMarket .btn-dark {
        color: #fff;
    background-color: #000000;
    border-color: #21252900;
    border-radius: 25px;

}


  #myMarket  .table-dark {
        --bs-table-bg: #e0b361;
    --bs-table-striped-bg: #e0b361;
    --bs-table-striped-color: #fff;
    --bs-table-active-bg: #373b3e;
    --bs-table-active-color: #fff;
    --bs-table-hover-bg: #000000;
    --bs-table-hover-color: #fff;
    color: #ffffff;
    border-color: #ffffff;
}

 #myMarket  .table-1dark {
        --bs-table-bg: #000000;
    --bs-table-striped-bg: #000000;
    --bs-table-striped-color: #fff;
    --bs-table-active-bg: #373b3e;
    --bs-table-active-color: #fff;
    --bs-table-hover-bg: #000000;
    --bs-table-hover-color: #fff;
    color: #ffffff;
    border-color: #ffffff;
}


  #myMarket .table-secondary {
    --bs-table-bg: #18c4e8;
    --bs-table-striped-bg: #18c4e8;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #cbccce;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #17454e;
    --bs-table-hover-color: #000;
    color: #ffffff;
    border-color: #ffffff;
}

 #myMarket .table-primary {
    --bs-table-bg: #95dad0;
    --bs-table-striped-bg: #95dad0;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #bacbe6;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #044036;
    --bs-table-hover-color: #000;
    color: #ffffff;
    border-color: #ffffff;
}


 #myMarket .table-1secondary {
    --bs-table-bg: #e0e0e0;
    --bs-table-striped-bg: #e0e0e0;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #cbccce;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #404040;
    --bs-table-hover-color: #000;
    color: #ffffff;
    border-color: #ffffff;
}

 #myMarket .table-danger {
    --bs-table-bg: #eccccf;
    --bs-table-striped-bg: #eccccf;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #dfc2c4;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #301316;
    --bs-table-hover-color: #000;
    color: #ffffff;
    border-color: #ffffff;
}



  .p-range{
   
    color:#967f39;
  }
 
    @media (max-width: 575px){
      #myMarket  .table-1dark {

        border-radius: 25px 25px 0px 0px ;
      }
      #myMarket .table-1secondary{

        border-radius: 0px 0px 25px 25px ;
      }

}
    
   

</style>