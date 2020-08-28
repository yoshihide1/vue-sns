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
          storageRef.getDownloadURL()
          .then((url) => {
            console.log(url);
          });
          this.image = ""
          console.log("完了");
        })
        .catch(() => {
          alert('失敗しました')
        });
    },
    urlSave(imageUrl) {

    }
  },
};
</script>

<style>
</style>