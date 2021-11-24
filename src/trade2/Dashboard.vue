<!-- 
	This is the dashboard page, it uses the dashboard layout in: 
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<!-- Counter Widgets -->
		<a-row :gutter="24">
			<a-col :span="24" :lg="12" :xl="6" class="mb-24" v-if="total">
			<WidgetCounter
				:title="'Total  Worth '"
				:icon="'fa fa-equals '"
				:status="'stat.status'">
				<template #prefix>
					<span class="fa fa-rupee-sign"/>
				</template>	
				<template #formatter>
					<span class="t-w"> {{total.netWorth | round2}}</span>
					<br>
				</template>	
				<template #suffix>
					<span class="text-sm fa fa-arrow-right"/>&nbsp;
					<span class="text-sm fa fa-rupee-sign"></span>&nbsp;{{total.afterSellWorth | round2}}<br>
					<span class="text-sm font-semibold">After Sale Worth</span>
				</template>	
			</WidgetCounter>
			</a-col>
			<a-col :span="24" :lg="12" :xl="6" class="mb-24" v-if="total">
			<WidgetCounter
				:title="' +  Coins Worth'"
				:icon="'fa fa-coins '"
				:status="'primary'">
				<template #prefix>
					<span class="fa fa-rupee-sign"/>
				</template>	
				<template #formatter>
					<span class="c-w"> {{total.netStockWorth | round2}}</span>
					<br>
				</template>	
				<template #suffix>
					<span class="text-sm fa fa-rupee-sign "></span>&nbsp;{{(total.inStockWorth*1) | round2}}<br>
					<span class="text-sm font-semibold ">Reserve coins worth </span>
				</template>	
			</WidgetCounter>
			</a-col>
			<a-col :span="24" :lg="12" :xl="6" class="mb-24" v-if="total">
			<WidgetCounter
				:title="'+ New Orders'"
				:icon="'fa fa-shopping-cart '"
				:status="'danger'">
				<template #prefix>
					<span class="fa fa-rupee-sign "/>
				</template>	
				<template #formatter>
					<span class="text-success n-o"> {{total.onBuy | round2}}</span>
					<br>
				</template>	
				<template #suffix>
					<span class="text-sm fa fa-rupee-sign"></span>&nbsp;{{(total.onSell*1) | round2}}<br>
					<span class="text-sm font-semibold">Current Sale Value</span>
				</template>	
			</WidgetCounter>
			</a-col>
			<a-col :span="24" :lg="12" :xl="6" class="mb-24" v-if="total">
			<WidgetCounter
				:title="'+ INR Value'"
				:icon="'fa fa-wallet bg-primary'"
				:status="'danger'">
				<template #prefix>
					<span class="fa fa-rupee-sign"/>
				</template>	
				<template #formatter>
					<span class="inr">{{total.netINR | round2}}</span>
					<br>
				</template>	
				

				<template #suffix>
					+ <span class="text-sm fa fa-rupee-sign"/>&nbsp;{{(total.afterSell) | round2}}<br>
					<span class="text-sm font-semibold">After Sale INR</span>
				</template>	
			</WidgetCounter>
			</a-col>
		</a-row>
		<!-- / Counter Widgets -->

		<a-row :gutter="24" type="flex" align="stretch" v-if="selected">
			<calculation-table
				:items="[selected]" 
				:total="$store.getters.total" 
				:account="$store.getters.account">
			</calculation-table>
		</a-row>	
		<!-- Charts -->
		<a-row :gutter="24" type="flex" align="stretch" v-if="selected" style="margin-top: 20px;">
			<a-col :span="24" :lg="14" class="mb-24">
				<Orders
				:selected="selected" :myOrders="orders"
				></Orders>
			</a-col>
			<a-col :span="24" :lg="10" class="mb-24">
				<History
  					:selected="selected" :myTrades="$store.getters.trades"></History>
			</a-col>
		</a-row>
		<!-- / Charts -->

		<a-row :gutter="24" type="flex" align="stretch" v-if="selected">
			<a-col :span="24" :lg="24" class="mb-24">
				<CardCandleChart></CardCandleChart>
			</a-col>
			<a-col :span="24" :lg="24" class="mb-24">
