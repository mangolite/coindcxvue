<template>

	<a-card :bordered="false" class="dashboard-bar-line header-solid ant-col-24 b-border">
    <div class=" title "></div>
	<b-table 	:items="items" :fields="fields" class="no-bdr" id="pnl"
	stacked="md">

	<template #cell(symbol)="row">
		<router-link :to="`/trade2/${account}/${row.item.symbol}`" 
			tag="b" style="cursor:pointer">
			{{ row.item.symbol}}<br/>
            <span v-if="row.item.ticker && row.item.meta" class="text-left text-right next-line" :class="{
                'fw-bold text-success' : (row.item.ticker.last_price > row.item.meta.buy_rate),
                'fw-bold text-danger' : (row.item.ticker.last_price < row.item.meta.buy_rate),
              }">
                @{{row.item.ticker.last_price | round5}}
              </span> 
		</router-link>
            <small class="fw-bold  badge p-range text-xxs">
                <span v-if="row.item.ticker">
                   {{(row.item.range.dHigh-row.item.range.dLow)/row.item.range.dHigh*100 | round}}
        		</span>-<span v-if="row.item.range">
                   {{(row.item.range.wHigh-row.item.range.wLow)/row.item.range.wHigh*100 | round}}
                 </span>-<span v-if="row.item.range">
                   {{(row.item.range.mHigh-row.item.range.mLow)/row.item.range.mHigh*100 | round}}
                 </span>-<span v-if="row.item.range" >
                   {{(row.item.range.m3High-row.item.range.m3Low)/row.item.range.m3High*100 | round}}
                 </span>-<span v-if="row.item.range">
                   {{(row.item.range.yHigh-row.item.range.yLow)/row.item.range.yHigh*100 | round}}<small>%</small>
                 </span>
              </small>
    </template> 
		<template #cell(buy_amount)="row">
				<div class="text-bold float-start-x">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.meta.buy_amount | round2}}
				</div>
				<div class="text-xs coin">{{row.item.meta.buy_quantity | round5}}</div>
				<div class="text-sm  float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold fix price-u' : (row.item.ticker.last_price > row.item.meta.buy_rate),
						'fw-bold fix price-d' : (row.item.ticker.last_price < row.item.meta.buy_rate),
					}">
						@&nbsp;{{row.item.meta.buy_rate | round5}}
					</div> 
				</div>
		</template>
		<template #cell(sell_amount)="row">
				<div class="text-bold float-start-x">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.meta.sell_amount | round2}}
				</div>
				<div class="text-xs coin">{{row.item.meta.sell_quantity | round5}}</div>
				<div class="text-sm text-primary float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold text-success price-u' : (row.item.meta.sell_rate > row.item.meta.buy_rate),
						'fw-bold text-danger price-d' : (row.item.meta.sell_rate < row.item.meta.buy_rate),
					}">
						@&nbsp;{{row.item.meta.sell_rate | round5}}
					</div> 
				</div>
		</template>
		<template #cell(onsale)="row">
				<div class="text-bold float-start-x">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.order.onsale_amount | round2}}
				</div>
				<div class="text-xs coin">{{row.item.order.onsale_qty | round5}}</div>
				<div class="text-sm  float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold text-success price-u' : (row.item.order.onsale_rate > row.item.meta.buy_rate_stock),
						'fw-bold text-danger price-d' : (row.item.order.onsale_rate < row.item.meta.buy_rate_stock),
					}">
						@&nbsp;{{row.item.order.onsale_rate | round5}}
					</div> 
				</div>
		</template>
		
		<template #cell(stkwrth)="row">
				<div class="text-bold  float-start-x buy">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.meta.buy_rate_stock * row.item.meta.stock | round5}}
				</div>
				<div class="text-xs coin">{{(row.item.meta.buy_quantity - row.item.meta.sell_quantity )| round5}}</div>
				<div class="text-sm  float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center float-start" :class="{
						'fw-bold fix ' : (row.item.ticker.last_price > row.item.meta.buy_rate_stock),
						'fw-bold fix' : (row.item.ticker.last_price < row.item.meta.buy_rate_stock),
					}">
						@&nbsp;{{row.item.meta.buy_rate_stock | round5}}
					</div> 
					
				</div>
		</template>
		<template #cell(onbuy)="row">
				<div class="text-bold float-start-x">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.order.onbuy_amount | round2}}
				</div>
				<div class="text-xs coin">{{row.item.order.onbuy_qty | round5}}</div>
				<div class="text-sm text-primary float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold fix price-u' : (row.item.ticker.last_price > row.item.meta.sell_rate),
						'fw-bold fix price-d' : (row.item.ticker.last_price < row.item.meta.sell_rate),
					}">
						@&nbsp;{{row.item.order.onbuy_rate | round5}}
					</div> 
				</div>
		</template>

		
		<template #cell(stock)="row">
				<div class="text-bold text-center">

					<div class="float-start sell fw-bold">
						<span class="fa fa-rupee-sign text-xxs " aria-hidden="true"></span>
						{{row.item.ticker.last_price * row.item.order.onsale_qty | round2}}
					</div>
					+					<div class="float-end stk fw-bold">
						<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
						{{row.item.ticker.last_price  * row.item.balance.balance | round5}}
					</div>
					
				</div>
				<div >
								
				<div class="text-xs coin float-start">
						{{row.item.order.onsale_qty | round5}}
				</div>
				<div class="text-xs coin text-right">
						{{row.item.balance.balance | round5}}
				</div>
				</div>
				<div class="text-sm  text-center">
					
					
					<div v-if="row.item.ticker && row.item.meta" class="text-center " :class="{
						'fw-bold text-success ' : (row.item.ticker.last_price > row.item.meta.buy_rate_stock),
						'fw-bold text-danger' : (row.item.ticker.last_price < row.item.meta.buy_rate_stock),
					}">
						@&nbsp;{{row.item.ticker.last_price | round5}}
					</div>


				</div>
		</template>

		<template #cell(profit)="row">
			<div class="fw-bold float-start-x">
					<span class="fa fa-rupee-sign pro text-xxs" aria-hidden="true"></span>&nbsp;
					<b v-if="row.item.meta" class="pro" >
						{{row.value | round2}}
					</b>
				</div>
				<div class="float-start-x" :class="{
					'sell ' : row.item.meta.earning<0,
					'buy ' : row.item.meta.earning>0
					}">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>&nbsp;
					<small v-if="row.item.meta"  >{{row.item.meta.earning | round2}}</small>
				</div>
				
		</template>
		<template #cell(profit_presale)="row">
			<div class="fw-bold float-start-x">
					<span class="fa fa-rupee-sign pro text-xxs" aria-hidden="true"></span>&nbsp;
					<b v-if="row.item.meta" class="pro">
						{{row.value | round2}}
					</b>
				</div>
				<div class="float-start-x" :class="{
                	'sell ' : row.item.meta.efective_rate>row.item.ticker.last_price,
                  	'buy ' : row.item.meta.efective_rate<row.item.ticker.last_price
					}">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>&nbsp;
					<small v-if="row.item.meta && row.item.ticker" >
						{{row.item.meta.stock*row.item.ticker.last_price * 0.999 + row.item.meta.earning  | round2}}
					</small>
				</div>
				
		</template>
		<template #cell(profit_postsale)="row">
			<div class="fw-bold float-start-x">
					<span class="fa fa-rupee-sign pro text-xxs" aria-hidden="true"></span>&nbsp;
					<b v-if="row.item.meta" class="pro">
						{{row.value | round2}}
					</b>
				</div>
				<div class="float-start-x" :class="{
					'sell' : row.item.meta.now_profit>row.item.meta.postsale_profit,
					'buy' : row.item.meta.now_profit<row.item.meta.postsale_profit
					}">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>&nbsp;
					<small v-if="row.item.meta" >
						{{row.item.meta.postsale_profit | round2}}
					</small>
				</div>
				
		</template>
	</b-table>
	</a-card>	
