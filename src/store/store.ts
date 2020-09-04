import Vue from "vue"
import Vuex from "vuex"
import { PostList, CommentList } from "./types"

Vue.use(Vuex)
export interface RootState {
  //stateの値↓
  vuexStore: {
    postList: PostList;
    commentList: CommentList;
  };
}

export default new Vuex.Store<RootState>({})