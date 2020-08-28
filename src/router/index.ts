import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/user.vue'
import SignIn from '../components/auth/signIn.vue'
import SignUp from '../components/auth/signUp.vue'
import firebase from "../plugins/firebase";



Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/:id',
    name: 'user',
    component: User,
    meta: { requiresAuth: true }
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: SignIn
  },
  {
    path: '/signUp',
    name: 'signUp',
    component: SignUp
  },
  {
    path: '*',
    redirect: '/signIn'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('user')
        next()
      } else {
        console.log('noUser')
        next({
          path: '/signUp',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})

export default router
