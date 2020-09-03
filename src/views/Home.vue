<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Post />
  </div>
</template>

<script lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import Post from "@/components/post.vue";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    HelloWorld,
    Post,
  },
})
export default class Home extends Vue {}
</script>
