/**
 * Created by Jaruwit on 12/2/2017 AD.
 */

function generateTable(reportType, dictionary, sum, monthName) {
    var tableTitle;
    var p = document.createElement("p");
    p.id = "tableTitle";
    console.log(sum);
    if (sum <= 0) {
        tableTitle = "ไม่พบข้อมูล";
    } else if (reportType == ReportType.Warranty) {
        if (monthName == "" || typeof  monthName === 'undefined') {
            tableTitle = document.createTextNode("รายงานสินค้าที่มีการส่งซ่อมของปี 2017");
        } else {
            tableTitle = document.createTextNode("รายงานประเภทสินค้าที่มีการส่งใบรับประกันของเดือน" + monthName);
        }
    } else if (reportType == ReportType.History) {
        if (monthName == "" || typeof  monthName === 'undefined') {
            tableTitle = document.createTextNode("รายงานประเภทสินค้าที่มีการส่งใบรับประกันปี 2017");
        } else {
            tableTitle = document.createTextNode("รายงานประเภทสินค้าที่ส่งซ่อมของเดือน" + monthName);
        }
    }
    p.append(tableTitle);
    var tableSection = document.getElementById('table-section');
    tableSection.innerHTML = "";
    tableSection.appendChild(p);

    //Create table if there is data
    if (sum <= 0) {
        return;
    }


    var table = document.createElement('TABLE');

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    if (monthName != null) {
        var th1 = document.createElement('TH');
        th1.width = '100';
        th1.appendChild(document.createTextNode("ประเภทสินค้า"));
        tr.appendChild(th1);
    }


    for (var i = 0; i < Object.keys(dictionary).length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 6; j++) {
            var td = document.createElement('TD');
            td.width = '100';
            if (j == 0) {
                td.appendChild(document.createTextNode(Object.keys(dictionary)[i]));
            } else if (j == 1) {
                td.appendChild(document.createTextNode(dictionary[Object.keys(dictionary)[i]]))
            } else if (j == 2) {
                monthName == null ? td.appendChild(document.createTextNode("คน")) : td.appendChild(document.createTextNode("เครื่อง "));
            } else if (j == 3) {
                td.appendChild(document.createTextNode("คิดเป็น"));
            } else if (j == 4) {
                var percent = (dictionary[Object.keys(dictionary)[i]]/sum*100).toPrecision(3);
                td.appendChild(document.createTextNode(percent));
            } else {
                td.appendChild(document.createTextNode("%"));
            }
            tr.appendChild(td);
        }
    }
    tableSection.appendChild(table);
}