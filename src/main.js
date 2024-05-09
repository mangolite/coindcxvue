
import './preloader';
import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import store from './service/store';
import VTooltip from 'v-tooltip'

import DefaultLayout from '@/@common/muse/layouts/Default.vue'
import DashboardLayout from '@/trade2/DashboardLayout.vue'
import DashboardRTLLayout from '@/@common/muse/layouts/DashboardRTL.vue'

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

import router from './router';

import '@/@common/muse/scss/app.scss';

Vue.use(VueLoading);
Vue.use(ToastPlugin);
Vue.use(Antd);
Vue.use(VTooltip);
VTooltip.options.defaultClass = 'my-tooltip';
VTooltip.options.defaultTemplate =
  '<div class="foo" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

Vue.config.productionTip = false

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);
Vue.component("vue-loading",VueLoading);

new Vue({
  render: h => h(App),
  router : router,
  store
}).$mount('#app')
