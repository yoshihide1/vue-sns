<template>
  <div id="images">
    <p>コメント</p>
    <p>
      <textarea v-model="comment" name id cols="30" rows="10"></textarea>
    </p>
    <p><input type="file" accept=”image/*” @change="selectImage"/></p>
    <p>
      <button :disabled="postButton" @click="saveStorage">投稿</button>
    </p>
    <p>
      <button @click="downLoad">画像取得</button>
    </p>
    <div class="image__list" v-for="(image, index) in images" :key="index">
      <img :src="image.data.imageUrl" alt />
      <p>名前:{{ image.data.displayName }}</p>
      <p>コメント:{{ image.data.comment }}</p>

      <button @click="test(image.id)">test</button>

      <Comment :docId="image.id" />

      <div v-for="(res, index) in comments" :key="index">
        <p v-if="res.data.docId === image.id">
          {{res.data.displayName}}>{{res.data.comment }}
          <button
            v-if="deleteCheck(res.data.uid)"
            @click="deleteComment(image.id, res.id)"
          >コメント削除</button>
        </p>
      </div>
      <p>削除docID:{{image.id}}</p>
      <p>削除FileName:{{ image.data.fileName }}</p>
      <p>削除uid:{{ image.data.uid }}</p>
      <button
        v-if="deleteCheck(image.data.uid)"
        @click="deletePost(image.id, image.data.fileName)"
      >削除</button>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "../plugins/firebase";
import { Component, Vue } from "vue-property-decorator";
import { ImageList, CommentList } from "../store/types";
import Comment from "@/components/comment.vue";
@Component({
  components: {
    Comment,
  },
})
export default class Images extends Vue {
  storage = firebase.storage();
  db = firebase.firestore();
  auth = firebase.auth();
  images: ImageList[] = [];
  imageFile: any = "";
  comment: string | null = "";
  comments: CommentList[] = [];
  postButton = false;

  getDate(): string {
    const time = new Date().getTime();
    return String(time);
  }
  selectImage(e: any) {
    e.preventDefault();
    this.imageFile = e.target.files[0];
  }
  async downLoad() {
    const imageList: any = [];
    const commentList: any = [];
    const snapshot = await this.db
      .collection("images")
      .orderBy("timeStamp", "desc")
      .limit(5)
      .get();
    snapshot.forEach((doc) => {
      imageList.push({ id: doc.id, data: doc.data() });
    });
    this.images = imageList;
    const subDoc = await this.db.collectionGroup("comment").limit(10).get();
    subDoc.forEach((doc) => {
      commentList.push({ id: doc.id, data: doc.data() });
    });
    this.comments = commentList;
  }
  saveStorage() {
    if (!this.imageFile && !this.comment) {
      alert("コメントを入力するか画像を選択してください");
      return;
    }
    this.postButton = true;
    const time = this.getDate();
    const fileName = time + this.imageFile.name;
    const storageRef = this.storage.ref().child(`images/${fileName}`);
    storageRef
      .put(this.imageFile)
      .then(() => {
        storageRef.getDownloadURL().then((url) => {
          this.saveStore(url, fileName);
        });
        this.imageFile = "";
        this.postButton = false;
        console.log("storage完了");
      })
      .catch(() => {
        this.postButton = false;
        alert("失敗しました");
      });
  }

  saveStore(imageUrl: string, fileName: string) {
    console.log(fileName);
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
        fileName: fileName,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("store完了");
        this.comment = "";
      })
      .catch(() => {
        alert("失敗しました");
      });
  }
  deleteCheck(uid: string): boolean {
    const userUid = this.auth.currentUser!.uid;
    if (uid === userUid) {
      return true;
    } else {
      return false;
    }
  }
  deletePost(docId: string, fileName: string) {
    this.deleteStore(docId);
    this.deleteStoreSub(docId);
    this.deleteStorage(fileName);
  }
  deleteComment(docId: string, subDocId: string) {
    console.log(docId);
    console.log(subDocId);
    this.db
      .collection("images")
      .doc(docId)
      .collection("comment")
      .doc(subDocId)
      .delete()
      .then(() => {
        console.log("コメントの削除完了");
      });
  }
  deleteStore(docId: string) {
    this.db
      .collection("images")
      .doc(docId)
      .delete()
      .then(() => {
        console.log("store削除完了");
        this.downLoad();
      });
  }
  deleteStoreSub(docId: string) {
    this.db
      .collection("images")
      .doc(docId)
      .collection("comment")
      .get()
      .then((subDoc) => {
        subDoc.forEach((doc) => {
          console.log(doc.data());
          this.db
            .collection("images")
            .doc(docId)
            .collection("comment")
            .doc(doc.id)
            .delete()
            .then(() => {
              console.log("subコレクション削除");
            });
        });
      });
  }

  deleteStorage(fileName: string) {
    this.storage
      .ref()
      .child(`images/${fileName}`)
      .delete()
      .then(() => {
        console.log("storage削除完了");
      });
  }
}
</script>

<style lang="scss" scoped>
#images {
  width: 100%;
}
.image__list {
  background-color: gainsboro;
  padding: 1rem 0 1rem;
  margin: 1rem 0 1rem;
  img {
    width: 100%;
  }
}
</style>