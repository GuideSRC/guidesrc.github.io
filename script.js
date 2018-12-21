function dialog(title, content, buttons = [{text: "Close", onclick: "closeDialog();", type: "primary"}], allowEscape = true) {
    $(".dialog").html(`
        <div class="dialogTitle"></div>
        <div class="dialogContent"></div>
        <div class="dialogActions"></div>
    `);

    $(".dialogTitle").text(title);
    $(".dialogContent").html(content);

    for (var i = 0; i < buttons.length; i++) {
        $(".dialogActions").html(
            $(".dialogActions").html() +
            "<button" +
            (
                buttons[i].type == "secondary" ?
                " class='secondary'" :
                (
                    buttons[i].type == "bad" ?
                    " class='bad'" :
                    (
                        buttons[i].type == "reallyBad" ?
                        " class='reallyBad'" :
                        (
                            buttons[i].type == "highlight" ?
                            " class='highlight'" :
                            ""
                        )
                    )
                )
            ) +
            " onclick='" +
            buttons[i].onclick +
            "'>" +
            buttons[i].text +
            "</button>"
        );
    }

    if (allowEscape) {
        $(".dialogBackground").attr("onclick", "closeDialog();");
    } else {
        $(".dialogBackground").attr("onclick", "");
    }

    $(".dialogBackground").fadeIn();
    $(".dialog").fadeIn();
}

function closeDialog() {
    $(".dialogBackground").fadeOut();
    $(".dialog").fadeOut();
}

$(function() {
    $("*[import]").each(function() {
        if (!window.location.href.startsWith("file:///")) {
            var thisPassOn = this;

            $.ajax({
                url: $(this).attr("import"),
                error: function() {
                    $(thisPassOn).html("Could not load associated information.");
                }
            }).done(function(data) {
                $(thisPassOn).html(data);
            });
        } else {
            $(this).html("<em>Content will go here at run-time: " + $(this).attr("import") + "</em>");
        }
    });

    $("*[markdown]").each(function() {
        if (!window.location.href.startsWith("file:///")) {
            var thisPassOn = this;

            $.ajax({
                url: $(this).attr("markdown"),
                error: function() {
                    $(thisPassOn).html("Could not load associated information.");
                }
            }).done(function(data) {
                $(thisPassOn).html(new showdown.Converter().makeHtml(data));
            });
        } else {
            $(this).html("<em>Content will go here at run-time: " + $(this).attr("markdown") + "</em>");
        }
    });

    setInterval(function() {
        $("*[markdownrf]").each(function() {
            if (!window.location.href.startsWith("file:///")) {
                var thisPassOn = this;

                $.ajax({
                    url: $(this).attr("markdownrf"),
                    error: function() {
                        $(thisPassOn).html("Could not load associated information.");
                    }
                }).done(function(data) {
                    if ($(thisPassOn).html() != new showdown.Converter().makeHtml(data)) {
                        $(thisPassOn).html(new showdown.Converter().makeHtml(data));
                    }
                });
            } else {
                $(this).html("<em>Content will go here at run-time: " + $(this).attr("markdownrf") + "</em>");
            }
        });
    }, 1000);

    setInterval(function() {
        $(".loader").css("color", "#dbdbdb");
    }, 4000);

    setTimeout(function() {
        setInterval(function() {
            $(".loader").css("color", "#f2f2f2");
        }, 4000);

        $(".loader").css("color", "#f2f2f2");
    }, 2000);

    $(".loader").css("color", "#dbdbdb");
});