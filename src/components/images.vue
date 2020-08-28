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

<script>
import firebase from "../plugins/firebase";

export default {
  name: "images",
  data() {
    return {
      storage: firebase.storage(),
      db: firebase.firestore(),
      auth: firebase.auth(),
      image: "",
      comment: "",
    };
  },
  methods: {
    selectImage(e) {
      e.preventDefault();
      this.image = e.target.files[0];
    },
    upLoad() {
      const button = document.getElementById("postButton");
      if (!this.image && !this.comment) {
        alert("コメントを入力するか画像を選択してください");
        return;
      }
      button.disabled = true;
      const storageRef = this.storage.ref().child(`images/${this.image.name}`);
      storageRef
        .put(this.image)
        .then(() => {
          storageRef.getDownloadURL().then((url) => {
            console.log(url);
            this.urlSave(url);
          });
          this.image = "";
          this.comment = "";
          button.disabled = false;
          console.log("完了");
        })
        .catch(() => {
          button.disabled = false;
          alert("失敗しました");
        });
    },
    urlSave(imageUrl) {
      const user = this.auth.currentUser;
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
    },
  },
};
</script>

<style>
</style>