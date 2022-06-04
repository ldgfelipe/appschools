import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
        apiKey: "AIzaSyBLp29t7KtHF8kfuaA-eY52YYLqFeoM0JI",
        authDomain: "appschool-f7262.firebaseapp.com",
        databaseURL: "https://appschool-f7262.firebaseio.com",
        projectId: "appschool-f7262",
        storageBucket: "appschool-f7262.appspot.com",
        messagingSenderId: "438788352283",
        appId: "1:438788352283:web:5577e8745ee7af85268bbe",
        measurementId: "G-81LM2CDR6Q"
  }
  
  
let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let auth = firebase.auth();
let storage = firebase.storage();

export { db, firebase, auth, storage };