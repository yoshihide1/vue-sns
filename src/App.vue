<template>
  <div id="app">
    <div id="nav">
      <div v-if="loginUser">
        <router-link to="/">Home</router-link>|
        <router-link :to="{name: 'User', params: {id: id}}">User</router-link>
        <SignOut />
      </div>
      <div v-if="noUser">
        <router-link to="/signUp">新規登録</router-link>|
        <router-link to="/signIn">サインイン</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import firebase from "./plugins/firebase";
import SignOut from "./components/auth/signOut.vue";
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {
    SignOut,
  },
})
export default class App extends Vue {
  id: string | null = "";
  loginUser = false;
  noUser = true;

  created(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = user.displayName;
        this.loginUser = true;
        this.noUser = false;
      } else {
        this.loginUser = false;
        this.noUser = true;
      }
    });
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
