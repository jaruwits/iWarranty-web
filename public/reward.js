/**
 * Created by Jaruwit on 11/12/2017 AD.
 */
var dbRef = firebase.database().ref('Promotions');


function openUploadWidget() {
    $.cloudinary.config({ cloud_name: 'dtqcoxdoj', api_key: 'y3mvrxue'});
    cloudinary.openUploadWidget({ cloud_name: 'dtqcoxdoj', upload_preset: 'y3mvrxue', tags: ['cgal']},
        function(error, result) {
            if(error) console.log(error);
            //NO Error

            var id = result[0].public_id;
            var pictureJSON = {
                "pictureId": id,
                "added_at": firebase.database.ServerValue.TIMESTAMP
            };
            dbRef.push(pictureJSON);

        });

}

function processImage(id) {
    var options = {
        client_hints: true,
    };
    return '<img src="'+ $.cloudinary.url(id, options) +'" style="width: 100%; height: auto"/>';
}

function onPageLoad() {
    dbRef.once('value').then(function (snapshot) {
        var i = 0;
        snapshot.forEach(function (childSnapShot) {
            var childData = childSnapShot.val();
            var cl = cloudinary.Cloudinary.new( { cloud_name: "dtqcoxdoj"});
            cl.fromDocument();

            var table = document.getElementById('mainTable');
            var newRow = table.insertRow(table.rows.length);

            var actionCell = newRow.insertCell(0);
            var imgCell = newRow.insertCell(0);
            var noCell = newRow.insertCell(0);

            var btn = document.createElement('input');
            btn.type = "button";
            btn.value = "DELETE";
            btn.onclick = function () {
                writeData(history.serialNumber)
            }
            actionCell.append(btn);

            noCell.innerHTML = i+1;
            imgCell.innerHTML = cl.imageTag(childData.pictureId).transformation().crop("fit").width(300).toHtml();
        });
    });

}