</template>

<script>
	import formatter from "./../formatter";
	export default ({
		props: {
			account : {
			},
			items : {
			},
			total : {
			},
		},
		data: () => ({
			fields: [ { key: 'symbol', label : "Coin  ", sortable: true, variant : "1dark",class:"  f-row" }, 
					//{ key: 'now_rate', label : "PRICE", sortable: false,variant : "dark" },  
					//{ key: 'low_high', label : "L-H,24h", sortable: false,variant : "secondary" }, 
					{ key: 'buy_amount', label: 'Purchases',sortable: true, variant : "success",sortByFormatted:true, 
						formatter: (v,k,item) => item.meta.buy_amount},  
					{ key: 'sell_amount', label: 'Sold',sortable: true, variant : "danger",sortByFormatted:true,
						formatter: (v,k,item) => item.meta.sell_amount},
					{ key: 'profit', label: ' PastPNL', sortable: true, variant : "1dark",class:"",sortByFormatted:true,
						formatter: (v,k,item) => (item.meta.sell_rate-item.meta.buy_rate)*item.meta.sell_quantity},
						{ key: 'stkwrth', label: ' Stock@buyrate', sortable: true, variant : "stock", class:"fw-normal",sortByFormatted:true,
						formatter: (v,k,item) => formatter.num(item?.balance?.balance || 0) * formatter.num(item?.ticker?.last_price || 0) * 0.999 },
					{ key: 'stock', label: ' Stock@currentrate', sortable: true, variant : "stock",sortByFormatted:true,
						formatter: (v,k,item) => item.meta.stock_worth},
						
					{ key: 'profit_presale', label: 'NowPNL', sortable: true, variant : "1dark",class:"", sortByFormatted:true,
						formatter: (v,k,item) => item.meta.stock*(item.ticker.last_price-item.meta.buy_rate_stock) * 0.999 },
					{ key: 'onsale', label: ' OnSale', sortable: true, variant : "danger", sortByFormatted:true,
						formatter: (v,k,item) => item.order.onsale_amount },
						{ key: 'onbuy', label: ' OnBuy', sortable: true, variant : "success",class:"buy",sortByFormatted:true,
						formatter: (v,k,item) => item.order.onbuy_amount },
					
					{ key: 'profit_postsale', label: ' FuturePNL', sortable: true, variant : "1dark", class:" l-row",sortByFormatted:true,
						formatter: (v,k,item) => item.order.onsale_qty*(item.order.onsale_rate-item.meta.buy_rate_stock) * 0.999},
					
					//{ key: 'valotile', label: 'Volatile%',sortable: false, variant : "secondary"},
					//{ key: 'buy_quantity', label: 'Buy Quantity',sortable: true, variant : "warning"}, 
					//{ key: 'buy_amount', label: 'Buy Amount', sortable: true, variant : "warning" }, 
					//{ key: 'sell_rate', label: 'Avg Sell Rate', sortable: false, variant : "info"},
					// { key: 'sell_quantity', label: 'Sell Quantity', sortable: true, variant : "info"}, 
					//{ key: 'sell_amount', label: 'Sell Amount', sortable: false, variant : "info"},
					//{ key: 'fee_amount', label: 'Fee', sortable: false,variant : "danger"},
					//{ key: 'efective_rate', label: 'EffRate', variant : "success"},
					//{ key: 'stock', label: ' COINS COUNT ', variant : "danger"},
					
			],
		}),
		components: {
		},
		computed : {
		},
	})
