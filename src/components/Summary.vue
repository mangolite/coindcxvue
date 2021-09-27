<template>
  <div class="hello">
    
  <b-card class="ml-auto"> 
          <b-row class="pb-2 pb-2 bg-dark text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">currency</b-col>
            <b-col sm="2" lg="2" class="text-start fw-bold">{{selected.symbol}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My INR Balalnce</b-col>
            <b-col sm="2" lg="2" class="text-start"
              v-if="summary.INR && summary.INR.balance"
            ><small>₹ </small>{{summary.INR.balance.balance | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-dark text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">Market Rate</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.ticker.last_price}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end"> NetWorth <small>(Earning+Stok) </small> </b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.earning+selected.stock*selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 pb-2 bg-warning">
            <b-col sm="2" lg="2" class="fw-bold text-end">Starting Coins</b-col>
            <b-col sm="2" lg="2" class="text-start" v-if="selected.balance">
              {{(selected.buy_quantity - selected.sell_quantity - selected.balance.locked_balance - selected.balance.balance) | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">Starting Coins Worth</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.starting_coins*selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-warning" >
            <b-col sm="2" lg="2" class="fw-bold text-end " >Purchased Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.buy_quantity | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">INR Debit</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small>{{selected.buy_amount | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-info bg-gradient">
            <b-col sm="2" lg="2" class="fw-bold text-end">Sold Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.sell_quantity | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">INR Credit</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small>{{selected.sell_amount | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-info bg-gradient text-dark" v-if="selected.balance">
            <b-col sm="2" lg="2" class="fw-bold text-end">onSale Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.balance.locked_balance}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">onSale Worth</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.balance.locked_balance * selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-secondary text-light" v-if="selected.balance">
            <b-col sm="2" lg="2" class="fw-bold text-end">inStock Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.balance.balance | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">inStock Worth</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.balance.balance * selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-secondary  text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">My Total Coins</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.stock | round5}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My Total Coins Worth</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small>{{selected.stock*selected.ticker.last_price | round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-success text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end"> </b-col>
            <b-col sm="2" lg="2" class="text-start">  </b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My Earnings</b-col>
            <b-col sm="2" lg="2" class="text-start"><small>₹ </small> {{selected.earning |round2}}</b-col>
          </b-row>

          <b-row class="pb-2 bg-success text-light">
            <b-col sm="2" lg="2" class="fw-bold text-end">Net BuyRate</b-col>
            <b-col sm="2" lg="2" class="text-start">{{selected.efective_rate | round2}}</b-col>
            <b-col sm="2" lg="2" class="fw-bold text-end">My Profit</b-col>
            <b-col sm="2" lg="2" class="text-start">
              <small>₹ </small>{{selected.stock*selected.ticker.last_price + selected.earning | round2}}</b-col>
          </b-row>
          <b-row class="pt-4  bg-success text-light">
              <b-col sm="12" lg="12" class="fw-bold text-end text-center">
                    <b-button pill size="sm" variant="danger" @click="selected=null">Hide Details</b-button>
              </b-col>     
          </b-row>

          <b-row class="pb-2 bg-primary text-light" v-if="selected.ticker">
            <b-col sm="12" lg="12" class="fw-bold text-center display-6"> Tips for NoProfit/NoLoss</b-col>

            <b-col cols="6" lg= "2" class="fw-bold text-end">Buy</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock/4 | round5}}</b> @ {{(selected.ticker.last_price*5 - selected.efective_rate*4) | round5}}
            </b-col> 

            <b-col cols="6" lg="2" class="fw-bold text-end">Buy</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock/3 | round5}}</b> @ {{(selected.ticker.last_price*4 - selected.efective_rate*3) | round5}}
            </b-col> 

            <b-col cols="6" lg="2" class="fw-bold text-end">Buy</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock/2 | round5}}</b> @ {{(selected.ticker.last_price*3 - selected.efective_rate*2) | round5}}
            </b-col> 

            <b-col cols="6" lg="2" class="fw-bold text-end">Buy</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock | round5}}</b> @ {{(selected.ticker.last_price*2 - selected.efective_rate) | round5}}
            </b-col>

            <b-col cols="6" lg="2" class="fw-bold text-end">Buy</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock*2 | round5}}</b> @ {{(selected.ticker.last_price*3 - selected.efective_rate)/2 | round5}}
            </b-col> 

            <b-col cols="6" lg="2" class="fw-bold text-end">Buy</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock*3 | round5}}</b> @ {{(selected.ticker.last_price*4 - selected.efective_rate)/3 | round5}}
            </b-col> 
          </b-row>

          <b-row class="pb-2 bg-danger text-light" v-if="selected.ticker">
            <b-col cols="6" lg="2" class="fw-bold text-end">Sell</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock*3 | round5}}</b> @ {{(selected.efective_rate*4 - selected.ticker.last_price)/3 | round5}}
            </b-col>
            <b-col cols="6" lg="2" class="fw-bold text-end">Sell</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock*2 | round5}}</b> @ {{(selected.efective_rate*3 - selected.ticker.last_price)/2 | round5}}
            </b-col>
             <b-col cols="6" lg="2" class="fw-bold text-end">Sell</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock | round5}}</b> @ {{(selected.efective_rate*2 - selected.ticker.last_price) | round5}}
            </b-col>
             <b-col cols="6" lg="2" class="fw-bold text-end">Sell</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock/2 | round5}}</b> @ {{(selected.efective_rate*3 - selected.ticker.last_price*2) | round5}}
            </b-col>
             <b-col cols="6" lg="2" class="fw-bold text-end">Sell</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock/3 | round5}}</b> @ {{(selected.efective_rate*4 - selected.ticker.last_price*3) | round5}}
            </b-col>
             <b-col cols="6" lg="2" class="fw-bold text-end">Sell</b-col>
            <b-col cols="6" lg="2" class="text-start">
              <b>{{selected.stock/4 | round5}}</b> @ {{(selected.efective_rate*5 - selected.ticker.last_price*4) | round5}}
            </b-col>
          </b-row>

        </b-card>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
    selected : {},
    summary : {},
    myOrders : {}
  },
  data: () => ({
  }),
  computed: {
  },
  filters: {
  },
  created : function () {
  },
  methods: {
    onDivClicked : function(){
      alert("This is alert")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
