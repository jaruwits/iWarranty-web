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
            onPageLoad();
        });

}

function onPageLoad() {
    var table = document.getElementById('mainTable');
    table.innerHTML = table.rows[0].innerHTML;
    document.getElementsByClassName('loading')[0].style.visibility = "visible";

    dbRef.orderByChild("added_at").once('value').then(function (snapshot) {
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
                deleteData(childSnapShot)
            }
            actionCell.append(btn);

            noCell.innerHTML = i+=1;
            imgCell.innerHTML = cl.imageTag(childData.pictureId).transformation().crop("fit").width(300).toHtml();
        });
        document.getElementsByClassName('loading')[0].style.visibility = "hidden";
    });

}

function deleteData(pictureSnapshot) {
    pictureSnapshot.ref.remove();
    onPageLoad();
}