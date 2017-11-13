/**
 * Created by Jaruwit on 11/13/2017 AD.
 */

// <select class="form-control" id="select">
//     <option>กรุณาเลือกรายงาน</option>
//     <option>จำนวนผู้ใช้งาน</option>
//     <option>ใบรับประกันสินค้า</option>
//     <option>สินค้าที่ส่งซ่อม</option>
//     </select>

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
        var monthOptions = ["รวมทั้งปี", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        var monthSelect = document.createElement("select");
        monthSelect.id = "monthSelect";
        div.insertBefore(monthSelect, div.children[2]);
        for (var i=0; i<monthOptions.length; i++) {
            var option = document.createElement("option");
            option.value = monthOptions[i];
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
        
    } else if (element.options[element.selectedIndex].text == "สินค้าที่ส่งซ่อม") {
        //
    } else {

    }
}