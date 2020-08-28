<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Images />

  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Images from "@/components/images.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
    Images
  },
};
</script>
