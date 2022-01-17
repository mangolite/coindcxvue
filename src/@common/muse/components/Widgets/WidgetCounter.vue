<template>
	<a-card :bordered="false" class="widget-1">
		<a-statistic v-if="!loading"
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
		<template #suffix  >
			<slot name="suffix" >
				{{suffix}}
			</slot>	
		</template>	
		<template #formatter="{value}"  >
			<slot name="formatter">
				{{value}}
			</slot>	
		</template>	
		</a-statistic>
      	<vue-loading :active.sync="loading" 
        	:can-cancel="false"  
        	:loader="'dots'"
        	:is-full-page="false"></vue-loading>		
        <div v-if="icon" :class="['icon',icon]"></div>
	</a-card>

</template>

<script>

	import formatter from '@/service/formatter';

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
			loading: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				factor : 1
			}
		},
		computed :{
			formattedValue(){
				return formatter.round2(this.value);
			}
		}
	})

</script>
<style >
	.widget-1 .ant-card-body {
		padding: 12px;
	}
	.widget-1 .icon {
     width: 35px;
    height: 35px;
    margin: 0px; 
    color: white;
    right: 0px; 

	}
	.widget-1 .ant-statistic-content-suffix {
		margin : 5px;
		font-weight: 800;
	  

	}
	.widget-1 .ant-statistic-content-suffix {
		color: #8C8C8C!important;
	}

	.widget-1 .ant-statistic {
    	margin-right: 0px;
     }

     .widget-1 .ant-statistic-content{

     	line-height: 20px;
     }
    .widget-1 .ant-statistic-content-prefix {
		font-size: 15px;
	}

    .widget-1 .ant-statistic-content-value {
		margin : 3px;
		padding: 0px;
		font-weight: 800;
	   
      font-family: revert;
      font-weight: 700;
      text-shadow: 1px 1px 2px #505050;
      font-size: 35px;

	}

	.widget-1,.vld-overlay {
		min-height: 138px;
		border-radius: 10px;
	}
     
</style>