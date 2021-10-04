<template>

	<!-- Active Users Card -->
	<a-card :bordered="false" class="dashboard-bar-chart">
		<chart-bar :height="220" :data="barChartData"></chart-bar>
		<div class="card-title">
			<h6>Active Users</h6>
			<p>than last week <span class="text-success">+23%</span></p>
		</div>
		<div class="card-content">
			<p>We have created multiple options for you to put together and customise into pixel perfect pages.</p>
		</div>
		<a-row class="card-footer" type="flex" justify="center" align="top">
			<a-col :span="6">
				<h4>3,6K</h4>
				<span>Users</span>
			</a-col>
			<a-col :span="6">
				<h4>2m</h4>
				<span>Clicks</span>
			</a-col>
			<a-col :span="6">
				<h4>$772</h4>
				<span>Sales</span>
			</a-col>
			<a-col :span="6">
				<h4>82</h4>
				<span>Items</span>
			</a-col>
		</a-row>
	</a-card>
	<!-- Active Users Card -->

</template>

<script>

	// Bar chart for "Active Users" card.
	import ChartBar from '@/@common/muse/components/Charts/ChartBar' ;

	export default ({
		components: {
			ChartBar,
		},
		computed : {
			barChartData(){
				return  {
					labels: this.$store.getters.wallets.map(function(wallet){
						return wallet.symbol;
					}),
					datasets: [{
						label: "Rise",
						backgroundColor: '#fff',
						borderWidth: 0,
						borderSkipped: false,
						borderRadius: 6,
						data: this.$store.getters.wallets.map(function(wallet){
							if(!wallet.range) return 0;
							return (wallet.range.yHigh - wallet.range.yLow) / wallet.range.yLow * 100
						}),
						maxBarThickness: 10,
					}],
				};
			}
		},
	})

</script>