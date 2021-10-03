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
		<apexchart type="candlestick" height="350" :options="chartOptions" :series="series"></apexchart>
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
              type: 'candlestick',
              height: 350
            },
            title: {
              text: 'CandleStick Chart',
              align: 'left'
            },
            xaxis: {
              type: 'datetime'
            },
            yaxis: {
              tooltip: {
                enabled: true
              }
            }
          },


			}
		},
		computed : {
			series(){
				return [{
					data: (this.$store.getters.candles || []).map(function(item) {
						return {
							x : new Date(item.time),
							y : [item.open, item.high, item.low, item.close]
						}
					})
				}];
			},
			candles(){
				return this.$store.getters.candles;
			}
		}
	})

</script>