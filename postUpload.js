var uploadingPost = false;

function toDataUrl(url, callback) {
    if (url == null) {
        callback(null);
    } else if (url.startsWith("data:")) {
        callback(url);
    } else {
        var xhr = new XMLHttpRequest();

        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
            callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };

        xhr.open("GET", url);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.responseType = "blob";
        xhr.send();
    }
}

function formatDate(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
}

function postUpload() {
    if (!uploadingPost) {
        uploadingPost = true;

        $(".uploadPost").text("Uploading...");
        $(".uploadPost").css({
            backgroundColor: "#7e7e7e",
            color: "black",
            cursor: "default"
        });

        firebase.database().ref("users/" + currentUid + "/_settings/name").once("value", function(snapshot) {
            var name = snapshot.val();

            toDataUrl(
                $("#postImage").val() != "" ?
                    "https://cors-anywhere.herokuapp.com/" + $("#postImage").val()
                :   null
                ,
                function(base64Img) {
                    var newPost = firebase.database().ref("posts").push()

                    console.log(JSON.stringify({
                        title: profanity.clean($("#postTitle").val()),
                        image: base64Img,
                        content: profanity.clean($("#postContent").val()),
                        metrics: {likes: 0},
                        dateAdded: formatDate(new Date()),
                        location: $("#postLocation").val(),
                        uid: currentUid,
                        by: name,
                        byStaff: isStaff(currentUid),
                        verified: isStaff(currentUid)
                    }));
                    
                    newPost.set({
                        title: profanity.clean($("#postTitle").val()),
                        image: base64Img,
                        content: profanity.clean($("#postContent").val()),
                        metrics: {likes: 0},
                        dateAdded: formatDate(new Date()),
                        location: $("#postLocation").val(),
                        uid: currentUid,
                        by: name,
                        byStaff: isStaff(currentUid),
                        verified: isStaff(currentUid)
                    }).then(function() {
                        console.log(newPost);
                        window.location.href = "post.html?view=" + newPost.key;
                    });
                }
            );
        });
    }
}