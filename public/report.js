/**
 * Created by Jaruwit on 11/13/2017 AD.
 */

database = firebase.database();

var queryUserName = sessionStorage.getItem('username') == "admin" ? "" : sessionStorage.getItem('username');

var ReportType = {
    Warranty: 1,
    History: 2,
    UserCount: 3
}


function onReportCategoryChange() {

    var div = document.getElementById("form-group");
    var element = document.getElementById("select");

    if (element.options[element.selectedIndex].text == "ใบรับประกันสินค้า"
        || element.options[element.selectedIndex].text == "สินค้าที่ส่งซ่อม"
        || element.options[element.selectedIndex].text == "ผู้ใช้งานส่งใบรับประกัน"
        || element.options[element.selectedIndex].text == "ผู้ใช้งานส่งซ่อมสินค้า") {
        if (div.contains(document.getElementById("yearSelect"))) {
            return
        }
        //Create year select options
        var yearOptions = ["2017"];
        var yearSelect = document.createElement("select");
        yearSelect.id = "yearSelect";
        div.insertBefore(yearSelect, div.children[1]);
        for (var i = 0; i < yearOptions.length; i++) {
            var option = document.createElement("option");
            option.value = yearOptions[i];
            option.text = yearOptions[i];
            yearSelect.appendChild(option);
        }

        //Create month select options
        var monthOptions = ["รวมทั้งปี", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        var monthSelect = document.createElement("select");
        monthSelect.id = "monthSelect";
        div.insertBefore(monthSelect, div.children[2]);
        for (var i = 0; i < monthOptions.length; i++) {
            var option = document.createElement("option");
            if (monthOptions == "รวมทั้งปี") {
                option.value = 0;
            } else {
                option.value = i;
            }
            option.text = monthOptions[i];
            monthSelect.appendChild(option);
        }

    } else if (element.options[element.selectedIndex].text == "จำนวนผู้ใช้งาน") {
        var yearChild = document.getElementById("yearSelect");
        var monthChild = document.getElementById("monthSelect");
        var div = document.getElementById("form-group");
        div.removeChild(yearChild);
        div.removeChild(monthChild);
    }
}

function onOKClick() {
    var element = document.getElementById("select");
    var dbRef;
    // if admin
    if (queryUserName == "") {
        dbRef = database.ref('Warranties').once('value');
    } else {
        dbRef = database.ref('Warranties').orderByChild('brand').equalTo(queryUserName).once('value');
    }
    if (element.options[element.selectedIndex].text == "ใบรับประกันสินค้า") {
        //gen report
        dbRef.then(function (snapshot) {
            var dictionary = {};
            var sum = 0;
            var monthName = "";
            snapshot.forEach(function (childSnapshot) {
                childData = childSnapshot.val();
                var buyDate = childData.buyDate;

                var yearSelect = document.getElementById("yearSelect");
                var monthSelect = document.getElementById("monthSelect");

                var year = buyDate.split('/')[2];
                var month = buyDate.split('/')[1];

                if (year == yearSelect.options[yearSelect.selectedIndex].text
                    && 0 == monthSelect.options[monthSelect.selectedIndex].value) {
                    typeof dictionary[childData.type] === 'undefined' ? dictionary[childData.type] = 1 : dictionary[childData.type]++;
                    sum++;
                } else if (
                    year == yearSelect.options[yearSelect.selectedIndex].text
                    && month == monthSelect.options[monthSelect.selectedIndex].value) {
                    monthName = monthSelect.options[monthSelect.selectedIndex].text;
                    typeof dictionary[childData.type] === 'undefined' ? dictionary[childData.type] = 1 : dictionary[childData.type]++;
                    sum++;
                }

            });
            dictionary["รวมทั้งสิ้น"] = sum;
            generateTable(ReportType.Warranty, dictionary, sum, monthName);
        });
    } else if (element.options[element.selectedIndex].text == "สินค้าที่ส่งซ่อม") {
        var dbRef;
        // if admin
        if (queryUserName == "") {
            dbRef = database.ref('Histories').once('value');
        } else {
            dbRef = database.ref('Histories').orderByChild('brand').equalTo(queryUserName).once('value');
        }
        dbRef.then(function (snapshot) {
            var dictionary = {};
            var sum = 0;
            var monthName = "";
            snapshot.forEach(function (childSnapshot) {
                childData = childSnapshot.val();
                var buyDate = childData.sendDate;

                var yearSelect = document.getElementById("yearSelect");
                var monthSelect = document.getElementById("monthSelect");

                var year = buyDate.split('/')[2];
                var month = buyDate.split('/')[1];

                if (year == yearSelect.options[yearSelect.selectedIndex].text
                    && 0 == monthSelect.options[monthSelect.selectedIndex].value) {
                    typeof dictionary[childData.type] === 'undefined' ? dictionary[childData.type] = 1 : dictionary[childData.type]++;
                    sum++;
                } else if (
                    year == yearSelect.options[yearSelect.selectedIndex].text
                    && month == monthSelect.options[monthSelect.selectedIndex].value) {
                    monthName = monthSelect.options[monthSelect.selectedIndex].text;
                    typeof dictionary[childData.type] === 'undefined' ? dictionary[childData.type] = 1 : dictionary[childData.type]++;
                    sum++;
                }

            });
            dictionary["รวมทั้งสิ้น"] = sum;
            generateTable(ReportType.History, dictionary, sum, monthName);
        });
    } else if (element.options[element.selectedIndex].text == "จำนวนผู้ใช้งาน") {
        database.ref('Users').once('value').then(function (snapshot) {
            var sum = 0;
            var dictionary = {};
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (typeof childData.gender === 'undefined') {
                    childData.gender = "ไม่ระบุเพศ";
                }
                typeof dictionary[childData.gender] === 'undefined' ? dictionary[childData.gender] = 1 : dictionary[childData.gender]++;
                sum++;
            });
            dictionary["รวมทั้งสิ้น"] = sum;
            clearTemplate();
            createTableHeader("รายงานจำนวนผู้ใช้งาน");
            generateUserReport(dictionary, sum);

            var ageRangeSum = 0;
            var object2 = {};
            object2["วัยเด็ก (0-18 ปี)"] = 0;
            object2["วัยรุ่น (19-25 ปี)"] = 0;
            object2["วัยผู้ใหญ่ตอนต้น (26-35 ปี)"] = 0;
            object2["วัยผู้ใหญ่ตอนปลาย (36-45 ปี)"] = 0;
            object2["วัยกลางคน (46-60 ปี)"] = 0;
            object2["วัยสูงอายุ (61-100 ปี)"] = 0;
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                var yearOfBirth = childData.birthDate.split("/")[2];
                var currentYear = (new Date()).getFullYear();
                var age = currentYear-yearOfBirth;
                if (age <= 18) {
                    object2["วัยเด็ก (0-18 ปี)"]++;
                } else if (age > 18 && age <= 25) {
                    object2["วัยรุ่น (19-25 ปี)"]++;
                } else if (age > 25 && age <= 35) {
                    object2["วัยผู้ใหญ่ตอนต้น (26-35 ปี)"]++;
                } else if (age > 35 && age <= 45) {
                    object2["วัยผู้ใหญ่ตอนปลาย (36-45 ปี)"]++
                } else if (age > 45 && age <= 60) {
                    object2["วัยกลางคน (46-60 ปี)"]++;
                } else if (age > 60 && age <= 100) {
                    object2["วัยสูงอายุ (61-100 ปี)"]++;
                }
                ageRangeSum++;
            });
            object2["รวมทั้งสิ้น"] = ageRangeSum;
            generateAgeRangeReport(object2, ageRangeSum);

            var ageRangeSexSum = 0;
            var object3 = {};
            object3["วัยเด็ก (0-18 ปี)"] = {male: 0, female: 0};
            object3["วัยรุ่น (19-25 ปี)"] = {male: 0, female: 0};
            object3["วัยผู้ใหญ่ตอนต้น (26-35 ปี)"] = {male: 0, female: 0};
            object3["วัยผู้ใหญ่ตอนปลาย (36-45 ปี)"] = {male: 0, female: 0};
            object3["วัยกลางคน (46-60 ปี)"] = {male: 0, female: 0};
            object3["วัยสูงอายุ (61-100 ปี)"] = {male: 0, female: 0};
            object3["รวมทั้งสิ้น"] = {male: 0, female: 0};
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                var yearOfBirth = childData.birthDate.split("/")[2];
                var currentYear = (new Date()).getFullYear();
                var age = currentYear-yearOfBirth;
                var sex = childData.gender;
                if (age <= 18) {
                    if (sex == "เพศชาย") {
                        object3["วัยเด็ก (0-18 ปี)"].male++;
                        object3["รวมทั้งสิ้น"].male++;
                    } else {
                        object3["วัยเด็ก (0-18 ปี)"].female++;
                        object3["รวมทั้งสิ้น"].female++;
                    }
                } else if (age > 18 && age <= 25) {
                    if (sex == "เพศชาย") {
                        object3["วัยรุ่น (19-25 ปี)"].male++;
                        object3["รวมทั้งสิ้น"].male++;
                    } else {
                        object3["วัยรุ่น (19-25 ปี)"].female++;
                        object3["รวมทั้งสิ้น"].female++;
                    }
                } else if (age > 25 && age <= 35) {
                    if (sex == "เพศชาย") {
                        object3["วัยผู้ใหญ่ตอนต้น (26-35 ปี)"].male++;
                        object3["รวมทั้งสิ้น"].male++;
                    } else {
                        object3["วัยผู้ใหญ่ตอนต้น (26-35 ปี)"].female++;
                        object3["รวมทั้งสิ้น"].female++;
                    }
                } else if (age > 35 && age <= 45) {
                    if (sex == "เพศชาย") {
                        object3["วัยผู้ใหญ่ตอนปลาย (36-45 ปี)"].male++;
                        object3["รวมทั้งสิ้น"].male++;
                    } else {
                        object3["วัยผู้ใหญ่ตอนปลาย (36-45 ปี)"].female++;
                        object3["รวมทั้งสิ้น"].female++;
                    }
                } else if (age > 45 && age <= 60) {
                    if (sex == "เพศชาย") {
                        object3["วัยกลางคน (46-60 ปี)"].male++;
                        object3["รวมทั้งสิ้น"].male++;
                    } else {
                        object3["วัยกลางคน (46-60 ปี)"].female++;
                        object3["รวมทั้งสิ้น"].female++;
                    }
                } else if (age > 60 && age <= 100) {
                    if (sex == "เพศชาย") {
                        object3["วัยสูงอายุ (61-100 ปี)"].male++;
                        object3["รวมทั้งสิ้น"].male++;
                    } else {
                        object3["วัยสูงอายุ (61-100 ปี)"].female++;
                        object3["รวมทั้งสิ้น"].female++;
                    }
                }
                ageRangeSexSum++;
            });

            generateAgeRangeSexReport(object3, ageRangeSexSum);
        });
    } else if (element.options[element.selectedIndex].text == "ผู้ใช้งานส่งใบรับประกัน") {
        getWarrantyWithAge();
    } else if (element.options[element.selectedIndex].text == "ผู้ใช้งานส่งซ่อมสินค้า") {
        getHistoryWithAge();
    }
}

