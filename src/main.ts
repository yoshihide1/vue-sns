import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import firebase from '../src/plugins/firebase'


Vue.config.productionTip = false
firebase
new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
