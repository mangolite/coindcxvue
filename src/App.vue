<template>
  <div id="app">    
      <demo-grid>
      </demo-grid>
  </div>
</template>

<script>
import Vue from 'vue'
import DemoGrid from './components/DemoGrid';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "./assets/style.css";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

export default {
  name: 'App',
  components: {
    DemoGrid
  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
