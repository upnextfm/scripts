/**
 * Name: Hide Bots
 * Version: 1.3
 * Author: headzoo
 * 
 * Hides site bots from the users list. Refresh your page after
 * installing.
 * 
 * Note: This only hides the bots run by the site. Bots run by
 * individual users are not hidden, but you can add their name
 * to the `bots` array to hide them too.
 */
(function() {
    var bots = [
        "PieNudesBot"
    ];
    var hidden = [];
    
    $chat.on("user_count", function(e, data) {
        data.count = data.count - hidden.length;
    });
    
    $chat.on("user_join", function(e, data) {
        if (data.meta.is_bot || bots.indexOf(data.name) != -1) {
            $chat.ignore(data.name);
            hidden.push(data.name);
            e.cancel();
        }
    });
    
    $chat.on("user_leave", function(e, data) {
        var index = hidden.indexOf(data.name);
        if (index != -1) {
            $chat.unignore(data.name);
            hidden.splice(index, 1);
        }
    });
    
    $chat.on("loaded", function() {
        $(".userlist_item_is_bot").remove();
        $each(bots, function(bot) {
            $(".userlist_item_" + bot).remove();
        });
    });
})();