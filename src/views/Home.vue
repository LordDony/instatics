
<template>
  <div >
    <div class="misfotos">
      <h1>MIS FOTOS</h1>
    </div>
    <button @click="openmodal" class="button is-link">Crear publicación</button>
    <br />
    <br />

    <div class="modal" :class="{'is-active':isactivemodal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Crear nueva publicación</p>
          <button @click="closemodal" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <img :src="foto_nueva.url_image" alt="">
          <textarea
                  v-model="foto_nueva.descripcion"
                  class="textarea"
                  placeholder="Descripción"
                ></textarea>
          <!--<div class="camera-modal">
            <video ref="video" class="camera-stream" />

            <span
              @click="capture()"
              class="take-picture-button mdl-button mdl-js-button mdl-button--fab mdl-button--colored"
            >
              <i class="material-icons">camera</i>
            </span>

            <div class="field">
              <label class="label">
                <br />
              </label>
              <div class="control">
                
              </div>
            </div>
          </div>-->
          <input type="file" @change="choose">
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            type="submit"
            @click.prevent="addTodo()"
            @click="closemodal"
          >Subir publicación</button>
          <button @click="closemodal" class="button">Cancelar</button>
        </footer>
      </div>
    </div>
    <div class="rollo">
      <div class="card card-align" v-for="todo in todos" :key="todo.id">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
          <span>{{user.email}}</span>
          <span class="button is-danger is-outlined" @click="eliminar(todo.id)">Eliminar</span>
        </div>
        <div class="card-content">
          <img class="image" :src="todo.url_image" alt />
          <hr />
          <p>{{todo.descripcion}}</p>
          <p>{{todo.fecha.toDate()}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
require("material-design-lite");
import firebase from "firebase";
import 'firebase/storage';
import { todosCollection } from "../firebase";

export default {
  data() {
    return {
      todos: [],
      mediaStream: null,
      publicate: false,
      user: null,
      foto_nueva: {
        url_image: "",
        uid: localStorage.getItem("uid"),
        descripcion: "",
        fecha: ""
      },
      isactivemodal: false
    };
  },
  firestore() {
    return {
      todos: todosCollection.where("uid", "==", localStorage.getItem("uid"))
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
    console.log(this.todos);
  },
  methods: {
    async choose(event){
      console.log(event.target.files[0]);
      let file = event.target.files[0];
      let nameFile = Math.ceil(Math.random()*198737)+"fileexample.png";
      const response = await firebase.storage().ref(nameFile).put(file);
      this.foto_nueva.url_image  = await response.ref.getDownloadURL()
      //= ;
      console.log(url);
      //t = url;

    },
    openmodal() {
      this.isactivemodal = true;
      this.openCamera();
    },
    closemodal() {
      this.isactivemodal = false;
    },
    addTodo() {
      console.log(this.foto_nueva.uid);
      todosCollection
        .add({
          url_image: this.foto_nueva.url_image,
          uid: this.foto_nueva.uid,
          descripcion: this.foto_nueva.descripcion,
          fecha: new Date()
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
      this.foto_nueva.descripcion = "";
      
    },
    eliminar(id) {
      todosCollection
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    logout: function() {
      localStorage.removeItem("uid");
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    },
    openCamera() {
      this.publicate = true;
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(mediaStream => {
          this.mediaStream = mediaStream;
          this.$refs.video.srcObject = mediaStream;
          this.$refs.video.play();
        })
        .catch(error => {
          console.error("getUserMedia() error:", error);
        });
    },
    capture() {
      const mediaStreamTrack = this.mediaStream.getVideoTracks()[0];
      const imageCapture = new window.ImageCapture(mediaStreamTrack);

      return imageCapture.takePhoto().then(blob => {
        console.log("file ====", blob);
        firebase
          .storage()
          .ref()
          .child(`images/picture-${new Date().getTime()}`)
          .put(blob)
          .then(snapshop => {
            console.log("snapshop file ====", snapshop);
            firebase
              .storage()
              .ref()
              .child(snapshop.ref.location.path)
              .getDownloadURL()
              .then(url => {
                this.foto_nueva.url_image = url;
                console.log("url ====", url);
                alert("url: ",url);
                //Insertamos en una tabla el id del usuario, la foto y  descripción.
              })
              .catch(error => {
                console.error("error get url file", error);
                alert("error get url file", error.code);
                switch (error.code) {
                  case "storage/object_not_found":
                    // File doesn't exist
                    break;
                  case "storage/unauthorized":
                    // User doesn't have permission to access the object
                    break;
                  case "storage/canceled":
                    // User canceled the upload
                    break;
                  case "storage/unknown":
                    // Unknown error occurred, inspect the server response
                    break;
                }
              });
          });
      });
    }
  },
  
  destroyed() {
    const tracks = this.mediaStream.getTracks();
    tracks.map(track => track.stop());
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://code.getmdl.io/1.2.1/material.blue-red.min.css");

.rollo {
  width: 75%;
  margin:auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 50px;
}
.card-header {
  font-size: 1.3em;
  font-weight: bold;
  color: #333;
  padding: 10px 10px;
  text-align: center;
}
.card {
  margin-bottom: 25px;
  width: 30% !important;
}
.camera-modal {
  width: 40%;
  height: 40%;
  margin: 0px auto;
  padding: 15px;
}

.camera-stream {
  width: 40%;
  max-height: 40%;
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
</style>
