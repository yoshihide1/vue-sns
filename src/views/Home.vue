<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Images />
  </div>
</template>

<script lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import Images from "@/components/images.vue";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    HelloWorld,
    Images,
  },
})
export default class Home extends Vue {}
</script>
