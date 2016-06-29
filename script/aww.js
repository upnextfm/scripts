/**
 * Name: Aww
 * Version: 1.1
 * Author: headzoo
 * 
 * Creates an /aww command which sends a random cute pictures to the chat room.
 */
(function() {
    var pics = [];
    
    $proxy.getJSON("https://www.reddit.com/r/Awww.json", function(res) {
        $each(res.data.children, function(child) {
            if (child.data.domain == "i.imgur.com") {
                var url = child.data.url.replace(".gifv", ".gif");
                pics.push(url);
            }
        });
    });

    $chat.on("send", function(e, data) {
        if (data.msg.indexOf("/aww") === 0) {
            e.cancel();
            if (pics.length == 0) {
                return $chat.notice("No aww pictures found");
            }
            var pic = pics[Math.floor(Math.random() * pics.length)];
            $chat.send(pic);
        }
    });
})();