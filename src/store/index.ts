import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "../plugins/firebase";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    signOut(this: any, { commit }) {
      firebase.auth().signOut().then(() => {
        alert("サインアウトしました")
      })
    },
  },
  modules: {
  }
})
