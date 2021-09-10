
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
          name : "demo",
          component: () => import('./components/DemoGrid.vue'),
        },
        {
          path: '/home',
          name : "home",
          component: () => import('./components/Home.vue'),
        },
        {
          path: '/blog',
          name : "blog",
          component: () => import('./components/Blog.vue'),
        }
    ]
});