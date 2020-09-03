<template>
  <div id="comment">
    <input type="text" v-model="comment" />
    <p>削除{{docId}}</p>
    <button :disabled="resButton" @click="resComment(docId)">コメントする</button>
    <div v-for="(comment, index) in commentList" :key="index">
      <p v-if="docId === comment.data.docId">
        {{comment.data.displayName}}:{{ comment.data.comment}}
        <button
          v-if="deleteButtonCheck(comment.data.uid)"
          @click="deleteComment(docId, comment.id)"
        >コメント削除</button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from "vue-property-decorator";
import firebase from "../plugins/firebase";
import { CommentList } from "../store/types";
@Component
export default class Comment extends Vue {
  @Prop() docId!: string;
  @Prop() commentList!: CommentList[];

  comment = "";
  auth = firebase.auth();
  db = firebase.firestore();
  resButton = true;

  @Watch("comment")
  textCheck() {
    if (this.comment.length > 2) {
      this.resButton = false;
    } else {
      this.resButton = true;
    }
  }

  resComment(docId: string) {
    const comment = this.comment;
    this.comment = "";
    console.log(docId);
    const user = this.auth.currentUser!;
    const data = {
      displayName: user.displayName!,
      comment: comment,
      docId: docId,
      uid: user.uid,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    this.db
      .collection("images")
      .doc(docId)
      .collection("comment")
      .add(data)
      .then((doc) => {
        const pushData = {
          id: doc.id,
          data: data,
        };
        this.commentList.unshift(pushData);
        console.log("comment追加");
      });
  }

  deleteButtonCheck(uid: string): boolean {
    const userUid = this.auth.currentUser!.uid;
    if (uid === userUid) {
      return true;
    } else {
      return false;
    }
  }

  deleteComment(docId: string, subDocId: string) {
    console.log("comment");
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
}
</script>

<style>
</style>