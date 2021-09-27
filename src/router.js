
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base : "coindcxvue",
    scrollBehavior : function() {
        return window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    routes: [
        {
          path: '/',
          alias: '/trade',
          redirect : '/trade/1',
          name : "default",
          component: () => import('./components/DemoGrid.vue'),
        },
        {
          path: '/trade/:account',
          name : "OnlyAccount",
          component: () => import('./components/DemoGrid.vue'),
        },
        {
          path: '/trade/:account/:currency/',
          name : "OnlyAccountCurrency",
          component: () => import('./components/DemoGrid.vue'),
        },
        {
          path: '/trade/:account/:currency/:tab',
          name : "OnlyAccountCurrencyView",
          component: () => import('./components/DemoGrid.vue'),
        }
    ]
});