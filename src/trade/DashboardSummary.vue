<template>
      <div >
        <b-card class="ml-auto"> 
          <b-row class="pb-2 pb-2 bg-white text-dark">
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
</template>

<script>

export default {
  name: 'DSummary',
  props: {
    selected : {},
    summary : {},
    myOrders : {},
    total : {}
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
