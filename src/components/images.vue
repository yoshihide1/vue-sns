<template>
  <div id="images">
    <input type="file" accept=”image/*” @change="selectImage" value="画像追加" />
    <button
      @click="upLoad"
    >画像追加</button>
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
    };
  },
  methods: {
    selectImage(e) {
      e.preventDefault();
      this.image = e.target.files[0];
    },
    upLoad() {
      const storageRef = this.storage.ref().child(`images/${this.image.name}`);
      storageRef
        .put(this.image)
        .then(() => {
          storageRef.getDownloadURL().then((url) => {
            console.log(url);
            this.urlSave(url);
          });
          this.image = "";
          console.log("完了");
        })
        .catch(() => {
          alert("失敗しました");
        });
    },
    urlSave(imageUrl) {
      const uid = this.auth.currentUser.uid;
      this.db
        .collection("images")
        .add({
          uid: uid,
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