/**
 * Name: Scroll Lock
 * Version: 1.0
 * Author: headzoo
 *
 * Provides a button which stops the main page from scrolling.
 */
(function() {
    var active     = false;
    var stylesheet = new $stylesheet("scroll-lock-styles");
    
    function addStylesheet() {
        stylesheet.add("#scroll-lock-btn", {
            "display": "inline-block",
            "cursor": "pointer"
        }).add(".scroll-lock-indicator-active::after", {
            "content": '"\\2022"',
            "margin-left": "8px",
            "color": "#00FF00"
        }).add(".scroll-lock-indicator-inactive::after", {
            "content": '"\\2022"',
            "margin-left": "8px",
            "color": "#aaa"
        }).append();
    }
    
    $chat.on("loaded", function() {
        addStylesheet();
        
        var btn = $('<button />', {
            "id": "scroll-lock-btn",
            "class": "btn btn-default btn-sm scroll-lock-indicator-inactive",
            "html": '<span class="glyphicon glyphicon-lock"></span> Scroll Lock'
        });
        $("#scroll-lock-btn").remove();
        $(".chatbuttons > .btn-group").append(btn);
        
        btn.on("click", function() {
            if (active) {
                active = false;
                $("body").css("overflow", "auto");
                btn.removeClass("scroll-lock-indicator-active")
                    .addClass("scroll-lock-indicator-inactive");
            } else {
                active = true;
                $("body").css("overflow", "hidden");
                btn.addClass("scroll-lock-indicator-active")
                    .removeClass("scroll-lock-indicator-inactive");
                window.scrollTo(0, 0);
                scrollChat();
            }
        });
    });
})();