<template>
  <div id="images">
    <p>コメント</p>
    <p>
      <textarea v-model="comment" name id cols="30" rows="10"></textarea>
    </p>
    <p><input type="file" accept=”image/*” @change="selectImage"/></p>
    <p>
      <button :disabled="postButton" @click="upLoad">投稿</button>
    </p>
    <p>
      <button @click="downLoad">画像取得</button>
    </p>
    <div class="image__list" v-for="(image, index) in images" :key="index">
      <img :src="image.imageUrl" alt />
      <p>名前:{{ image.displayName }}</p>
      <p>コメント:{{ image.comment }}</p>
      <p>uid:{{ image.uid }}最終的に削除</p>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "../plugins/firebase";
import { Component, Vue } from "vue-property-decorator";
interface ImageList {
  displayName: string;
  comment?: string;
  imageUrl?: string;
  uid: string;
  timesStamp: {
    nanoseconds: number;
    seconds: number;
  };
}

@Component({})
export default class Images extends Vue {
  storage = firebase.storage();
  db = firebase.firestore();
  auth = firebase.auth();
  images: ImageList[] = [];
  imageFile: any = "";
  comment: string | null = "";
  postButton = false;

  selectImage(e: any) {
    e.preventDefault();
    console.log(e.target.files[0]);
    this.imageFile = e.target.files[0];
  }
  downLoad() {
    const imageList: any = [];
    this.db
      .collection("images")
      .orderBy("timeStamp", "desc")
      .limit(5)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          imageList.push(doc.data());
        });
        console.log(imageList);
        this.images = imageList;
      });
  }
  upLoad() {
    if (!this.imageFile && !this.comment) {
      alert("コメントを入力するか画像を選択してください");
      return;
    }
    this.postButton = true;
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
        this.postButton = false;
        console.log("完了");
      })
      .catch(() => {
        this.postButton = false;
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
        this.comment = "";
      });
  }
}
</script>

<style lang="scss" scoped>
#images {
  width: 100%;
}
.image__list {
  img {
    width: 100%;
  }
}
</style>