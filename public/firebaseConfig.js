var config = {
  apiKey: "AIzaSyC1mwsvVvwK1bJ3ku3DXVOzt-13WWt1e_Q",
  authDomain: "myisproject-61270.firebaseapp.com",
  databaseURL: "https://myisproject-61270.firebaseio.com/",
  projectId: "myisproject-61270",
  storageBucket: "myisproject-61270.appspot.com",
  messagingSenderId: "767412484620"
};

firebase.initializeApp(config);

var database = firebase.database();
var warrantyList = new Array();

function onPageLoad() {
  database.ref('Warranties').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      getCustomerName(childData.uid, function(fullName){
        var warranty = {serialNumber:childData.serialNumber, 
          type:childData.type, 
          model:childData.typeText,
          store:childData.store,
          price:childData.price,
          customerName:fullName
        }
          var table = document.getElementById('mainTable');
          var newRow = table.insertRow(table.rows.length);
          var newCell = newRow.insertCell(0);
          newCell.innerHTML = warranty.serialNumber;
      });
    });

    
    document.getElementsByClassName('loading')[0].style.visibility = "hidden";
    
    
    
  });
}



function getCustomerName(uid, fn) {
  database.ref('Users').orderByKey().equalTo(uid).limitToFirst(1).once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val()
      fn(childData.fullName);
    });
  });
}