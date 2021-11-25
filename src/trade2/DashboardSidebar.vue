<template>
	
	<!-- Main Sidebar -->
	<a-layout-sider
		collapsible
		class="sider-primary"
		breakpoint="lg"
		collapsed-width="0"
		width="300px"
		:collapsed="sidebarCollapsed"
		@collapse="$emit('toggleSidebar', ! sidebarCollapsed)"
		:trigger="null"
		:class="['ant-layout-sider-' + sidebarColor, 'ant-layout-sider-' + sidebarTheme]"
		theme="light"
		:style="{ backgroundColor: 'transparent',}">
			<div class="brand" hidden><img src="images/logo-ct-black.png" alt=""> <span>{{walletCount}}</span></div>
			<hr hidden>
			<!-- Sidebar Navigation Menu -->
			<a-menu theme="light" mode="inline">
				<a-menu-item v-for="wallet in wallets" :key="wallet.symbol">
					<router-link :to="`/trade2/${$store.getters.account}/${wallet.symbol}`" class="router-anchor"
						:v-tooltip="wallet.ticker.last_price"
						:title="wallet.last_price_seen">
						<span class="icon icon-sm" hidden>
							<span class="fa fa-refresh text-sm text-info"></span>&nbsp;
							<span class="text-sm text-secondary">%</span>
							<span class="float-end">
								{{(wallet.ticker.high-wallet.ticker.low)/wallet.ticker.high*100 | round}}
							</span>
						</span>
	
						<span class="label coin-n text-white fw-bold">{{wallet.symbol}}</span>

						<span class="label float-end">
							 <span class="label float-start fw-bold" :data-change="wallet.ticker.change_24_hour"
							 	:class="{
									 'text-success buy ' : wallet.ticker.change_24_hour>0,
									 'text-danger sell ' : wallet.ticker.change_24_hour<0
								 }">
								{{wallet.ticker | change_percent}}<small class="text-sm">%</small>
							 </span>&nbsp;&nbsp;&nbsp;
							<span class=" float-end" style="min-width:40px;display:inline-block">
								<span class="fa fa-arrows-alt-v  text-sm text-info"></span>
								<span class="d-d fw-bold" >
									{{wallet.volatlity*100 | round}}
								</span>
								<span class="text-sm text-secondary">%</span>
							</span>
						</span>
						<span class="next-line">
							<span class="text-white text-xs">{{wallet.ticker.last_price}}</span>&nbsp;
							<span class="text-xs"
								:class="{
									'text-success fa fa-sort-up' : wallet.seen_delta>0,
									'text-danger fa fa-sort-down' : wallet.seen_delta<0,
									'hidden' : wallet.seen_delta == 0
								}"
							>&nbsp; {{wallet.seen_delta | abs | round5}}</span>
						</span>
						
					</router-link>
				</a-menu-item>
			</a-menu>
			<!-- / Sidebar Navigation Menu -->

			

	</a-layout-sider>
	<!-- / Main Sidebar -->

</template>

<script>

	import formatter from "../formatter.js";

	export default ({
		props: {
			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},
			
			// Main sidebar color.
			sidebarColor: {
				type: String,
				default: "primary",
			},
			
			// Main sidebar theme : light, white, dark.
			sidebarTheme: {
				type: String,
				default: "light",
			},
		},
		data() {
			return {
				// sidebarCollapsedModel: this.sidebarCollapsed,
			}
		},
		created(){
		},
		computed : {
			wallets(){
				let THAT = this;
				return this.$store.getters.wallets.map(function(wallet){
					let last_price_seen = parseFloat(THAT.$store.getters.local[wallet.symbol]);
					return {
						...wallet,
						volatlity : (wallet.ticker.high-wallet.ticker.low)/wallet.ticker.high,
						last_price_seen : last_price_seen,
						seen_delta : 100 * (
							parseFloat(wallet?.ticker?.last_price || 0) - last_price_seen
						) / last_price_seen
					};
				}).sort(function(wa,wb){
					return wb.volatlity - wa.volatlity;
				});
			},
			walletCount(){
				return this.$store.getters.wallets.length;
			}
		}
	})

</script>
<style scoped>
	.router-link-active .icon {
		color: white;
	}
	.router-anchor{
		text-decoration : unset !important;
	}
	.icon.icon-sm {
		width: 36px!important;
		height: 24px!important;
		text-decoration : unset !important;
	}
	.icon.icon-sm span  {
		text-decoration : unset !important;
		text-decoration-style: dotted !important;
		text-decoration-color: red !important;
		text-decoration-thickness: auto !important;
	}

   @media (min-width: 992px) {

  .layout-dashboard .ant-layout-sider.sider-primary {
    margin: 0 0 0 0;
    padding: 13px 20px;
    height: calc(100vh - 20px);
    background: transparent !important;
  }
}



   .d-d{
   	color: orange;
   }
   
      .router-link-active:visited .coin-n{
      	
      	color: black!important;
      }

      .

      .router-link-active:visited .label .buy{
      color: #1dc38b!important;
      
     
      }

      .router-link-active:visited .label .sell{
      color: #f45b5b!important;
          

    }


    .router-link-active:visited  .d-d{
      color: #da7e1a!important;
      

    }

      .fw-bold{
      	font-weight: 700!important;
      }

      .layout-dashboard .ant-layout-sider.sider-primary .ant-menu-item.ant-menu-item-selected .router-link-active, .layout-dashboard .ant-layout-sider.sider-primary .ant-menu-item .router-link-active, .layout-dashboard .ant-layout-sider.sider-primary .ant-menu-submenu.ant-menu-item-selected .router-link-active, .layout-dashboard .ant-layout-sider.sider-primary .ant-menu-submenu .router-link-active {
    background-color: #FFFFFF;
    box-shadow: 0px 20px 27px rgb(0 0 0 / 5%);
    font-size: 18px;
    border-radius: 25px;
  }
	.layout-dashboard .ant-layout-sider.sider-primary .ant-menu-item.ant-menu-item-selected .router-link-active .text-white, 
	.layout-dashboard .ant-layout-sider.sider-primary .ant-menu-item .router-link-active .text-white, 
	.layout-dashboard .ant-layout-sider.sider-primary .ant-menu-submenu.ant-menu-item-selected .router-link-active .text-white,
	.layout-dashboard .ant-layout-sider.sider-primary .ant-menu-submenu .router-link-active .text-white{
			color: #000!important;
	}

      
	
</style>
