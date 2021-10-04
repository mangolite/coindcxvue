<template>
	
	<!-- Main Sidebar -->
	<a-layout-sider
		collapsible
		class="sider-primary"
		breakpoint="lg"
		collapsed-width="0"
		width="250px"
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
					<router-link :to="`/trade2/${$store.getters.account}/${wallet.symbol}`" class="router-anchor">
						<span class="icon icon-sm" hidden>
							<span class="fa fa-refresh text-sm text-info"></span>&nbsp;
							<span class="text-sm text-secondary">%</span>
							<span class="float-end">
								{{(wallet.ticker.high-wallet.ticker.low)/wallet.ticker.high*100 | round}}
							</span>
						</span>
	
						<span class="label bold">{{wallet.symbol}}</span>

						<span class="label float-end">
							 <span class="label float-start fw-bold"
							 	:class="{
									 'text-success' : wallet.ticker.change_24_hour>0,
									 'text-danger' : wallet.ticker.change_24_hour<0
								 }">
								{{wallet.ticker | change_percent}}<small class="text-sm">%</small>
							 </span>&nbsp;&nbsp;&nbsp;
							<span class=" float-end" style="min-width:40px;display:inline-block">
								<span class="fa fa-arrows-alt-v text-sm text-info"></span>
								<span class="text-pink fw-bold" >
									{{(wallet.ticker.high-wallet.ticker.low)/wallet.ticker.high*100 | round}}
								</span>
								<span class="text-sm text-secondary">%</span>
							</span>
						</span>
					</router-link>
				</a-menu-item>
			</a-menu>
			<!-- / Sidebar Navigation Menu -->

			<!-- Sidebar Footer -->
			<div class="aside-footer">
				<div class="footer-box">
					<span class="icon">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill="#111827"/>
							<path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill="#111827"/>
							<path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill="#111827"/>
						</svg>
					</span>
					<h6>Need Help?</h6>
					<p>Please check our docs</p>
					<a-button type="primary" href="https://demos.creative-tim.com/muse-vue-ant-design-dashboard/documentation" block target="_blank">
						DOCUMENTATION
					</a-button>
				</div>
			</div>
			<!-- / Sidebar Footer -->

			<a-button type="primary" href="https://www.creative-tim.com/product/muse-vue-ant-design-dashboard-pro" block target="_blank">
				UPGRADE TO PRO
			</a-button>

	</a-layout-sider>
	<!-- / Main Sidebar -->

</template>

<script>

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
				return this.$store.getters.wallets
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
</style>