function clearTemplate() {
    var tableSection = document.getElementById('table-section');
    tableSection.innerHTML = "";
}

function createTableHeader(withTitle) {
    var titleElement = document.createElement("p");
    titleElement.id = withTitle;
    var titleNode = document.createTextNode(withTitle);
    titleElement.appendChild(titleNode);
    var tableSection = document.getElementById('table-section');
    tableSection.appendChild(titleElement);
}

function generateUserReport(object1, sum) {
    var tableSection = document.getElementById('table-section');
    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);


    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th1 = document.createElement('TH');
    th1.width = '100';
    th1.appendChild(document.createTextNode("จำนวนผู้ใช้งาน"));
    tr.appendChild(th1);

    for (var i = 0; i < Object.keys(object1).length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var j = 0; j < 6; j++) {
            var td = document.createElement('TD');
            td.width = '100';
            if (j == 0) {
                td.appendChild(document.createTextNode(Object.keys(object1)[i]));
            } else if (j == 1) {
                td.appendChild(document.createTextNode(object1[Object.keys(object1)[i]]))
            } else if (j ==2) {
                td.appendChild(document.createTextNode("คน"));
            } else if (j == 3) {
                td.appendChild(document.createTextNode("คิดเป็น"));
            } else if (j == 4) {
                var percent = (object1[Object.keys(object1)[i]]/sum*100).toPrecision(3);
                td.appendChild(document.createTextNode(percent));
            } else {
                td.appendChild(document.createTextNode("%"));
            }
            tr.appendChild(td);
        }
    }

    tableSection.appendChild(table);
}

