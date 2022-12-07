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
		  timewindow : 0,
        options: [
          { text: 'Day', value: 1000*60*60*24, lower : Date.now()-1000*60*60*24*7},
          { text: 'Week', value: 1000*60*60*24*7,lower : Date.now()-1000*60*60*24*30 },
          { text: 'Month', value: 1000*60*60*24*30, lower : Date.now()-1000*60*60*24*30*10 },
		  { text: 'Month', value: 1000*60*60*24*365, lower : Date.now()-1000*60*60*24*30*10 },
		  { text: 'All', value: 0 },
        ]
			}
		},
		computed : {
			series(){
				let gap = this.timewindow;
				let endStamp = Date.now();
				let start = endStamp- (gap ? gap : endStamp);
				return [{
					data: (this.$store.getters.candles || []).filter(function(item){
						return (item.time>start)
					}).map(function(item) {
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