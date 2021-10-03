<template>
	<div>
		<router-view />
	</div>
</template>

<script>

import Vue from 'vue'
//import DemoGrid from './components/DemoGrid';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import "@/assets/style.css";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

console.log("OLD LAOYOIYT")
	export default ({
		components: {
		},
		data() {
			return {
			}
		},
		computed: {

		},
	})

</script>