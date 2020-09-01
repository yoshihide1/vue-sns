import { Module } from 'vuex'
import { SnsState, RootState } from '@/store/types'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import firebase from "@/plugins/firebase";


const state: SnsState = {
  storage: firebase.storage(),
  db: firebase.firestore(),
  auth: firebase.auth()
}

export const sns: Module<SnsState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}