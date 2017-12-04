/**
 * Created by Jaruwit on 12/2/2017 AD.
 */

function getWarrantyWithAge() {
    var dbRef;
    // if admin
    if (queryUserName == "") {
        dbRef = database.ref('Warranties').once('value');
    } else {
        dbRef = database.ref('Warranties').orderByChild('brand').equalTo(queryUserName).once('value');
    }
    dbRef.then(function (snapshot) {
        var dictionary = {};
        var sum = 0;
        var monthName = "";
        dictionary["เครื่องใช้ไฟฟ้าขนาดเล็ก"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["เครื่องใช้ไฟฟ้าขนาดใหญ่"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["โทรศัพท์มือถือ-แท็บเล็ตและอุปกรณ์"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["คอมพิวเตอร์ & โน๊ตบุ๊ค"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["ทีวี-เครื่องเสียงและเครื่องเกม"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["กล้องและอุปกรณ์"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["รวมทั้งสิ้น"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};

        snapshot.forEach(function (childSnapshot) {

            childData = childSnapshot.val();
            var buyDate = childData.buyDate;
            var owner = childData.uid;
            var type = childData.type;

            var yearSelect = document.getElementById("yearSelect");
            var monthSelect = document.getElementById("monthSelect");

            var year = buyDate.split('/')[2];
            var month = parseInt(buyDate.split('/')[1],10);

            if (year == yearSelect.options[yearSelect.selectedIndex].text
                && 0 == monthSelect.options[monthSelect.selectedIndex].value) {
            } else if (
                year == yearSelect.options[yearSelect.selectedIndex].text
                && month == monthSelect.options[monthSelect.selectedIndex].value) {
                monthName = monthSelect.options[monthSelect.selectedIndex].text;

            }

            database.ref('Users').orderByKey().equalTo(owner).once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapShot) {
                    if (month != monthSelect.options[monthSelect.selectedIndex].value && monthSelect.options[monthSelect.selectedIndex].value != 0) {
                        return;
                    }
                    var childData = childSnapShot.val();
                    var yearOfBirth = childData.birthDate.split("/")[2];
                    var currentYear = (new Date()).getFullYear();
                    var age = currentYear-yearOfBirth;
                    if (age <= 18) {
                        dictionary[type]["วัยเด็ก 0-18 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยเด็ก 0-18 ปี"]++
                    } else if (age > 18 && age <= 25) {
                        dictionary[type]["วัยรุ่น 19-25 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยรุ่น 19-25 ปี"]++;
                    } else if (age > 25 && age <= 35) {
                        dictionary[type]["วัยผู้ใหญ่ตอนต้น 26-35 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยผู้ใหญ่ตอนต้น 26-35 ปี"]++;
                    } else if (age > 35 && age <= 45) {
                        dictionary[type]["วัยผู้ใหญ่ตอนปลาย 36-45 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยผู้ใหญ่ตอนปลาย 36-45 ปี"]++
                    } else if (age > 45 && age <= 60) {
                        dictionary[type]["วัยกลางคน 46-60 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยกลางคน 46-60 ปี"]++;
                    } else if (age > 60 && age <= 100) {
                        dictionary[type]["วัยสูงอายุ 61-100 ปีวัยสูงอายุ 61-100 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยสูงอายุ 61-100 ปีวัยสูงอายุ 61-100 ปี"]++;
                    }
                });
                console.log(dictionary)
                generateReportWarrantyWithAge(dictionary, sum, monthName)
            });

        });
        //dictionary["รวมทั้งสิ้น"] = sum;
        generateReportWarrantyWithAge(dictionary, sum, monthName)
    });
}


function generateReportWarrantyWithAge(dictionary, sum, monthName) {
    var tableTitle;
    var p = document.createElement("p");
    p.id = "tableTitle";

    if (monthName == "" || typeof  monthName === 'undefined') {
        tableTitle = document.createTextNode("รายงานประเภทสินค้าที่ผู้ใช้งานส่งใบรับประกันปี 2017");
    } else {
        tableTitle = document.createTextNode("รายงานประเภทสินค้าที่ผู้ใช้งานส่งใบรับประกันเดือน" + monthName);
    }

    p.append(tableTitle);
    var tableSection = document.getElementById('table-section');
    tableSection.innerHTML = "";
    tableSection.appendChild(p);

    var table = document.createElement('TABLE');

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    if (monthName != null) {

    }

    for (var i=0; i<7; i++) {
        var th = document.createElement('TH');
        th.width = '100';
        if (i==0) {
            th.appendChild(document.createTextNode("ประเภทสินค้าที่ส่งใบรับประกัน"));
        } else if (i==1) {
            th.appendChild(document.createTextNode("วัยเด็ก 0-18 ปี"));
        } else if (i==2) {
            th.appendChild(document.createTextNode("วัยรุ่น 19-25 ปี"));
        } else if (i==3) {
            th.appendChild(document.createTextNode("วัยผู้ใหญ่ตอนต้น 26-35 ปี"));
        } else if (i==4) {
            th.appendChild(document.createTextNode("วัยผู้ใหญ่ตอนปลาย 36-45 ปี"));
        } else if (i==5) {
            th.appendChild(document.createTextNode("วัยกลางคน 46-60 ปี"));
        } else if (i==6) {
            th.appendChild(document.createTextNode("วัยสูงอายุ 61-100 ปี"));
        }
        tr.appendChild(th);
    }


    for (var i = 0; i < Object.keys(dictionary).length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 7; j++) {
            var td = document.createElement('TD');
            td.width = '100';
            if (j == 0) {
                td.appendChild(document.createTextNode(Object.keys(dictionary)[i]));
            } else if (j == 1) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยเด็ก 0-18 ปี"]))
            } else if (j == 2) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยรุ่น 19-25 ปี"]))
            } else if (j == 3) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยผู้ใหญ่ตอนต้น 26-35 ปี"]))
            } else if (j == 4) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยผู้ใหญ่ตอนปลาย 36-45 ปี"]))
            } else if (j == 5) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยกลางคน 46-60 ปี"]))
            } else if (j == 6) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยสูงอายุ 61-100 ปี"]))
            }
            tr.appendChild(td);
        }
    }
    tableSection.appendChild(table);
}

