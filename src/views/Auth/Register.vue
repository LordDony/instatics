<template>
  <div class="sign-up">
    <img src="../../assets/icon192.png" alt="img" />
    <h5>¡Vamos, crea una nueva cuenta!</h5>
    <input type="text" v-model="name" placeholder="Nombre" />
    <br />
    <input type="email" v-model="email" placeholder="Email" />
    <br />
    <input type="password" v-model="password" placeholder="Contraseña" />
    <br />
    <button class="button is-small" @click="signUp">Registrarme</button>
    <span>
      Puedes regresar al
      <router-link to="/login">inicio de sesión</router-link>.
    </span>
  </div>
</template>

 <script>
import firebase from "firebase";
export const db = firebase.firestore();
export const userCollection = db.collection("users");

export default {
  name: "register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      new_user: {
        uid: localStorage.getItem("uid"),
        name: "",
        email: "",
        password: "",
        tokennav: localStorage.getItem("token_nav")
      }
    };
  },
  methods: {
    signUp: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            firebase
              .auth()
              .signInWithEmailAndPassword(this.email, this.password)
              .then(
                user => {
                  localStorage.setItem("uid", firebase.auth().currentUser.uid);
                  console.log(this.new_user.uid);

                  userCollection
                    .add({
                      uid: firebase.auth().currentUser.uid,
                      email: this.email,
                      password: this.password,
                      tokennav: localStorage.getItem("token_nav")
                    })
                    .then(function(docRef) {
                      console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function(error) {
                      console.error("Error adding document: ", error);
                    });
                  this.$router.replace("home");
                },
                err => {
                  alert("Oops. " + err.message);
                }
              );
            this.$router.replace("home");
          },
          err => {
            alert("Oops. " + err.message);
          }
        );
    }
  }
};
</script>

 <style scoped>
.sign-up {
  margin-top: 40px;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  margin-top: 10px;
  width: 10%;
  cursor: pointer;
}
span {
  display: block;
  margin-top: 20px;
  font-size: 11px;
}
</style>