<template>

	<a-card :bordered="false" class="dashboard-bar-line header-solid">
		<template #title>
			<h6>{{$store.getters.symbol}}</h6>			
			<p>last 365 days</p>	
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
				//opposite: false,
              	tooltip: {
               		enabled: true
              	}
            }
          },


			}
		},
		computed : {
			series(){
				return this.$store.getters.candles_all.map(function(candles,i){
					let factor = 1000/candles[0].high;
					return {
						name : "line" + i,
						data : (candles || []).map(function(item) {
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