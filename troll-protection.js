/**
 * Script: Troll Protection
 * Version: 1.1
 *
 * Prevents trolls from showing images and emotes in the channel, and
 * converts their messages to lower case letters.
 *
 * To use, copy this script into the Options->Scripting box, and then
 * REFRESH YOUR BROWSER. When you click on a name in the user list a
 * button appears to turn troll protection on or off for that user.
 */
(function() {
    var troll_settings = {
        no_images: true,
        no_emotes: true,
        no_upper_case: true
    };
    
    var trolls = localStorage.getItem("trolls");
    if (trolls) {
        trolls = JSON.parse(trolls);
    } else {
        trolls = [];
    }
    
    var no_queue = localStorage.getItem("trolls_no_queue");
    if (no_queue) {
        no_queue = JSON.parse(no_queue);
    } else {
        no_queue = [];
    }
    
    $api.on("profile_menu", function(e, menu) {
        var name      = menu.data("name").toLowerCase();
        var btn_group = menu.find(".btn-group-vertical:first");
        var btn = $("<button/>")
            .addClass("btn btn-xs btn-default btn-stop-trolling")
            .appendTo(btn_group);
        
        // Add a button to user profile menus to turn trolling protection on and off.
        btn.text(trolls.indexOf(name) == -1 ? "Troll Protection On" : "Troll Protection Off")
            .click(function () {
                var index = trolls.indexOf(name);
                if (index == -1) {
                    trolls.push(name);
                    btn.text("Troll Protection Off");
                } else {
                    trolls.splice(index, 1);
                    btn.text("Troll Protection On");
                }
                
                localStorage.setItem("trolls", JSON.stringify(trolls));
            });
        
        // Gives mods a button to stop the user from adding to the queue.
        if ($user.rank >= 2) {
            var btnq = $("<button/>")
                .addClass("btn btn-xs btn-default btn-stop-trolling-playlist")
                .appendTo(btn_group);
            btnq.text(no_queue.indexOf(name) == -1 ? "No Queue On" : "No Queue Off")
                .click(function() {
                    var index = no_queue.indexOf(name);
                    if (index == -1) {
                        no_queue.push(name);
                        btnq.text("No Queue Off");
                    } else {
                        no_queue.splice(index, 1);
                        btnq.text("No Queue On");
                    }
                    
                    localStorage.setItem("trolls_no_queue", JSON.stringify(no_queue));
                });
        }
    });
    
    // Filter messages from users that have been put in troll prison.
    $api.on("receive", function(e, data) {
        if (trolls.indexOf(data.username.toLowerCase()) !== -1) {
            data.meta.no_emotes = troll_settings.no_emotes;
            if (troll_settings.no_upper_case) {
                data.msg = data.msg.toLowerCase();
            }
            if (troll_settings.no_images) {
                var regex = /<img src="([^"]+)".*\/>/g;
                var match = regex.exec(data.msg);
                while(match != null) {
                    if (match[1].indexOf("/proxy/image?u=") === 0) {
                        match[1] = match[1].replace("/proxy/image?u=", "")
                    }
                    data.msg = data.msg.replace(match[0], match[1]);
                    match = regex.exec(data.msg);
                }
            }
        }
    });
    
    // Stop trolls from queuing songs.
    $api.on("queue", function(e, data) {
        if (no_queue.indexOf(data.item.queueby) != -1) {
            setTimeout(function() {
                $api.dequeueByName(data.item.queueby);
            }, 1000);
        }
    });
})();