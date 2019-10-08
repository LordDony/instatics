<template>
  <div>
    <div class="fotos">
      <h1>FOTOS</h1>
    </div>
    <div class="rollo">
      <div class="card card-align" v-for="todo in todos" :key="todo.id">
        <div
          class="card-header"
          style="display:flex; justify-content:space-between; align-items:center;"
        >
          <div v-for="user in users" :key="user.uid">
            <span v-if="user.uid==todo.uid">{{user.email}}</span>
            <span
              @click="follow(user.tokennav,user.uid)"
              v-if="user.uid==todo.uid"
              class="button is-info is-outlined"
            >Seguir</span>
          </div>
        </div>
        <div class="card-content">
          <img class="image" :src="todo.url_image" alt />
          <hr />
          <p>{{todo.descripcion}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
require("material-design-lite");
import firebase from "firebase";
import { todosCollection, userCollection, followersCollection } from "../firebase";
import axios from 'axios';
export default {
  data() {
    return {
      todos: [],
      users: [],
      mediaStream: null,
      publicate: false,
      user: null,
      foto_nueva: {
        url_image: "",
        uid: localStorage.getItem("uid"),
        descripcion: "",
        fecha: ""
      },
      follower_nuevo: {
        uidseguidor: localStorage.getItem("uid"),
        uidsiguiendo: ""
      },
    };
  },
  firestore() {
    return {
      todos: todosCollection.orderBy("fecha", "desc"),
      users: userCollection.orderBy("uid", "desc")
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
    console.log("todos" + this.todos);
  },
    methods: {
        follow(tokennav,uidseguir){

            followersCollection
                    .add({
                      uidseguidor : localStorage.getItem('uid'),
                      uidsiguiendo : uidseguir,
                    })
                    .then(function(docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        let endpointfirebasenotification = "https://fcm.googleapis.com/fcm/send";
                        let user = localStorage.getItem('email');
                        console.log("token dani: "+tokennav);
                        axios.post(endpointfirebasenotification,{
                        "to": tokennav,
                        "notification": {
                        "title": "InstaShot",
                        "body": `El usuario ${user} te acaba de seguir`,
                        "icon": "./img/icons/android-chrome-192x192.png"
                            }
                        },{
                            headers:{
                                "Content-Type":"application/json",
                                "Authorization":"key=AAAAE4iXZGQ:APA91bE5-ZDkX76VGKdAI-_Kdp-uC0YHUYPQWLsb4DuAg7Hq7B-9s7jwHRVIwXvT2at7d9nNXNKp-vzhh28SK8mVJGJgfioEegvKb8UCoArZ1ITM7kDl2YN_14Buw45LwbgnZfRLcaJa"
                            }
                        });
                    }).catch(function(error) {
                        console.error("Error adding document: ", error);
                        });
                        this.$router.replace("home");


            
      }
  }
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
.card {
  margin-bottom: 25px;
  width: 40% !important;
}
.card-header {
  font-size: 1.3em;
  font-weight: bold;
  color: #333;
  padding: 5px 5px;
  text-align: center;
}
.rollo {
  width: 75%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}
</style>
