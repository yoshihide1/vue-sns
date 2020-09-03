<template>
  <div id="post">
    <p>コメント</p>
    <p>
      <textarea v-model="comment" name id cols="30" rows="10"></textarea>
    </p>
    <p><input type="file" accept=”image/*” @change="selectImage"/></p>
    <p>
      <button :disabled="postButton" @click="saveStorage">投稿</button>
    </p>
    <p>
      <button @click="fetchPost">画像取得</button>
    </p>
    <div class="post__list" v-for="(post, index) in postList" :key="index">
      <img :src="post.data.imageUrl" alt />
      <p>名前:{{ post.data.displayName }}</p>
      <p>コメント:{{ post.data.comment }}</p>

      <Comment :docId="post.id" :commentList="commentList" />

      <p>削除docID:{{post.id}}</p>
      <p>削除FileName:{{ post.data.fileName }}</p>
      <p>削除uid:{{ post.data.uid }}</p>
      <button
        v-if="deleteButtonCheck(post.data.uid)"
        @click="deletePost(post.id, post.data.fileName)"
      >削除</button>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "../plugins/firebase";
import { Component, Vue } from "vue-property-decorator";
import { PostList, CommentList } from "../store/types";
import Comment from "@/components/comment.vue";
@Component({
  components: {
    Comment,
  },
})
export default class Post extends Vue {
  storage = firebase.storage();
  db = firebase.firestore();
  auth = firebase.auth();
  postList: PostList[] = [];
  imageFile: any = "";
  comment = "";
  commentList: CommentList[] = [];
  postButton = false;

  getDate(): string {
    const time = new Date().getTime();
    return String(time);
  }
  selectImage(e: any) {
    e.preventDefault();
    this.imageFile = e.target.files[0];
  }
  async fetchPost() {
    const postList: any = [];
    const mainDoc = await this.db
      .collection("images")
      .orderBy("timeStamp", "desc")
      .limit(5)
      .get();
    mainDoc.forEach((doc) => {
      postList.push({ id: doc.id, data: doc.data() });
    });
    this.postList = postList;
    this.fetchComment();
  }
  async fetchComment() {
    const commentList: any = [];
    const subDoc = await this.db
      .collectionGroup("comment")
      .orderBy("timeStamp", "desc")
      .limit(10)
      .get();
    subDoc.forEach((doc) => {
      commentList.push({ id: doc.id, data: doc.data() });
    });
    this.commentList = commentList;
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
    const user = this.auth.currentUser;
    if (user === null) {
      return;
    }
    const data = {
      displayName: user.displayName!,
      comment: this.comment,
      imageUrl: imageUrl,
      fileName: fileName,
      uid: user.uid,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    this.db
      .collection("images")
      .add(data)
      .then((doc) => {
        console.log(doc);
        const storeImage: PostList = {
          id: doc.id,
          data: data,
        };
        this.postList.unshift(storeImage);
        this.comment = "";
        console.log("store完了");
      })
      .catch(() => {
        alert("失敗しました");
      });
  }
  deleteButtonCheck(docUid: string): boolean {
    const userUid = this.auth.currentUser!.uid;
    if (docUid === userUid) {
      return true;
    } else {
      return false;
    }
  }
  deletePost(docId: string, fileName: string) {
    this.deleteStore(docId);
    this.deleteStoreSubAll(docId);
    this.deleteStorage(fileName);
  }
  deleteStore(docId: string) {
    this.db
      .collection("images")
      .doc(docId)
      .delete()
      .then(() => {
        this.postList = this.removePost(docId)
        console.log("store削除完了");
      });
  }
  removePost(docId: string) {
    return this.postList.filter(post => post.id !== docId)
  }
  deleteStoreSubAll(docId: string) {
    this.db
      .collection("images")
      .doc(docId)
      .collection("comment")
      .get()
      .then((subDoc) => {
        subDoc.forEach((doc) => {
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
#post {
  width: 100%;
}
.post__list {
  background-color: gainsboro;
  padding: 1rem 0 1rem;
  margin: 1rem 0 1rem;
  img {
    width: 100%;
  }
}
</style>