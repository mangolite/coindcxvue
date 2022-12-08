<template>

	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<template #title>
			<h6>{{$store.getters.symbol}}</h6>			
			<p>last 365 days</p>	
			<b-form-group v-slot="{ ariaDescribedby }" class="text-center text-xs">
				<b-form-radio-group class="text-xs"
				id="btn-radios-1" size="xs"
				v-model="timewindow"
				:options="options"
				:aria-describedby="ariaDescribedby"
				name="radios-btn-default"
				buttons
				></b-form-radio-group>
			</b-form-group>	
		</template>
		<template #extra>
			<a-badge color="primary" class="badge-dot-primary" text="Traffic" />
			<a-badge color="primary" class="badge-dot-secondary" text="Sales" />
		</template>
		<apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
	</a-card>

</template>

<script>

	// Bar chart for "Active Users" card.
	import ApexCharts from 'apexcharts'

	export default ({
		components: {
		},
		data() {
			return {
				chartOptions: {
					chart: {
					type: 'line',
					height: 350
					},
					title: {
					text: 'Compare Chart',
					align: 'left'
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
					type: 'datetime'
					},
					yaxis: {
						opposite: true,
						show : false,
						tooltip: {
							enabled: false
						}
					},
					legend: {
						position: 'left'
					}
				},
		  		timewindow : 1000*60*60*24*7*5,
				options: [
					{ text: '1D', value: 1000*60*60*24, lower : Date.now()-1000*60*60*24*7},
					{ text: '1Wk', value: 1000*60*60*24*7,lower : Date.now()-1000*60*60*24*30 },
					{ text: '5Wks', value: 1000*60*60*24*7*5, lower : Date.now()-1000*60*60*24*30*10 },
					{ text: '3Mo', value: 1000*60*60*24*90, lower : Date.now()-1000*60*60*24*30*10 },
					{ text: '1Yr', value: 1000*60*60*24*365, lower : Date.now()-1000*60*60*24*30*10 },
					{ text: 'All', value: 0 },
				]
			}
		},
		computed : {
			series(){
				let gap = this.timewindow;
				let endStamp = Date.now();
				let start = endStamp- (gap ? gap : endStamp);
				let all = this.$store.getters.candles_all;
				return Object.keys(this.$store.getters.candles_all).map(function(key){
					return {
						symbol : key, candles : all[key]
					};
				}).map(function(Dcandles,i){
					let factor = 1000/Dcandles.candles[0].high;
					return {
						name : Dcandles.symbol,
						data : (Dcandles.candles || []).filter(function(item){
							return (item.time>start)
						}).map(function(item) {
							return {
								x : new Date(item.time),
								y : (item.high-0+item.low)/2*factor
							}
						})
					};
				});
			},
			candles(){
				return this.$store.getters.candles;
			}
		}
	})

</script>