function getHistoryWithAge() {
    if (queryUserName == "") {
        dbRef = database.ref('Histories').once('value');
    } else {
        dbRef = database.ref('Histories').orderByChild('brand').equalTo(queryUserName).once('value');
    }
    dbRef.then(function (snapshot) {
        var dictionary = {};
        var sum = 0;
        var monthName = "";
        dictionary["เครื่องใช้ไฟฟ้าขนาดเล็ก"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["เครื่องใช้ไฟฟ้าขนาดใหญ่"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["โทรศัพท์มือถือ-แท็บเล็ตและอุปกรณ์"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["คอมพิวเตอร์ & โน๊ตบุ๊ค"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["ทีวี-เครื่องเสียงและเครื่องเกม"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["กล้องและอุปกรณ์"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        dictionary["รวมทั้งสิ้น"] = {"วัยเด็ก 0-18 ปี": 0,
            "วัยรุ่น 19-25 ปี": 0,
            "วัยผู้ใหญ่ตอนต้น 26-35 ปี": 0,
            "วัยผู้ใหญ่ตอนปลาย 36-45 ปี": 0,
            "วัยกลางคน 46-60 ปี": 0,
            "วัยสูงอายุ 61-100 ปี": 0};
        console.log(dictionary)
        snapshot.forEach(function (childSnapshot) {

            childData = childSnapshot.val();
            var buyDate = childData.sendDate;
            var owner = childData.uid;
            var type = childData.type;

            var yearSelect = document.getElementById("yearSelect");
            var monthSelect = document.getElementById("monthSelect");

            var year = buyDate.split('/')[2];
            var month = parseInt(buyDate.split('/')[1],10);

            if (year == yearSelect.options[yearSelect.selectedIndex].text
                && 0 == monthSelect.options[monthSelect.selectedIndex].value) {
            } else if (
                year == yearSelect.options[yearSelect.selectedIndex].text
                && month == monthSelect.options[monthSelect.selectedIndex].value) {
                monthName = monthSelect.options[monthSelect.selectedIndex].text;

            }

            database.ref('Users').orderByKey().equalTo(owner).once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapShot) {
                    if (month != monthSelect.options[monthSelect.selectedIndex].value && monthSelect.options[monthSelect.selectedIndex].value != 0) {
                        return;
                    }
                    var childData = childSnapShot.val();
                    var yearOfBirth = childData.birthDate.split("/")[2];
                    var currentYear = (new Date()).getFullYear();
                    var age = currentYear-yearOfBirth;
                    if (age <= 18) {
                        dictionary[type]["วัยเด็ก 0-18 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยเด็ก 0-18 ปี"]++
                    } else if (age > 18 && age <= 25) {
                        dictionary[type]["วัยรุ่น 19-25 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยรุ่น 19-25 ปี"]++;
                    } else if (age > 25 && age <= 35) {
                        dictionary[type]["วัยผู้ใหญ่ตอนต้น 26-35 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยผู้ใหญ่ตอนต้น 26-35 ปี"]++;
                    } else if (age > 35 && age <= 45) {
                        dictionary[type]["วัยผู้ใหญ่ตอนปลาย 36-45 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยผู้ใหญ่ตอนปลาย 36-45 ปี"]++
                    } else if (age > 45 && age <= 60) {
                        dictionary[type]["วัยกลางคน 46-60 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยกลางคน 46-60 ปี"]++;
                    } else if (age > 60 && age <= 100) {
                        dictionary[type]["วัยสูงอายุ 61-100 ปีวัยสูงอายุ 61-100 ปี"]++;
                        dictionary["รวมทั้งสิ้น"]["วัยสูงอายุ 61-100 ปีวัยสูงอายุ 61-100 ปี"]++;
                    }
                });

                generateReportHistoryWithAge(dictionary, sum, monthName)
            });

        });

    });
}

function generateReportHistoryWithAge(dictionary, sum, monthName) {
    var tableTitle;
    var p = document.createElement("p");
    p.id = "tableTitle";

    if (monthName == "" || typeof  monthName === 'undefined') {
        tableTitle = document.createTextNode("รายงานประเภทสินค้าที่ผู้ใช้งานส่งซ่อมสินค้าปี 2017");
    } else {
        tableTitle = document.createTextNode("รายงานประเภทสินค้าที่ผู้ใช้งานส่งซ่อมสินค้าของเดือน" + monthName);
    }

    p.append(tableTitle);
    var tableSection = document.getElementById('table-section');
    tableSection.innerHTML = "";
    tableSection.appendChild(p);

    var table = document.createElement('TABLE');

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    if (monthName != null) {

    }

    for (var i=0; i<7; i++) {
        var th = document.createElement('TH');
        th.width = '100';
        if (i==0) {
            th.appendChild(document.createTextNode("ประเภทสินค้าที่ส่งใบรับประกัน"));
        } else if (i==1) {
            th.appendChild(document.createTextNode("วัยเด็ก 0-18 ปี"));
        } else if (i==2) {
            th.appendChild(document.createTextNode("วัยรุ่น 19-25 ปี"));
        } else if (i==3) {
            th.appendChild(document.createTextNode("วัยผู้ใหญ่ตอนต้น 26-35 ปี"));
        } else if (i==4) {
            th.appendChild(document.createTextNode("วัยผู้ใหญ่ตอนปลาย 36-45 ปี"));
        } else if (i==5) {
            th.appendChild(document.createTextNode("วัยกลางคน 46-60 ปี"));
        } else if (i==6) {
            th.appendChild(document.createTextNode("วัยสูงอายุ 61-100 ปี"));
        }
        tr.appendChild(th);
    }


    for (var i = 0; i < Object.keys(dictionary).length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 7; j++) {
            var td = document.createElement('TD');
            td.width = '100';
            if (j == 0) {
                td.appendChild(document.createTextNode(Object.keys(dictionary)[i]));
            } else if (j == 1) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยเด็ก 0-18 ปี"]))
            } else if (j == 2) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยรุ่น 19-25 ปี"]))
            } else if (j == 3) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยผู้ใหญ่ตอนต้น 26-35 ปี"]))
            } else if (j == 4) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยผู้ใหญ่ตอนปลาย 36-45 ปี"]))
            } else if (j == 5) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยกลางคน 46-60 ปี"]))
            } else if (j == 6) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]["วัยสูงอายุ 61-100 ปี"]))
            }
            tr.appendChild(td);
        }
    }
    tableSection.appendChild(table);
}