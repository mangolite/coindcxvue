<template>
 
  <a-card :bordered="false" class="dashboard-bar-line header-solid">
    <div class=" title"> ORDERS & HIGHLIGHTS</div>
      <b-table small striped :items="myOrders"  id="myOrders" fixed head-dark light
       :fields="fields">

        <template v-slot:cell(side)="order">
          <span :data-value="order.value" :class="{
           'text-danger' : (order.value == 'sell'), 
           'text-success' : (order.value == 'buy'),
           
           
          }" v-tooltip="order.item.desc" >{{order.value}}</span>
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
            { key: 'market', label : "Coin", class:"market"},
            { key: 'side', label : "Market" ,class:"side"},
            { key: 'ppu', label : "Price", class:"ppu" },
            { key: 'total_quantity', label : "TQty",class:"total_quantity"},
            { key: 'amount', label : "Amount",class:"amount"}
        ]
    }),
}
</script>
  

<style>
  #myOrders tr td {
    border: 0px ;
  }
  #myOrders  {
    border: 0px ;
  }
  
  #myOrders thead tr th{
    background-color: white;
    color: black!important;
    border: 0px;
    font-weight: 1000;
  }
  
  #myOrders tr.table-buyRateStock td,
  #myOrders tr.table-buyRate td {
    background-color: #18c4e8;
  }
  

  #myOrders tr.table-warning{
    border: 10px solid black;
    
  }

  #myOrders tr.table-OnBuy{
    border: 5px solid #6da896;

  }


  #myOrders tr.table-OnSell{
    border: 5px solid #c47878 ;
   
  }

  #myOrders tr.table-warning td {
    background-color: black!important;
    color: #ffc338;
    font-weight: 700;
  }

  #myOrders tr.table-warning td.ppu{
    font-size: 15px;
  }

  .table-warning {
    --bs-table-bg: #000000;
    --bs-table-striped-bg: #000000;
  }
 
  #myOrders tr.table-warning td.ppu .fw-bold {
    font-weight: 900!important;
  }
  

  #myOrders tr.table-Yr-High td {
    background-color: #03261c;
  }
    
   #myOrders tr.table-Mo-High td {
    background-color:  #00825c;
  }
 
  #myOrders tr.table-3Mo-High td {
    background-color: #025e43;
  }

   #myOrders tr.table-Wk-High td {
    background-color:#09bc88;
  }

   #myOrders tr.table-Yr-Low td {
    background-color: #420406;
  }
 
   #myOrders tr.table-Mo-Low td {
    background-color: #b4181d;
  }
   #myOrders tr.table-3Mo-Low td {
    background-color: #76060a;
  }
  
   #myOrders tr.table-Wk-Low td {
    background-color:#d63940;
  }
   
    #myOrders tr.table-24-High td {
    background-color: #27dfaa
  }
   
    #myOrders tr.table-24-Low td {
    background-color: #ff7575;
  }
  #myOrders tr.table-SellRate td{
    background-color: #3b50c3;
    color: whitesmoke;
  }
  #myOrders tr.table-SellRate td.ppu .fw-bold{
    font-weight: 900!important;
    
  }
    

   #myOrders tr.table-SellRate td.market,
   #myOrders tr.table-buyRateStock td.market,
  #myOrders tr.table-buyRate td.market,
   #myOrders tr.table-Yr-High td.market ,
   #myOrders tr.table-Yr-High td.total_quantity,
   #myOrders tr.table-Yr-High td.amount,
   #myOrders tr.table-Mo-High td.market ,
   #myOrders tr.table-Mo-High td.total_quantity,
   #myOrders tr.table-Mo-High td.amount,
    #myOrders tr.table-3Mo-High td.market ,
   #myOrders tr.table-3Mo-High td.total_quantity,
   #myOrders tr.table-3Mo-High td.amount,
   #myOrders tr.table-Wk-High td.market ,
   #myOrders tr.table-Wk-High td.total_quantity,
   #myOrders tr.table-Wk-High td.amount,
   #myOrders tr.table-Yr-Low td.market ,
   #myOrders tr.table-Yr-Low td.total_quantity,
   #myOrders tr.table-Yr-Low td.amount,
   #myOrders tr.table-Mo-Low td.market ,
   #myOrders tr.table-Mo-Low td.total_quantity,
   #myOrders tr.table-Mo-Low td.amount,
   #myOrders tr.table-3Mo-Low td.market ,
   #myOrders tr.table-3Mo-Low td.total_quantity,
   #myOrders tr.table-3Mo-Low td.amount,
   #myOrders tr.table-Wk-Low td.market ,
   #myOrders tr.table-Wk-Low td.total_quantity,
   #myOrders tr.table-Wk-Low td.amount,
   #myOrders tr.table-24-High td.market ,
   #myOrders tr.table-24-High td.total_quantity,
   #myOrders tr.table-24-High td.amount,
   #myOrders tr.table-24-Low td.market ,
   #myOrders tr.table-24-Low td.total_quantity,
   #myOrders tr.table-24-Low td.amount
  
   {
    color:#9b262b00 !important;
   }

   
    #myOrders tr.table-SellRate td,
    #myOrders tr.table-buyRateStock td,
    #myOrders tr.table-buyRate td,
    #myOrders tr.table-Yr-High td.side,
    #myOrders tr.table-Mo-High td.side,
    #myOrders tr.table-3Mo-High td.side,
    #myOrders tr.table-Wk-High td.side,
    #myOrders tr.table-Yr-Low td.side,
    #myOrders tr.table-Mo-Low td.side,
    #myOrders tr.table-3Mo-Low td.side,
    #myOrders tr.table-Wk-Low td.side,
    #myOrders tr.table-24-High td.side,
    #myOrders tr.table-24-Low td.side,
    #myOrders tr.table-Yr-High td.ppu,
    #myOrders tr.table-Mo-High td.ppu,
    #myOrders tr.table-3Mo-High td.ppu,
    #myOrders tr.table-Wk-High td.ppu,
    #myOrders tr.table-Yr-Low td.ppu,
    #myOrders tr.table-3Mo-Low td.ppu,
    #myOrders tr.table-Mo-Low td.ppu,
    #myOrders tr.table-Wk-Low td.ppu,
    #myOrders tr.table-24-High td.ppu,
    #myOrders tr.table-24-Low td.ppu {
    color: #FFF!important;
    font-weight: 600;
  }
    

    #myOrders tr.table-SellRate ,
    #myOrders tr.table-buyRateStock ,
    #myOrders tr.table-buyRate,
    
    #myOrders tr.table-Yr-High ,
    #myOrders tr.table-Mo-High ,
    #myOrders tr.table-Wk-High ,
    #myOrders tr.table-Yr-Low ,
    #myOrders tr.table-Mo-Low ,
    #myOrders tr.table-Wk-Low ,
    #myOrders tr.table-24-High ,
    #myOrders tr.table-24-Low ,
    #myOrders tr.table-Yr-High ,
    #myOrders tr.table-Mo-High ,
    #myOrders tr.table-Wk-High ,
    #myOrders tr.table-Yr-Low ,
    #myOrders tr.table-Mo-Low ,
    #myOrders tr.table-Wk-Low ,
    #myOrders tr.table-24-High,
    #myOrders tr.table-24-Low  {
    
    border: 4px solid whitesmoke;
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
