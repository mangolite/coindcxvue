
import './preloader';
import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import store from './service/store';
import VTooltip from 'v-tooltip'

import OldLayout from '@/trade/OldLayout.vue'
import DefaultLayout from '@/@common/muse/layouts/Default.vue'
import DashboardLayout from '@/trade2/DashboardLayout.vue'
import DashboardRTLLayout from '@/@common/muse/layouts/DashboardRTL.vue'

import router from './router';

import '@/@common/muse/scss/app.scss';

Vue.use(Antd);
Vue.use(VTooltip);
VTooltip.options.defaultClass = 'my-tooltip';
VTooltip.options.defaultTemplate =
  '<div class="foo" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';

Vue.config.productionTip = false

// Adding template layouts to the vue components.
Vue.component("layout-old", OldLayout);
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);

new Vue({
  render: h => h(App),
  router : router,
  store
}).$mount('#app')
