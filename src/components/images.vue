<template>
  <div id="images">
    <p>コメント</p>
    <p>
      <textarea v-model="comment" name id cols="30" rows="10"></textarea>
    </p>
    <p><input type="file" accept=”image/*” @change="selectImage" /></p>
    <p>
      <button id="postButton" @click="upLoad">投稿</button>
    </p>
  </div>
</template>

<script lang="ts">
import firebase from "../plugins/firebase";
import { Component, Vue } from "vue-property-decorator";

export default class Images extends Vue {
  storage = firebase.storage();
  db = firebase.firestore();
  auth = firebase.auth();
  imageFile: any ;
  comment: string | null;

  selectImage(e: any) {
    this.imageFile = e.target.files[0];
  }
  upLoad() {
    const button = <HTMLInputElement>document.getElementById("postButton");
    if (!this.imageFile && !this.comment) {
      alert("コメントを入力するか画像を選択してください");
      return;
    }
    button.disabled = true;
    const storageRef = this.storage
      .ref()
      .child(`images/${this.imageFile.name}`);
    storageRef
      .put(this.imageFile)
      .then(() => {
        storageRef.getDownloadURL().then((url) => {
          this.urlSave(url);
        });
        this.imageFile = "";
        this.comment = "";
        button.disabled = false;
        console.log("完了");
      })
      .catch(() => {
        button.disabled = false;
        alert("失敗しました");
      });
  }
  urlSave(imageUrl: string) {
    const user = this.auth.currentUser;
    if (user === null) {
      return;
    }
    this.db
      .collection("images")
      .add({
        uid: user.uid,
        displayName: user.displayName,
        comment: this.comment,
        imageUrl: imageUrl,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("db完了");
      });
  }
}
</script>

<style>
</style>