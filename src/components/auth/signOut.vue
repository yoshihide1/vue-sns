<template>
  <div id="signOut">
    <button @click="signOut">(仮)サインアウト</button>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase.ts";
export default {
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert("サインアウトしました");
          this.$router.push("/signIn");
        });
    },
  },
};
</script>

<style>
</style>