</script>
<style >

  #pnl  thead tr th {
  	background-color: white!important;
  	color: black!important;
  	font-weight: 800!important;
  	text-shadow: 0px 0px 4px #8b8b8b;
 } 


	
	 .b-border .ant-card-body {
    padding: 16px;
    padding-inline: 4px;
}   
    .text-danger{
    	color: #fc444e!important;
    }

    .text-success {
    color: #10ab57!important;
}
   
   .stk{
      color: #1486bf;
    }

   .coin{
   	    color: #fff1c6;
    font-family: cursive;
   }

   .buy{
      color: #128961;
    }  

  .sell{
      color: #a30c0c;
    }

	.fix{
		color: #a19e9d!important;
   
	}

	 
	    .pro{
   	color: #da7e1a;
   	    font-size: 16px;

   }
   .no-bdr{
   	border: 0px;
   }

   @media (max-width: 767.98px){
      #pnl  .f-row {
      	border: 0px;

        border-radius: 25px 25px 0px 0px ;
      }
      #pnl .l-row{

        border-radius: 0px 0px 25px 25px ;
      }
      #pnl tr {
      	margin-top: 10px;
      }
      .table.b-table.b-table-stacked-md > tbody > tr > [data-label]::before {
    content: attr(data-label);
    width: 40%;
    float: left;
    text-align: right;
    overflow-wrap: break-word;
    font-weight: bold;
    font-style: normal;
    padding: 0 calc(1rem / 2) 0 0;
    margin: 0;
    color: white!important;
    font-weight: 800!important;
    text-shadow: 1px 1px 3px #545454;

   }
 }

   

   #pnl  .table-1dark {
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

.table-success {
    --bs-table-bg: #007f69;
    --bs-table-striped-bg: #007f69;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #bcd0c7;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #c1d6cc;
    --bs-table-hover-color: #000;
    color: #fff;
    border-color: #ffffff;
}

  .table-danger {
    --bs-table-bg: #83000c;
    --bs-table-striped-bg: #83000c;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #dfc2c4;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #e5c7ca;
    --bs-table-hover-color: #000;
    color: #fff;
    border-color: #ffffff;
}

 .table-stock {
    --bs-table-bg: #c3c3c3;
    --bs-table-striped-bg: #c3c3c3;
    --bs-table-striped-color: #000;
    --bs-table-active-bg: #dfc2c4;
    --bs-table-active-color: #000;
    --bs-table-hover-bg: #000000ad;
    --bs-table-hover-color: #000;
    color: #ffffff;
    border-color: #ffffff;
}

</style>