<template>
	<div :id="options.needleValue"> 
		<div class="mb-2" >
			<div style="position:absolute;width:100%;height:20px;font-size:8px">
				<div v-for="(ar,index ) in arc" v-bind:key="index"
					:style="{
						zIndex : 100-ar.value,
						backgroundColor : ar.color,
						position : 'absolute', float : 'left',
						left : '0px',
						width : ar.value + '%'
					}"
				>&nbsp;</div>
				<div :style="{
						zIndex : 100,
						backgroundColor : '#000',
						position : 'absolute', float : 'left',
						left : options.needleValue  + 'px',
						width : '5px', height : '22px',
						margin : '-5px 0px -5px 0px'
					}"
				>&nbsp;</div>
			</div>
		</div>	
	</div>
</template>

<script>
	let counter = 0;
	function num(str){
		if(isNaN(str) || !str){
			return 0;
		} return parseFloat(str);
	}
	function round(val){
		return Math.round(num(val))
	}
	export default ({
		components: {
		},
		data() {
			return {
				id : 'gauge-c-' + (++counter),
				arc : [],
				options : {
					needleValue : 50,
					arcDelimiters  : [
					 	1
					], 
					centralLabel : "A",
					//rangeLabel : ['0',  '1' + 100],
					hasNeedle : true
				}
			}
		},
		computed : {
			total(){
				return this.$store.getters.total;
			}
		},
		watch : {
			'$store.getters.total' : function(total){
				let t100 = (100/total.afterSellWorth);
				let tnow = num(total.netWorth);
				let t0 = Math.max(num(total.netINR),1);
				let buy_rate_stock_amount = t0 + num(total.buy_rate_stock_amount);
				let buy_rate_avg_amount = t0 + num(total.buy_rate_avg_amount);
				let colors = ['#660e0e','#d72020','#95541c','#95911c','#29951c'];
				this.arc = [{
					value : round(t0*t100), text : round(t0), color : '#660e0e'
				},{
					value : round(buy_rate_stock_amount*t100), text : round(buy_rate_stock_amount), color : '#d72020'
				},{
					value : round(buy_rate_avg_amount*t100), text : round(buy_rate_avg_amount), color : '#95541c'
				},{
					value : round(buy_rate_avg_amount*t100), text : round(buy_rate_avg_amount), color : '#95911c'
				},{
					value : round(total.afterSellWorth*t100), text : round(total.afterSellWorth), color : '#29951c'
				}].sort(function(a,b){
					return a.value- b.value;
				}).map(function(a,i){
					a.color = colors[i];
					return a;
				});

				this.options = {
					needleValue : tnow*t100,
					arcColors : this.arc.map(function(a){
						return a.color;
					}),
					arcLabels: this.arc.map(function(a){
						return a.text;
					}),
					arcDelimiters  :  this.arc.map(function(a){
						return Math.min(Math.max(a.value,1),99);
					}),
					centralLabel : " " + round(tnow),
					//rangeLabel : ['0',  ' ' + 100],
					hasNeedle : true
				};
				this.drawGauge();
			}
		},
		mounted() {
			this.drawGauge();
		},
		methods : {
			drawGauge(){
			}
		}
	})

</script>