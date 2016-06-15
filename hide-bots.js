/**
 * Script: Hide Bots
 * Version: 1.0
 * Author: headzoo
 * 
 * Hides channel bots from the users list. Refresh your page after
 * installing.
 */
(function() {
    var bots = [];
    
    $api.on("user_count", function(e, data) {
        data.count = data.count - bots.length;
    });
    
    $api.on("user_join", function(e, data) {
        if (data.meta.is_bot) {
            bots.push(data.name);
            e.cancel();
        }
    });
    
    $api.on("user_leave", function(e, data) {
        var index = bots.indexOf(data.name);
        if (index != -1) {
            bots.splice(index, 1);
        }
    });
    
    $api.on("loaded", function() {
        $(".userlist_item_is_bot").remove();
    });
})();