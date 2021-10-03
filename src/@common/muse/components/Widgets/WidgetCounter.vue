<template>

	<a-card :bordered="false" class="widget-1">
		<a-statistic
			:value="formattedValue"
			:precision="0"
			:class="'text-' + status"
		>
		<template #title>
			<slot name="title">
				{{title}}
			</slot>	
		</template>	
		<template #prefix>
			<slot name="prefix">
				{{prefix}}
			</slot>	
		</template>	
		<template #suffix>
			<slot name="suffix">
				{{suffix}}
			</slot>	
		</template>	
		<template #formatter="{value}">
			<slot name="formatter">
				{{value}}
			</slot>	
		</template>	
		</a-statistic>
		<div v-if="icon" :class="['icon',icon]"></div>
	</a-card>

</template>

<script>

	import formatter from '@/formatter';

	export default ({
		props: {
			title: {
				type: String,
				default: "",
			},
			value: {
				type: Number,
				default: 0,
			},
			prefix: {
				type: String,
				default: "",
			},
			suffix: {
				type: String,
				default: "",
			},
			icon: {
				type: String,
				default: "",
			},
			status: {
				type: String,
				default: "success",
			},
		},
		data() {
			return {
			}
		},
		computed :{
			formattedValue(){
				return formatter.round2(this.value);
			}
		}
	})

</script>
<style scoped>
	.icon {
		color: white;
	}
</style>