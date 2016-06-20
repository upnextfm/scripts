/**
 * Script: Last Seen
 * Version: 1.0
 * Author: headzoo
 * 
 * Creates a /seen command which displays the last time a user was seen as well
 * as the channel they were seen in. For example "/seen headzoo".
 */
(function() {
    var seen  = {};
    var regex = new RegExp('^/seen\\s+([^\\s]+)');
    
    // Save the data to the database once a minute.
    setTimeout(function() {
        $store.database.set("last_seen", seen);
    }, 60000);
    
    $store.database.get("last_seen", {}, function(err, data) {
        if (typeof data !== "object" || data == null) {
            data = {};
        }
        seen = data;
    });
    
    $api.on("receive", function(e, data) {
        seen[data.username.toLowerCase()] = {
            t: Date.now(),
            c: $channel.name
        };
        
        var matches = data.msg_clean.match(regex);
        if (matches !== null) {
            var username = matches[1].toLowerCase();
            if (seen[username] !== undefined) {
            
                var date = new Date(seen[username].t);
                $api.send(sprintf(
                    "[#FFFFFF]%s was last seen in the %s channel on %s[/#]",
                    matches[1],
                    seen[username].c,
                    date.toString()
                ));
            } else {
                $api.send("[#FFFFFF]" + matches[1] + " has not been seen in a while.[/#]");
            }
        }
    });
})();