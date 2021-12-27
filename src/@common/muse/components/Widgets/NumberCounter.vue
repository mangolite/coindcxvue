<template>
	<span>
		<slot name="number" v-bind:number="currentNumber">
			{{currentNumber}}
		</slot>	
	</span>
</template>

<script>
	export default ({
		props: {
			value: {
				default: 0,
			}
		},
		data() {
			return {
				factor : 1,
				gap : 0,
			}
		},
		mounted : function(){
			let THAT =  this;
			setInterval(function(){
				THAT.factor = Math.sqrt(THAT.factor);
			},500);
		},
		watch : {
			'value' :  function(newVal,oldVal){
				this.gap = newVal - oldVal;
				this.factor = oldVal/newVal;
			}
		},
		computed :{
			currentNumber(){
				return this.value * this.factor;
			}
		}
	})

</script>