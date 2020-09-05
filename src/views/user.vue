<template>
  <div class="users">
    <p>User: {{$route.params.id}}
    </p>
  <MyPage />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vuexStore } from "../store/index";
import MyPage from "@/components/users/myPage.vue"
@Component({
  components: {
    MyPage
  }
})
export default class User extends Vue {
}
</script>

<style>

</style>
