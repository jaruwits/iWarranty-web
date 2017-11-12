/**
 * Created by Jaruwit on 11/12/2017 AD.
 */
var database = firebase.database();


function openUploadWidget() {
    $.cloudinary.config({ cloud_name: 'dtqcoxdoj', api_key: 'y3mvrxue'});
    cloudinary.openUploadWidget({ cloud_name: 'dtqcoxdoj', upload_preset: 'y3mvrxue', tags: ['cgal']},
        function(error, result) {
            if(error) console.log(error);
            // If NO error, log image data to console
            var id = result[0].public_id;
            console.log(processImage(id));
        });

}

function processImage(id) {
    var options = {
        client_hints: true,
    };
    return '<img src="'+ $.cloudinary.url(id, options) +'" style="width: 100%; height: auto"/>';
}

function onPageLoad() {
    var cl = cloudinary.Cloudinary.new( { cloud_name: "dtqcoxdoj"});
    cl.fromDocument();
    //document.getElementById("demo").innerHTML =  cl.imageTag("d6gkk1mjusza30vzjvf8").toHtml();
}