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
}

function onSearchClicked() {
    showLoadingIndicator();
    getHistories(document.getElementById('search').value);
}

function getHistories(searchValue) {
    // clear data from table
    var table = document.getElementById('mainTable');
    table.innerHTML = table.rows[0].innerHTML;

    // if admin
    if (queryUserName == "") {
        dbRef = database.ref('Histories').once('value');
    } else {
        dbRef = database.ref('Histories').orderByChild('brand').equalTo(queryUserName).once('value');
    }

    dbRef.then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            getCustomerName(childData.uid, function (fullName, phone) {

                var history = {
                    customerName: fullName,
                    type: childData.type,
                    item: childData.typeText,
                    serialNumber: childData.serialNumber,
                    sendDate: childData.sendDate,
                    note: childData.note,
                    lastStatus: childData.lastStatus,
                    phone: phone
                };

                var lastStatuses = [];
                for (var key in history.lastStatus) {
                    if(history.lastStatus.hasOwnProperty(key)) {
                        var lastStatus = {
                            status: history.lastStatus[key].status,
                            updatedAt: history.lastStatus[key].updatedAt
                        }
                        lastStatuses.push(lastStatus);
                    }
                }
                lastStatuses.sort(function (a, b) {
                    return a.updatedAt - b.updatedAt;
                });

                if ( !(!searchValue
                    || searchValue == fullName
                    || searchValue == history.serialNumber
                    || searchValue == lastStatuses[lastStatuses.length-1].status
                    || searchValue == history.type) ) {
                    return
                }

                var table = document.getElementById('mainTable');
                var newRow = table.insertRow(table.rows.length);

                var okCell = newRow.insertCell(0);
                var newStatusCell = newRow.insertCell(0);
                var prevStatusCell = newRow.insertCell(0);
                var noteCell = newRow.insertCell(0);
                var sendDateCell = newRow.insertCell(0);
                var serialNumberCell = newRow.insertCell(0);
                var itemCell = newRow.insertCell(0);
                var typeCell = newRow.insertCell(0);
                var phoneCell = newRow.insertCell(0);
                var customerNameCell = newRow.insertCell(0);

                customerNameCell.innerHTML = history.customerName;
                phoneCell.innerHTML = history.phone;
                typeCell.innerHTML = history.type;
                itemCell.innerHTML = history.item;
                serialNumberCell.innerHTML = history.serialNumber;
                sendDateCell.innerHTML = history.sendDate;
                noteCell.innerHTML = history.note;
                if (lastStatuses.length > 0) {
                    prevStatusCell.innerHTML = lastStatuses[lastStatuses.length-1].status;
                }
                // Create input
                var element1 = document.createElement("select");
                element1.setAttribute("id",history.serialNumber);

                var defaultOption = document.createElement("option");
                defaultOption.innerHTML = "---เลือกสถานะสินค้า---";
                defaultOption.value = "0";
                element1.add(defaultOption, null);
                var option1 = document.createElement("option");
                option1.innerHTML = "บริษัทได้รับสินค้าแล้ว";
                option1.value = "1";
                element1.add(option1, null);
                var option2 = document.createElement("option");
                option2.innerHTML = "บริษัทกำลังตรวจสอบสินค้า";
                option2.value = "2";
                element1.add(option2, null);
                var option3 = document.createElement("option");
                option3.innerHTML = "รออะไหล่สินค้า";
                option3.value = "3";
                element1.add(option3, null);
                var option4 = document.createElement("option");
                option4.innerHTML = "อยู่ในระหว่างการจัดส่งสินค้า";
                option4.value = "4";
                element1.add(option4, null);
                var option5 = document.createElement("option");
                option5.innerHTML = "สินค้าอยู่ในระหว่างการซ่อม";
                option5.value = "5";
                element1.add(option5, null);

                newStatusCell.appendChild(element1);

                var btn = document.createElement('input');
                btn.type = "button";
                btn.value = "OK";
                btn.onclick = function () {
                    writeData(history.serialNumber)
                }
                okCell.append(btn);
            })
        });

        dismissLoadingIndicator();

    });
}

function writeData(serialNumber) {
    var sel = document.getElementById(serialNumber)
    var status = sel.options[sel.selectedIndex].text

    var updateStatus = {
        status: status,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref("Histories/" +serialNumber +"/lastStatus").push(updateStatus);
    getHistories();
}


function getCustomerName(uid, fn) {
    database.ref('Users').orderByKey().equalTo(uid).limitToFirst(1).once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val()
            fn(childData.fullName, childData.phone);
        });
    });
}