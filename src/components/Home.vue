<template>
  <div class="hello">
    
    hellow this is home

    <div @click="onDivClicked">
      Click Me Alert
    </div>

    <router-link to="/blog">Go to Blog</router-link>
  
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
  },
  data: () => ({
  }),
  computed: {
  },
  filters: {
  },
  created : function () {
  },
  methods: {
    onDivClicked : function(){
      alert("This is alert")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
