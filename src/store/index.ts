import { Mutation, MutationAction, Action, VuexModule, getModule, Module } from "vuex-module-decorators"
import store from "@/store/store"
import firebase from "@/plugins/firebase"
import { PostList, CommentList } from './types'

@Module({ dynamic: true, store: store, name: "vuexStore", namespaced: true })
class VuexStore extends VuexModule {
  private commentList: CommentList[] = []
  private postList: PostList[] = []
  private myPostList: PostList[] = []
  private db = firebase.firestore();


  public get _commentList(): CommentList[] {
    return this.commentList
  }
  public get _postList(): PostList[] {
    return this.postList
  }
  public get _myPostList(): PostList[] {
    return this.myPostList
  }
  @Mutation comment(comment: CommentList[]) {
    this.commentList = comment
  }
  @Mutation post(post: PostList[]) {
    this.postList = post
  }
  @Mutation myPost(post: PostList[]) {
    this.myPostList = post
  }
  @Mutation addComment(comment: CommentList) {
    this.commentList.unshift(comment)
  }
  @Mutation addPost(post: PostList) {
    this.postList.unshift(post)
  }

  @Action async fetchPost() {
    const postList: any = []
    const mainDoc = await this.db.collection("images").orderBy("timeStamp", "desc").limit(5).get()
    mainDoc.forEach((doc) => {
      postList.push({ id: doc.id, data: doc.data() })
    })
    this.post(postList)
    return postList
  }
  @Action async fetchComment() {
    const commentList: any = []
    const subDoc = await this.db.collectionGroup("comment").orderBy("timeStamp", "desc").limit(15).get()
    subDoc.forEach((subDoc) => {
      commentList.push({ id: subDoc.id, data: subDoc.data() })
    })
    this.comment(commentList)
    return commentList
  }
  @Action removeComment(subDocId: string) {
    const remove: any = this.commentList.filter(comment => comment.id !== subDocId)
    this.comment(remove)
  }
  @Action removePost(docId: string) {
    const remove: any = this.postList.filter(post => post.id !== docId)
    this.post(remove)
  }
  @Action loadMyPost(uid: string) {
    const post = this.postList.filter(post => post.data.uid === uid)
    this.myPost(post)
  }
}

export const vuexStore = getModule(VuexStore)
