<template>
 
  <a-card :bordered="false" class="dashboard-bar-line header-solid">
    <div class=" title"> ORDERS & HIGHLIGHTS</div>
      <b-table small striped :items="myOrders"  id="myOrders" fixed head-dark light
       :fields="fields">

        <template v-slot:cell(market)="order">
          <span class="text-xs"> {{order.value}}</span>
        </template>

        <template v-slot:cell(side)="order">
          <span :data-value="order.value"  class="text-xs" :class="{
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
          <span class="fw-bold" v-tooltip="new Date(order.item.updated_at).toLocaleString()">
            {{(order.item.amount || (order.item.price_per_unit * order.item.total_quantity)) | round2}}
            </span>
        </template>

        <template #cell(actions)="order">
          <span v-if="order.item.sidex == 'BUY' || order.item.sidex == 'BUYSELL'"
            class="mx-1 fw-bold btn btn-xs btn-sm pointer btn-success text-xs float-end"
            v-tooltip="'Buy Order'"
            @click="makeOrder({ 
                type : 'BUY', market : order.item.market,
                ppu : order.item ? order.item.price_per_unit : 0,
                quantity :order.item ?  order.item.total_quantity : 0
            })"
            >B
          </span>

          <span v-if="order.item.sidex == 'SELL' || order.item.sidex == 'BUYSELL'"
            class="mx-1 fw-bold btn btn-xs btn-sm pointer btn-danger text-xs float-end"
            v-tooltip="'Sell Order'"
            @click="makeOrder({ 
                type : 'SELL', market : order.item.market,
                ppu : order.item ? order.item.price_per_unit : 0,
                quantity :order.item ?  order.item.total_quantity : 0
            })"
            >S
          </span>

          <span v-if="order.item.id"
            class="mx-1 fw-bold  btn btn-xs btn-sm pointer btn-warning text-xs float-end"
            v-tooltip="'Cancel Order'"
            @click="$store.dispatch('cancelOrder',{ 
                id : order.item.id,
                price_per_unit : order.item.price_per_unit,
                amount : order.item.price_per_unit * order.item.total_quantity,
                total_quantity : order.item.total_quantity
            })"
            >X
          </span>

        </template>

      </b-table>

   <b-modal
      id="modal-buy-sell"
      ref="buysell"
      :title="buysell.type"
      @ok="makeOrderOk"
      
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">

        <b-form-group
          label="Price Per Unit (Rate)"
          label-for="api-name-input"
          invalid-feedback="PPU is required"
          class="acc-modal"
        >
          <b-form-input
            id="api-key-input"
            v-model="buysell.ppu"
            required
          ></b-form-input>

        </b-form-group>

        <b-form-group
          :label="`Total Quantity to ${buysell.type}`"
          label-for="api-key-input"
          invalid-feedback="Quantity is required"
        >
          <b-form-input
            id="api-key-input"
            v-model="buysell.quantity"
            required
          ></b-form-input>

        </b-form-group>

      <b-form-group
          label="Amount"
          label-for="api-secret-input"
        >

          <b-form-input
            id="api-secret-input"
            v-model="buysell_amount" readonly
            required
          ></b-form-input>

        </b-form-group>

      </form>
    </b-modal>

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
            { key: 'amount', label : "Amount",class:"amount"},
             { key: 'actions', label : "Actions",class:"action"},
            // { key: 'sidex', label : "Sidex" ,class:"sidex"},
        ],
        buysell : {
          type : 'BUY',
          ppu : 0,
          quantity : 0,
          amount : 0
        }
    }),
    computed :{
      buysell_amount (){
        return this.buysell.ppu * this.buysell.quantity;
      }
    },
    methods : {
      makeOrder({type,ppu,quantity,market}){
        this.$bvModal.show('modal-buy-sell');
        this.buysell.type  = type;
        this.buysell.ppu  = ppu;
        this.buysell.quantity  = quantity || 1;
        this.buysell.market  = market;
        console.log(this.buysell)
      },
      makeOrderOk(){
        this.buysell.amount = this.buysell_amount
        console.error(this.buysell)
        this.$store.dispatch('makeOrder',this.buysell);
      },
    }
}
</script>
  

<style>
  #myOrders tr td {
    border: 0px ;
  }
  #myOrders  {
    border: 0px ;
    line-height: 1.7em;
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
    border: 5px solid #454545;
    
  }

  #myOrders tr.table-OnBuy{
    border: 1px solid #6da896;
    background-color: #6da89673;
  }

  #myOrders tr.table-OnBuy td.side{
         color: green;
  }


  #myOrders tr.table-OnSell{
    border: 1px solid #d79898;
    background-color: #c4787881;
    color: ;
  }

  #myOrders tr.table-OnSell td.side{
    color: #b22626;
  }

  #myOrders tr.table-warning td {
    background-color: black!important;
    color: #ffc338;
    font-weight: 700;
  }

  #myOrders tr.table-warning td.ppu{
    font-size: 18px;
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
    font-size: .8em;
    padding-bottom: 0px;
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
    
    border: 2px solid whitesmoke;
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
