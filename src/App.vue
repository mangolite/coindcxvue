<template>
  <div id="app"> 
		<component :is="layout">
			<router-view />
		</component>
  </div>
</template>

<script>

export default {
  name: 'App',
	computed: {
			// Sets components name based on current route's specified layout, defaults to
			// <layout-default></layout-default> component.
		layout() {
			return "layout-" + ( this.$route.meta.layout || "default" ).toLowerCase() ;
		}
	},
  components: {
    //DemoGrid
  },
  mounted : function () {
    console.log("this.$route.meta.layout",this.$route.meta.layout);
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'https://kit.fontawesome.com/924f16f871.js')
    document.head.appendChild(recaptchaScript);
  },
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
