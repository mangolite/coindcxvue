<template>
	<div :id="options.needleValue"> 
		<div class="mb-2" >
			<div style="position:absolute;width:100%;height:20px;font-size:8px;z-index:1000">
				<div v-for="(ar,index ) in arc" v-bind:key="index"
					v-tooltip=" '₹ ' + ar.text" :title="ar.text"
					:style="{
						zIndex : 100-ar.value,
						backgroundColor : ar.color,
						position : 'absolute', float : 'left',
						left : '0px',
						width : Math.max(ar.value,5*(index+1))*0.98 + '%'
					}"
				>&nbsp;</div>
				<div :style="{
						zIndex : 100,
						backgroundColor : '#000',
						position : 'absolute', float : 'left',
						left : options.needleValue  + '%',
						width : '5px', height : '22px',
						margin : '-5px 0px -5px 0px'
					}"
				>&nbsp;</div>
			</div>
		</div>	
	</div>
</template>

<script>
	import formatter from '../formatter.js';
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
				let t100 = (100/total.onsale_amount_total);
				let tnow = num(total.netWorth);
				let t0 = Math.max(num(total.netINR),1);
				let buy_rate_stock_amount = t0 + num(total.buy_rate_stock_amount);
				let buy_rate_avg_amount = t0 + num(total.buy_rate_avg_amount);
				let onsale_amount_total = t0 + num(total.onsale_amount_total);

				let colors = ['#660e0e','#d72020','#95541c','#95911c','#29951c', '#0d4a14'];
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
				},{
					value : round(total.onsale_amount_total*t100), text : round(total.onsale_amount_total), color : '#0d4a14'
				}].sort(function(a,b){
					return a.value- b.value;
				}).map(function(a,i){
					a.color = colors[i];
					a.text = formatter.round2(a.text);
					return a;
				});

				this.options = {
					needleValue : tnow*t100,
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