<!-- 				<CardCompareChart></CardCompareChart> -->	
		</a-col>
		</a-row>

		<a-row :gutter="24" type="flex" align="stretch" v-if="selected">

		</a-row>

		<!-- Charts -->
		<a-row :gutter="24" type="flex" align="stretch">
			<a-col :span="24" :lg="24" class="mb-24">
				<!-- Active Users Card -->
	        <OneView
				:items="$store.getters.sortedWallets" :total="$store.getters.total" :account="$store.getters.account"
			></OneView>
				<!-- Active Users Card -->
			</a-col>
		</a-row>
		<!-- / Charts -->
		<a-row :gutter="24" type="flex" align="stretch">
			<calculation-table
				:items="$store.getters.sortedWallets" 
				:total="$store.getters.total" 
				:account="$store.getters.account">
		    </calculation-table>
		</a-row>
		


	</div>
</template>

<script>


	// Line chart for "Sales Overview" card.
	import CardCandleChart from './CardCandleChart' ;
	//import CardCompareChart from './CardCompareChart' ;
	
	// Counter Widgets
	import WidgetCounter from '@/@common/muse/components/Widgets/WidgetCounter' ;


	import Orders from '@/trade/Orders' ;
	import History from '@/trade/History' ;
	import OneView from './OneView' ;
	import CalculationTable from './CalculationTable' ;


	// "Projects" table list of columns and their properties.
	const tableColumns = [
		{
			title: 'COMPANIES',
			dataIndex: 'company',
			scopedSlots: { customRender: 'company' },
			width: 300,
		},
		{
			title: 'MEMBERS',
			dataIndex: 'members',
			scopedSlots: { customRender: 'members' },
		},
		{
			title: 'BUDGET',
			dataIndex: 'budget',
			class: 'font-bold text-muted text-sm',
		},
		{
			title: 'COMPLETION',
			scopedSlots: { customRender: 'completion' },
			dataIndex: 'completion',
		},
	];

	// "Projects" table list of rows and their properties.
	const tableData = [
		{
			key: '1',
			company: {
				name: 'Soft UI Shopify Version',
				logo: 'images/logos/logo-shopify.svg',
			},
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			budget: '$14,000',
			completion: 60,
		},
		{
			key: '2',
			company: {
				name: 'Progress Track',
				logo: 'images/logos/logo-atlassian.svg',
			},
			members: [ "images/face-4.jpg", "images/face-3.jpg", ],
			budget: '$3,000',
			completion: 10,
		},
		{
			key: '3',
			company: {
				name: 'Fix Platform Errors',
				logo: 'images/logos/logo-slack.svg',
			},
			members: [ "images/face-1.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			budget: 'Not Set',
			completion: {
				label: '100',
				status: 'success',
				value: 100,
			},
		},
		{
			key: '4',
			company: {
				name: 'Launch new Mobile App',
				logo: 'images/logos/logo-spotify.svg',
			},
			members: [ "images/face-1.jpg", "images/face-2.jpg", ],
			budget: '$20,600',
			completion: {
				label: '100',
				status: 'success',
				value: 100,
			},
		},
		{
			key: '5',
			company: {
				name: 'Add the New Landing Page',
				logo: 'images/logos/logo-jira.svg',
			},
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg", ],
			budget: '$4,000',
			completion: 80,
		},
		{
			key: '6',
			company: {
				name: 'Redesign Online Store',
				logo: 'images/logos/logo-invision.svg',
			},
			members: [ "images/face-1.jpg", "images/face-4.jpg", "images/face-3.jpg", ],
			budget: '$2,000',
			completion: {
				label: 'Cancelled',
				status: 'exception',
				value: 100,
			},
		},
	];

	export default ({
		components: {
	
			CardCandleChart,
			WidgetCounter,

			Orders,History,OneView,
			//CardCompareChart,
			CalculationTable
		},
		data() {
			return {
				// Associating table data with its corresponding property.
				tableData,
				// Associating table columns with its corresponding property.
				tableColumns,
			}
		},
		computed : {
			selected(){
				return this.$store.getters.selected;
			},
			total(){
				return this.$store.getters.total;
			},
			orders(){
				return this.$store.getters.orders;
			}
		}
	})

</script>

<style >

	.fa-equals{
		background-color: #da7e1a!important;
		
	}


	.fa-coins{
		background-color:#39bed5!important ;
	}

	.fa-wallet{
		background-color:#996c44!important;
	}

	.fa-shopping-cart{
		background-color: #02a66f!important;
	}
    

    .n-o{
    	color: #02a66f!important;
    }
	.t-w{
		color: #da7e1a!important;
	}

	.c-w{
		color: #39bed5!important;
	}
    
    .inr{
    	color: #996c44!important;
    }

</style>