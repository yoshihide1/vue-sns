<template>
  <div id="user">
    <div class="my__post__list" v-for="(post, index) in myPost" :key="index">
      <p>
        <button>削除(仮)</button>
      </p>
      <img :src="post.data.imageUrl" alt />
      <p>コメント: {{post.data.comment}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "../../plugins/firebase";
import { Component, Vue } from "vue-property-decorator";
import { PostList, CommentList } from "../../store/types";
import { vuexStore } from "../../store/index";
@Component({})
export default class MyPage extends Vue {
  myPost: PostList[] = [];

  mounted() {
    console.log("mounted");
    this.fetchMyPost();
  }

  fetchMyPost() {
    const userUid = firebase.auth().currentUser!.uid;
    vuexStore.loadMyPost(userUid);
    this.myPost = vuexStore._myPostList;
  }
}
</script>

<style lang="scss">
.my__post__list {
  img {
    width: 95%;
  }
  p {
  }
}
</style>