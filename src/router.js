
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
          redirect : '/trade2/1',
          name : "default"
        },
        {
          path: '/trade2',
          redirect : '/trade2/1',
        },
        {
            path : '/trade2/:account',
            name: 'Dashboard',
            meta : { layout: "dashboard" },
            component: () => import(/* webpackChunkName: "dashboard" */ './trade2/Dashboard.vue'),
        },
        {
          path : '/trade2/:account/:symbol',
          name: 'Dashboard',
          meta : { layout: "dashboard" },
          component: () => import(/* webpackChunkName: "dashboard" */ './trade2/Dashboard.vue'),
      },
    ]
});