<template>
  <a-card :bordered="false" class="dashboard-bar-line header-solid">
      <b-table small striped :items="myOrders"  id="myOrders" fixed head-dark light
       :fields="fields">
        <template v-slot:cell(side)="order">
          <span :data-value="order.value" :class="{
           'text-danger' : (order.value == 'sell'), 
           'text-success' : (order.value == 'buy'),
           'text-dark text-bold ' : (order.value == 'Current Rate'),
           'text-info text-bold' : (order.value == 'BuyRate Stock'),
           'text-primary text-bold' : (order.value == 'Buy Rate'),
           'text-purple text-bold' : (order.value == 'Sell Rate')
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
            { key: 'market', label : "Orders", class:"market"},
            { key: 'side', label : "Side" ,class:"side"},
            { key: 'ppu', label : "Price", class:"ppu" },
            { key: 'total_quantity', label : "TQty",class:"total_quantity"},
            { key: 'amount', label : "Amount",class:"amount"}
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


  #myOrders tr.table-Yr-High td {
    background-color: #27dfaa;
  }
   #myOrders tr.table-Yr-High td.market ,
   #myOrders tr.table-Yr-High td.total_quantity,
   #myOrders tr.table-Yr-High td.amount{
    color: #27dfaa;
   }
    

   #myOrders tr.table-Mo-High td {
    background-color: #09bc88;
  }
   #myOrders tr.table-Mo-High td.market ,
   #myOrders tr.table-Mo-High td.total_quantity,
   #myOrders tr.table-Mo-High td.amount{
    color: #09bc88;
   }

   #myOrders tr.table-Wk-High td {
    background-color: #00825c;
  }
   #myOrders tr.table-Wk-High td.market ,
   #myOrders tr.table-Wk-High td.total_quantity,
   #myOrders tr.table-Wk-High td.amount{
    color: #00825c;
   }

   #myOrders tr.table-Yr-Low td {
    background-color: #59181b;
  }
   #myOrders tr.table-Yr-Low td.market ,
   #myOrders tr.table-Yr-Low td.total_quantity,
   #myOrders tr.table-Yr-Low td.amount{
    color: #59181b;
   }

   #myOrders tr.table-Mo-Low td {
    background-color: #59181b;
  }
   #myOrders tr.table-Mo-Low td.market ,
   #myOrders tr.table-Mo-Low td.total_quantity,
   #myOrders tr.table-Mo-Low td.amount{
    color: #59181b;
   }

   #myOrders tr.table-Wk-Low td {
    background-color: #59181b;
  }
   #myOrders tr.table-Wk-Low td.market ,
   #myOrders tr.table-Wk-Low td.total_quantity,
   #myOrders tr.table-Wk-Low td.amount{
    color: #59181b;
   }

    #myOrders tr.table-24-High td {
    background-color: #025e43;
  }
   #myOrders tr.table-24-High td.market ,
   #myOrders tr.table-24-High td.total_quantity,
   #myOrders tr.table-24-High td.amount{
    color: #025e43;
   }


    #myOrders tr.table-24-Low td {
    background-color: #59181b;
  }
   #myOrders tr.table-Wk-Low td.market ,
   #myOrders tr.table-Wk-Low td.total_quantity,
   #myOrders tr.table-Wk-Low td.amount{
    color: #59181b;
   }

   
  
    #myOrders tr.table-Yr-High td.side,
    #myOrders tr.table-Mo-High td.side,
    #myOrders tr.table-Wk-High td.side,
    #myOrders tr.table-Yr-Low td.side,
    #myOrders tr.table-Mo-Low td.side,
    #myOrders tr.table-Wk-Low td.side,
    #myOrders tr.table-24-High td.side,
    #myOrders tr.table-24-Low td.side,
    #myOrders tr.table-Yr-High td.ppu,
    #myOrders tr.table-Mo-High td.ppu,
    #myOrders tr.table-Wk-High td.ppu,
    #myOrders tr.table-Yr-Low td.ppu,
    #myOrders tr.table-Mo-Low td.ppu,
    #myOrders tr.table-Wk-Low td.ppu,
    #myOrders tr.table-24-High td.ppu,
    #myOrders tr.table-24-Low td.ppu {
    color: #FFF;
    font-weight: 600;
  }
  
</style>