function generateAgeRangeReport(object2, sum) {
    var tableSection = document.getElementById('table-section');
    tableSection.setAttribute("style","overflow-x:hidden;overflow-y:auto");

    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);


    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th1 = document.createElement('TH');
    th1.width = '100';
    th1.appendChild(document.createTextNode("ช่วงอายุของผู้ใช้งาน"));
    tr.appendChild(th1);

    for (var i = 0; i < Object.keys(object2).length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var j = 0; j < 6; j++) {
            var td = document.createElement('TD');
            td.width = '50';
            if (j == 0) {
                td.appendChild(document.createTextNode(Object.keys(object2)[i]));
            } else if (j == 1) {
                td.appendChild(document.createTextNode(object2[Object.keys(object2)[i]]))
            } else if (j == 2) {
                td.appendChild(document.createTextNode("คน"));
            } else if (j == 3) {
                td.appendChild(document.createTextNode("คิดเป็น"));
            } else if (j == 4) {
                var percent = (object2[Object.keys(object2)[i]]/sum*100).toPrecision(3);
                td.appendChild(document.createTextNode(percent));
            } else if (j == 5) {
                td.appendChild(document.createTextNode("%"));
            }
            tr.appendChild(td);
        }
    }

    tableSection.appendChild(table);
}

function generateAgeRangeSexReport(object3, sum) {
    var tableSection = document.getElementById('table-section');
    tableSection.setAttribute("style","overflow-x:hidden;overflow-y:auto");

    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);


    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th1 = document.createElement('TH');
    th1.width = '100';
    th1.appendChild(document.createTextNode("ช่วงอายุของผู้ใช้งาน"));
    tr.appendChild(th1);
    var th2 = document.createElement('TH');
    th2.width = '100';
    th2.colSpan = 2;
    th2.appendChild(document.createTextNode("เพศหญิง"));
    tr.appendChild(th2);
    var th3 = document.createElement('TH');
    th3.width = '100';
    th3.colSpan = 2;
    th3.appendChild(document.createTextNode("เพศชาย"));
    tr.appendChild(th3);

    for (var i = 0; i < Object.keys(object3).length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var j = 0; j < 5; j++) {
            var td = document.createElement('TD');
            td.width = '100';
            if (j == 0) {
                td.appendChild(document.createTextNode(Object.keys(object3)[i]));
            } else if (j == 1) {
                var female = object3[Object.keys(object3)[i]].female;
                td.appendChild(document.createTextNode( (female/sum*100).toPrecision(3) ));
            } else if (j == 2) {
                td.appendChild(document.createTextNode("%"));
            } else if (j == 3) {
                var male = object3[Object.keys(object3)[i]].male;
                td.appendChild(document.createTextNode( (male/sum*100).toPrecision(3) ));
            } else if (j == 4) {
                td.appendChild(document.createTextNode("%"));
            } else if (j == 5) {

            }
            tr.appendChild(td);
        }
    }

    tableSection.appendChild(table);
}