var database = firebase.database();

var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    database.ref('userWeb').orderByChild('username').equalTo(username).once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.password == password) {
                alert("ยินดีต้อนรับเข้าสู่ระบบ");
                window.location = "home.html"; // Redirecting to other page.
                sessionStorage.setItem('username', username);
                return false;
            } else {
                attempt--;// Decrementing by one.
                alert("คุณสามารถกรอกผิดได้อีก " + attempt + "ครั้ง");
                // Disabling fields after 3 attempts.
                if (attempt == 0) {
                    document.getElementById("username").disabled = true;
                    document.getElementById("password").disabled = true;
                    document.getElementById("login").disabled = true;
                    return false;
                }
            }
        });
    });
}