<template>
  <div>
    <div class="fotos">
      <h1>MIS SEGUIDORES</h1>
      <span v-for="user in users" :key="user.id">
        <span v-for="follower in followers" :key="follower.id">
          <span v-if="user.uid==follower.uidseguidor && user.uid != foto_nueva.uid"> {{user.email}}</span>
        </span>
      </span>
    </div>
      
  </div>
</template>

<script>
require("material-design-lite");
import firebase from "firebase";
import { userCollection, followersCollection } from "../firebase";
export default {
  data() {
    return {
      todos: [],
      users: [],
      followers: [],
      mediaStream: null,
      publicate: false,
      user: null,
      foto_nueva: {
        url_image: "",
        uid: localStorage.getItem("uid"),
        descripcion: "",
        fecha: ""
      }
    };
  },
  firestore() {
    return {
      users: userCollection.orderBy("uid","desc"),
      followers: followersCollection.orderBy("uidseguidor", "desc")
      
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        console.log("user id: " + firebase.auth().currentUser.uid);
        localStorage.setItem("uid", firebase.auth().currentUser.uid);
        console.log("uid local storage" + localStorage.getItem("uid"));
      } else {
        this.user = null;
      }
    });
  },
  mounted() {
    console.log("todos" + this.users);
  },
  methods: {}
};
</script>
<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://code.getmdl.io/1.2.1/material.blue-red.min.css");

.card-align {
  width: 30%;
  margin: auto;
}
.camera-modal {
  width: 100%;
  height: 100%;
  margin: 20px auto;
  z-index: 1000;
  padding: 15px;
}
.publication-new {
  width: 35%;
  height: 35%;
  margin: 0px auto;
  background: #ddd;
  border-radius: 5px;
}
.camera-stream {
  width: 100%;
  max-height: 100%;
}
.camera-modal-container {
  position: absolute;
}
.camera-modal-container span {
  position: relative;
  top: -40px;
  left: 200px;
}
.flex-row {
  display: flex;
}
.home {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}
.flex-row a {
  border-radius: 0px;
  font-weight: bold;
}
table{
    width: 80%;
    margin: auto;
}
</style>
