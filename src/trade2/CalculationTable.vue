<template>
	<b-table
	:items="items" :fields="fields">
		
	<template #cell(symbol)="row">
		<router-link :to="`/trade2/${account}/${row.item.symbol}`" 
			tag="span">
			{{ row.item.symbol}}<br/>
            <span v-if="row.item.ticker && row.item.meta" class="text-left text-right next-line" :class="{
                'fw-bold text-success' : (row.item.ticker.last_price > row.item.meta.buy_rate),
                'fw-bold text-danger' : (row.item.ticker.last_price < row.item.meta.buy_rate),
              }">
                @{{row.item.ticker.last_price | round5}}
              </span> 
		</router-link>
    </template> 
		<template #cell(purchase)="row">
				<div class="text-bold float-start-x">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.meta.buy_amount | round2}}
				</div>
				<div class="text-xs text-primary">{{row.item.meta.buy_quantity | round5}}</div>
				<div class="text-sm text-primary float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold text-success price-u' : (row.item.ticker.last_price > row.item.meta.buy_rate),
						'fw-bold text-danger price-d' : (row.item.ticker.last_price < row.item.meta.buy_rate),
					}">
						@&nbsp;{{row.item.meta.buy_rate | round5}}
					</div> 
				</div>
		</template>
		<template #cell(sale)="row">
				<div class="text-bold float-start-x">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
					{{row.item.meta.sell_amount | round2}}
				</div>
				<div class="text-xs text-primary">{{row.item.meta.sell_quantity | round5}}</div>
				<div class="text-sm text-primary float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold text-success price-u' : (row.item.ticker.last_price > row.item.meta.sell_rate),
						'fw-bold text-danger price-d' : (row.item.ticker.last_price < row.item.meta.sell_rate),
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
				<div class="text-xs text-primary">{{row.item.order.onsale_qty | round5}}</div>
				<div class="text-sm text-primary float-start">
					<div v-if="row.item.ticker && row.item.meta" class="text-center" :class="{
						'fw-bold text-success price-u' : (row.item.ticker.last_price > row.item.meta.sell_rate),
						'fw-bold text-danger price-d' : (row.item.ticker.last_price < row.item.meta.sell_rate),
					}">
						@&nbsp;{{row.item.order.onsale_rate | round5}}
					</div> 
				</div>
		</template>
		<template #cell(profit)="row">
				<div class="text-bold float-start-x" :class="{
					'fw-bold sell ' : row.item.meta.earning<0,
					'fw-bold buy ' : row.item.meta.earning>0
					}">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>&nbsp;
					<b v-if="row.item.meta"  >{{row.item.meta.earning | round2}}</b>
				</div>
		</template>
		<template #head(stock)="data">
				<div class="text-bold text-center text-info">
					<div class="float-start text-xs">
						Purchase
						<span class="fw-normal next-line">@buyrate</span>
					</div>
					<span class="text-lg">{{ data.label}}</span>
					<div class="float-end text-xs">
						Worth <span class="fw-normal next-line">@current_rate</span>
					</div>
				</div>
      	</template>
		<template #cell(stock)="row">
				<div class="text-bold text-center">
					<div class="float-start">
						<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
						{{row.item.meta.buy_rate_stock * row.item.meta.stock | round2}}
					</div>
					&nbsp;
					<div class="float-end">
						<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>
						{{row.item.meta.stock_worth | round2}}
					</div>
				</div>
				<div class="text-xs text-primary text-center">
						{{(row.item.meta.buy_quantity - row.item.meta.sell_quantity )| round5}}
				</div>
				<div class="text-sm text-primary text-center">
					<div v-if="row.item.ticker && row.item.meta" class="text-center float-start" :class="{
						'fw-bold text-success ' : (row.item.ticker.last_price > row.item.meta.buy_rate_stock),
						'fw-bold text-danger' : (row.item.ticker.last_price < row.item.meta.buy_rate_stock),
					}">
						@&nbsp;{{row.item.meta.buy_rate_stock | round5}}
					</div> 
					<div v-if="row.item.ticker && row.item.meta" class="text-center float-end" :class="{
						'fw-bold text-success ' : (row.item.ticker.last_price > row.item.meta.buy_rate_stock),
						'fw-bold text-danger' : (row.item.ticker.last_price < row.item.meta.buy_rate_stock),
					}">
						@&nbsp;{{row.item.ticker.last_price | round5}}
					</div> 
				</div>
		</template>
		<template #cell(profit_presale)="row">
				<div class="text-bold float-start-x" :class="{
                	'fw-bold sell ' : row.item.meta.efective_rate>row.item.ticker.last_price,
                  	'fw-bold buy ' : row.item.meta.efective_rate<row.item.ticker.last_price
					}">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>&nbsp;
					<b v-if="row.item.meta && row.item.ticker" >
						{{row.item.meta.stock*row.item.ticker.last_price * 0.999 + row.item.meta.earning | round2}}
					</b>
				</div>
		</template>
		<template #cell(profit_postsale)="row">
				<div class="text-bold float-start-x" :class="{
					'fw-bold sell' : row.item.meta.now_profit>row.item.meta.postsale_profit,
					'fw-bold buy' : row.item.meta.now_profit<row.item.meta.postsale_profit
					}">
					<span class="fa fa-rupee-sign text-xxs" aria-hidden="true"></span>&nbsp;
					<b v-if="row.item.meta" >
						{{row.item.meta.postsale_profit | round2}}
					</b>
				</div>
		</template>
	</b-table>	
</template>

<script>
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
			fields: [ { key: 'symbol', label : "Coin   ", sortable: false, variant : "1dark" }, 
					//{ key: 'now_rate', label : "PRICE", sortable: false,variant : "dark" },  
					//{ key: 'low_high', label : "L-H,24h", sortable: false,variant : "secondary" }, 
					{ key: 'purchase', label: 'Purchases',sortable: false, variant : "success"},  
					{ key: 'sale', label: 'Sale',sortable: false, variant : "danger"},
					{ key: 'profit', label: ' PNL', variant : "dark"},
					{ key: 'stock', label: ' Stock', variant : "light"},
					{ key: 'profit_presale', label: 'PreSalePNL', variant : "dark"},
					{ key: 'onsale', label: ' OnSale', variant : "danger"},
					{ key: 'profit_postsale', label: ' PostSalePNL', variant : "dark"}
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