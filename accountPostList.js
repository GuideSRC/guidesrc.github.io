var postList = [];

function addPost(name, by, byStaff = false, thumbnail = "media/NoThumbnail.png", link = "javascript:alert('Sorry! This post is unavailable.');", verified = false) {
    $("#postLoader").hide();

    if (verified) {
        $("#postList").append(`
            <a class="hidden">
                <div class="item postItem">
                    <div class="itemThumbnailHolder">
                        <img src="media/NoThumbnail.png" class="itemThumbnail" />
                    </div>
                    <h2 class="cutOff"><span class="itemTitle">Loading...</span> <i class="material-icons">verified_user</i></h2>
                    <span class="postByPrefix"></span><span class="postBy">Loading...</span>
                </div>
            </a>
        `);
    } else {
        $("#postList").append(`
            <a class="hidden">
                <div class="item postItem">
                    <div class="itemThumbnailHolder">
                        <img src="media/NoThumbnail.png" class="itemThumbnail" />
                    </div>
                    <h2 class="cutOff"><span class="itemTitle">Loading...</span></h2>
                    <span class="postByPrefix"></span><span class="postBy">Loading...</span>
                </div>
            </a>
        `);
    }

    $("#postList").children().last().find(".itemTitle").text(name);
    $("#postList").children().last().find(".postByPrefix").text("By ");
    $("#postList").children().last().find(".postBy").text(by);
    
    if (byStaff) {
        $("#postList").children().last().find(".postBy").css("color", "#27ef70");
    }

    $("#postList").children().last().find("img").attr("src", thumbnail);
    $("#postList").find("a").last().attr("href", link);
}

function showAll() {
    $("#postList").html("");

    $("#postLoader").show();

    firebase.database().ref("posts").orderByChild("uid").equalTo(currentUid).on("value", function(snapshot) {
        postList = [];

        snapshot.forEach(function(childSnapshot) {
            postList.unshift(childSnapshot.val());
            postList[0]["key"] = childSnapshot.key;
        });

        $("#postList").html("");

        if (postList.length == 0) {
            $("#postLoader").hide();
            $("#postList").html("<h3 class='center'>You don't have any posts.</h3>");
        } else {
            for (var i = 0; i < postList.length; i++) {
                if (postList[i]["by"] == undefined) {
                    addPost(postList[i]["title"], "Anonymous", postList[i]["thumbnail"], "post.html?play=" + postList[i]["key"], postList[i]["verified"]);
                } else {
                    addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["thumbnail"], "post.html?play=" + postList[i]["key"], postList[i]["verified"]);
                }
            }
        }
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (currentUid != null) {
        showAll();
    }
});