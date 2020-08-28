<template>
  <div id="signIn">
    <p>
      DisplayName
      <input v-model="displayName" type="text" placeholder="半角英数字のみ" />
    </p>
    <p>
      Email
      <input v-model="email" type="text" placeholder="メールアドレス"/>
    </p>
    <p>
      Password
      <input v-model="password" type="password" placeholder="パスワード" />
    </p>
    <button @click="signUp">登録</button>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";
import { firestore } from "firebase";
export default {
  data() {
    return {
      displayName: "",
      email: "",
      password: "",
    };
  },
  methods: {
    signUp() {
      const db = firebase.firestore();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          console.log(result);
          const userData = firebase.auth().currentUser;
          userData
            .updateProfile({
              displayName: this.displayName,
            })
            .then(() => {
              console.log(userData);
              db.collection("users").add({
                displayName: userData.displayName,
                email: userData.email,
                uid: userData.uid,
              });
              this.$router.push("/");
            });
        })
        .catch((error) => {
          alert("正しく入力してください");
          console.log(error.message);
        });
    },
  },
};
</script>

<style>
</style>