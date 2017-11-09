var config = {
  apiKey: "AIzaSyC1mwsvVvwK1bJ3ku3DXVOzt-13WWt1e_Q",
  authDomain: "myisproject-61270.firebaseapp.com",
  databaseURL: "https://myisproject-61270.firebaseio.com/",
  projectId: "myisproject-61270",
  storageBucket: "myisproject-61270.appspot.com",
  messagingSenderId: "767412484620"
};
console.log("it works.");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
firebase.initializeApp(config);


// // Get a reference to the database service
// var database = firebase.database();
// var serialNumber = firebase.database().Warranties;

function onPageLoad() {
    alert("Page loaded");
}