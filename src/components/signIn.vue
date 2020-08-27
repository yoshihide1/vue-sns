<template>
  <div id="signIn">
    <p>
      Email
      <input v-model="email" type="text" />
    </p>
    <p>
      Password
      <input v-model="password" type="password" />
    </p>
    <button @click="signIn">サインイン</button>
  </div>
</template>

<script>
import firebase from "../plugins/firebase";
import { firestore } from "firebase";

export default {
  name: "signIn",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => {
          alert("一致する登録情報がありません");
        });
    },
  },
};
</script>

<style>
</style>