import { Mutation, MutationAction, Action, VuexModule, getModule, Module } from "vuex-module-decorators"
import store from "@/store/store"
import firebase from "@/plugins/firebase"
import { PostList, CommentList } from './types'

@Module({ dynamic: true, store: store, name: "vuexStore", namespaced: true })
class VuexStore extends VuexModule {
  private commentList: CommentList[] = []
  private postList: PostList[] = []
  private db = firebase.firestore();


 public get _commentList (): CommentList[] {
  return this.commentList
 } 
 public get _postList (): PostList[] {
   return this.postList
 }
  @Mutation
  addComment(comment: CommentList): void {
    console.log("addComment")
    this.commentList.unshift(comment)
    console.log(this.commentList)
  }
  addPost(post: PostList): void {
    this.postList.unshift(post)
  }
  deleteComment(subDocId: string): void {
    this.commentList = this.removeComment(subDocId)
  }
  deletePost(docId: string): void {
    this.postList = this.removePost(docId)
  }

  @Action
 async fetchPost() {
    const postList: any = []
    const mainDoc = await this.db.collection("images").orderBy("timeStamp", "desc").limit(5).get()
    mainDoc.forEach((doc) => {
      postList.push({id: doc.id, data: doc.data()})
    })
    return postList
  }
  @Action
  async fetchComment() {
    const commentList: any = []
    const subDoc = await this.db.collectionGroup("comment").orderBy("timeStamp", "desc").limit(15).get()
    subDoc.forEach((subDoc) => {
      commentList.push({id: subDoc.id, data: subDoc.data()})
    })
    return commentList
  }
  removeComment(subDocId: string): CommentList[] {
    return this.commentList.filter(comment => comment.id !== subDocId)
  }
  removePost(docId: string): PostList[] {
    return this.postList.filter(post => post.id !== docId)
  }
}

export const vuexStore = getModule(VuexStore)
