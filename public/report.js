/**
 * Created by Jaruwit on 11/13/2017 AD.
 */

database = firebase.database();

function onReportCategoryChange() {

    var div = document.getElementById("form-group");
    var element = document.getElementById("select");

    if (element.options[element.selectedIndex].text == "ใบรับประกันสินค้า"
        || element.options[element.selectedIndex].text == "สินค้าที่ส่งซ่อม") {
        if (div.contains(document.getElementById("yearSelect"))) {
            return
        }
        //Create year select options
        var yearOptions = ["2017"];
        var yearSelect = document.createElement("select");
        yearSelect.id = "yearSelect";
        div.insertBefore(yearSelect, div.children[1]);
        for (var i=0; i<yearOptions.length; i++) {
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
        for (var i=0; i<monthOptions.length; i++) {
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
    if (element.options[element.selectedIndex].text == "ใบรับประกันสินค้า") {
        //gen report
        database.ref('Warranties').once('value').then(function (snapshot) {
            var dictionary = {};
            var sum = 0;
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
                    typeof dictionary[childData.type] === 'undefined' ? dictionary[childData.type] = 1 : dictionary[childData.type]++;
                    sum++;
                }

            });
            generateTable(ReportType.Warranty, dictionary, sum);
            console.log(dictionary);
            console.log(sum);
        });
    } else if (element.options[element.selectedIndex].text == "สินค้าที่ส่งซ่อม") {
        //
    } else {

    }
}

var ReportType = {
    Warranty: 1,
    History: 2,
    UserCount: 3
}

function generateTable(reportType, dictionary, sum) {
    if (reportType == ReportType.Warranty) {
        var tableSection = document.getElementById('table-section');
        tableSection.innerHTML = "";
        var tableTitle = document.createTextNode("รายงานประเภทสินค้าที่มีการส่งใบรับประกันเดือนธันวาคม");
        tableSection.appendChild(tableTitle);

        var table = document.createElement('TABLE');

        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);

        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        var th1 = document.createElement('TH');
        th1.width = '100';
        th1.appendChild(document.createTextNode("ประเภทสินค้า"));
        tr.appendChild(th1);

        for (var i = 0; i < Object.keys(dictionary).length; i++) {
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);

            for (var j = 0; j < 3; j++) {
                var td = document.createElement('TD');
                td.width = '100';
                if (j == 0) {
                    td.appendChild(document.createTextNode(Object.keys(dictionary)[i]));
                } else if (j == 1) {
                    td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]))
                } else {
                    td.appendChild(document.createTextNode("เครื่อง "));
                }

                tr.appendChild(td);
            }
        }
        tableSection.appendChild(table);
    }
}