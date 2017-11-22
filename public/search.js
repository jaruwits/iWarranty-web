/**
 * Created by Jaruwit on 11/10/2017 AD.
 */
var database = firebase.database();
var queryUserName = sessionStorage.getItem('username') == "admin" ? "" : sessionStorage.getItem('username');

function dismissLoadingIndicator() {
    document.getElementsByClassName('loading')[0].style.visibility = "hidden";
}

function showLoadingIndicator() {
    document.getElementsByClassName('loading')[0].style.visibility = "visible";
}

function onPageLoad() {
    dismissLoadingIndicator();
    console.log(sessionStorage.getItem('username'));
}

function onSearchClicked() {
    showLoadingIndicator();
    getWarranties(document.getElementById('search').value);
}

function getWarranties(searchValue) {
    //Clean data from table
    console.log(queryUserName);
    var table = document.getElementById('mainTable');
    table.innerHTML = table.rows[0].innerHTML;

    var dbRef;
    // if admin
    if (queryUserName == "") {
        dbRef = database.ref('Warranties').once('value');
    } else {
        dbRef = database.ref('Warranties').orderByChild('brand').equalTo('haha').once('value');
    }

    dbRef.then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            getCustomerName(childData.uid, function (fullName) {
                var warranty = {
                    serialNumber: childData.serialNumber,
                    type: childData.type,
                    model: childData.model,
                    item: childData.typeText,
                    store: childData.store,
                    price: childData.price,
                    customerName: fullName,
                    buyDate: childData.buyDate
                };

                if ( !(!searchValue
                    || searchValue == fullName
                    || searchValue == warranty.serialNumber
                    || searchValue == warranty.type
                    || searchValue == warranty.store) ) {
                    return
                }
                
                var table = document.getElementById('mainTable');
                var newRow = table.insertRow(table.rows.length);

                var buyDateCell = newRow.insertCell(0);
                var customerNameCell = newRow.insertCell(0);
                var priceCell = newRow.insertCell(0);
                var storeCell = newRow.insertCell(0);
                var itemCell = newRow.insertCell(0);
                var modelCell = newRow.insertCell(0);
                var typeCell = newRow.insertCell(0);
                var serialNumberCell = newRow.insertCell(0);

                serialNumberCell.innerHTML = warranty.serialNumber;
                typeCell.innerHTML = warranty.type;
                modelCell.innerHTML = warranty.model;
                itemCell.innerHTML = warranty.item;
                storeCell.innerHTML = warranty.store;
                priceCell.innerHTML = warranty.price;
                customerNameCell.innerHTML = warranty.customerName;
                buyDateCell.innerHTML = warranty.buyDate;
            });
        });

        dismissLoadingIndicator();

    });
}


function getCustomerName(uid, fn) {
    database.ref('Users').orderByKey().equalTo(uid).limitToFirst(1).once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()
            fn(childData.fullName);
        });
    });
}