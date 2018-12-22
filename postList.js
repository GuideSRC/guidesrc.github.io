var postList = [];

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function addPost(name, by, byStaff = false, image = "media/NoImage.png", link = "javascript:alert('Sorry! This post is unavailable.');", verified = false) {
    $("#postLoader").hide();

    if (verified) {
        $("#postList").append(`
            <a class="hidden">
                <div class="item postItem">
                    <div class="itemImageHolder">
                        <img src="media/NoImage.png" class="itemImage" />
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
                    <div class="itemImageHolder">
                        <img src="media/NoImage.png" class="itemImage" />
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

    $("#postList").children().last().find("img").attr("src", image);
    $("#postList").find("a").last().attr("href", link);
}

function filter(type) {
    $(".pill").removeClass("selected");
    $("select.pill").val("none");
    $(".pill[filter=" + type + "]").addClass("selected");

    $(".search").val("");
    $("#postList").html("");

    $("#postLoader").show();

    if (type == "featured") {
        $("#postList").html("");

        firebase.database().ref("posts").orderByChild("metrics/likes").limitToLast(12).on("value", function(snapshot) {
            postList = [];

            snapshot.forEach(function(childSnapshot) {
                postList.unshift(childSnapshot.val());
                postList[0]["key"] = childSnapshot.key;
            });

            for (var i = 0; i < postList.length; i++) {
                if (postList[i]["by"] == undefined) {
                    addPost(postList[i]["title"], "Anonymous", postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                } else {
                    addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                }
            }
        });

        firebase.database().ref("posts").limitToLast(12).on("value", function(snapshot) {
            postList = [];

            snapshot.forEach(function(childSnapshot) {
                postList.unshift(childSnapshot.val());
                postList[0]["key"] = childSnapshot.key;
            });

            for (var i = 0; i < postList.length; i++) {
                if (postList[i]["by"] == undefined) {
                    addPost(postList[i]["title"], "Anonymous", postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                } else {
                    addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                }
            }
        });
    } else if (type == "random") {
        firebase.database().ref("posts").orderByChild("metrics/likes").equalTo(Math.floor(Math.random() * 5)).limitToLast(12).on("value", function(snapshot) {
            postList = [];

            snapshot.forEach(function(childSnapshot) {
                postList.unshift(childSnapshot.val());
                postList[0]["key"] = childSnapshot.key;
            });

            $("#postList").html("");

            for (var i = 0; i < postList.length; i++) {
                if (postList[i]["by"] == undefined) {
                    (function(i) {
                        setTimeout(function() {
                            addPost(postList[i]["title"], "Anonymous", postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                        }, Math.floor(Math.random() * 15));
                    })(i);
                } else {
                    (function(i) {
                        setTimeout(function() {
                            addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                        }, Math.floor(Math.random() * 15));
                    })(i);
                }
            }
        });
    } else {
        var lister = null;

        if (type == "likes") {
            lister = firebase.database().ref("posts").orderByChild("metrics/likes").limitToLast(24);
        } else if (type == "new") {
            lister = firebase.database().ref("posts").limitToLast(24);
        } else if (type == "verified") {
            lister = firebase.database().ref("posts").orderByChild("verified").equalTo(true).limitToLast(24);
        }

        lister.on("value", function(snapshot) {
            postList = [];

            snapshot.forEach(function(childSnapshot) {
                postList.unshift(childSnapshot.val());
                postList[0]["key"] = childSnapshot.key;
            });

            $("#postList").html("");

            for (var i = 0; i < postList.length; i++) {
                if (postList[i]["by"] == undefined) {
                    addPost(postList[i]["title"], "Anonymous", postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                } else {
                    addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                }
            }
        });
    }
}

function categorise(topic) {
    if (topic == "none") {
        filter("featured");
    } else {
        $(".pill").removeClass("selected");
        $("select.pill").addClass("selected");

        $(".search").val("");
        $("#postList").html("");

        $("#postLoader").show();

        firebase.database().ref("posts").limitToLast(12).on("value", function(snapshot) {
            postList = [];

            snapshot.forEach(function(childSnapshot) {
                postList.unshift(childSnapshot.val());
                postList[0]["key"] = childSnapshot.key;
            });

            $("#postList").html("");

            if (postList.length == 0) {
                $("#postLoader").hide();
                $("#postList").html("<h3 class='center'>Oops! Couldn't find that post.</h3>");
            } else {
                for (var i = 0; i < postList.length; i++) {
                    if (postList[i]["by"] == undefined) {
                        addPost(postList[i]["title"], "Anonymous", postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                    } else {
                        addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                    }
                }
            }
        });
}
}

function search(query) {
    $(".pill").removeClass("selected");
    $("select.pill").val("none");

    $("#postList").html("");

    $("#postLoader").show();

    firebase.database().ref("posts").orderByChild("title").startAt(query).endAt(query + "\uf8ff").limitToLast(24).on("value", function(snapshot) {
        postList = [];

        snapshot.forEach(function(childSnapshot) {
            postList.unshift(childSnapshot.val());
            postList[0]["key"] = childSnapshot.key;
        });

        $("#postList").html("");

        if (postList.length == 0) {
            $("#postLoader").hide();
            $("#postList").html("<h3 class='center'>Oops! Couldn't find that post.</h3>");
        } else {
            for (var i = postList.length - 1; i >= 0; i--) {
                if (postList[i]["by"] == undefined) {
                    addPost(postList[i]["title"], "Anonymous", postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                } else {
                    addPost(postList[i]["title"], postList[i]["by"].substring(0, 30), postList[i]["byStaff"], postList[i]["image"], "post.html?view=" + postList[i]["key"], postList[i]["verified"]);
                }
            }
        }
    });
}

function performSearch(query = "") {
    if (query == "") {
        filter("featured");
    } else {
        search(toTitleCase(query));
    }
}

$(function() {
    filter("featured");
});

$("select.pill").on("change", function() {
    categorise($(this).children("option:selected").val());
});

$("#searchBar").keypress(function(e) {
    if ((event.keyCode ? event.keyCode : event.which) == 13) {
        performSearch($(this).val());
    }
});