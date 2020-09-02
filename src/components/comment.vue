<template>
  <div id="comment">
    <input type="text" v-model="comment" />
    <p>削除{{docId}}</p>
    <button :disabled="resButton" @click="resComment(docId)">コメントする</button>
  </div>
</template>

<script lang="ts">
import { Watch, Prop, Component, Vue } from "vue-property-decorator";
import firebase from "../plugins/firebase";
// import { ImageList } from "../store/types";
@Component
export default class Comment extends Vue {
  @Prop() docId!: string;

  comment = "";
  auth = firebase.auth();
  db = firebase.firestore();
  resButton = true;
  test: string | null = "";

  @Watch("comment")
  textCheck() {
    if (this.comment.length > 2) {
      this.resButton = false;
    } else {
      this.resButton = true;
    }
  }

  async resComment(docId: string) {
    const comment = this.comment;
    this.comment = "";
    console.log(docId);
    const user = this.auth.currentUser!;
    this.db
      .collection("images")
      .doc(docId)
      .collection("comment")
      .add({
        displayName: user.displayName,
        comment: comment,
        docId: docId,
        uid: user.uid,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("comment追加");
      });
  }
}
</script>

<style>
</style>