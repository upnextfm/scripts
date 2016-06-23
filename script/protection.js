/**
 * Name: Protection
 * Version: 1.9.5
 * Author: headzoo
 *
 * Provides protection against trolls and other nasty users.
 * 
 * Protection settings are configured by clicking Options -> Protection.
 * Click a user's name in the users list and click "Protection" to 
 * guard against that user.
 */
(function() {
    var BUFFER_SIZE    = 15;
    var THROTTLE_LIMIT = 3;
    var TRIM_LENGTH    = 75;
    var DEFAULTS       = {
        no_images       : true,
        no_emotes       : true,
        no_colors       : true,
        no_upper_case   : true,
        throttle        : true,
        trim            : true,
        vote_skip       : false,
        blocked_phrases : ""
    };
    var form_elements = {
        no_images       : null,
        no_emotes       : null,
        no_colors       : null,
        no_upper_case   : null,
        throttle        : null,
        trim            : null,
        vote_skip       : null,
        blocked_phrases : null
    };
    
    var settings = $store.local.get("protection-settings", {});
    if (typeof settings !== "object") {
        $store.local.remove("protection-settings");
        settings = {};
    }
    $each(DEFAULTS, function(val, key) {
        if (settings[key] == undefined) {
            settings[key] = val;
        }
    });
    
    var trolls        = $store.local.get("protection-trolls", []);
    var no_queue      = $store.local.get("protection-no-queue", []);
    var img_regex     = /<img.+?src=[\"'](.+?)[\"'].*?>/g;
    var phrases_split = [];
    var buffer        = [];
    
    // Returns whether the user is the troll list.
    var isTroll = function(name) {
        name = name.replace("@", "");
        return trolls.indexOf(name) !== -1;
    };
    
    // Adds our custom css to the page.
    var addStylesheet = function() {
        $(
            '<style id="us-chat-protection-styles" type="text/css">' +
            '#us-protection-pane .checkbox { padding-top: 0; } ' +
            '#us-protection-pane .checkbox .text-muted { margin: 0 0 0 0; } ' +
            '#us-protection-pane .form-group { margin-bottom: 8px; } ' +
            '.protection-indicator-active::after { content: "\\2022"; margin-left: 8px; color: #00FF00; } ' +
            '.protection-indicator-inactive::after { content: "\\2022"; margin-left: 8px; color: #aaa; } ' +
            '.userlist_item .glyphicon-ban-circle { color: #cc4b4b; padding-right: 2px; } ' +
            '</style>'
        ).appendTo($("head"));
    };
    
    // Removes the protection stylesheet from the page.
    var removeStylesheet = function() {
        $("#us-chat-protection-styles").remove();
    };
    
    // Adds a "Protection" tab to the user options where the protection
    // settings can be configured.
    var addOptions = function() {
        var tab  = $options.makeTab("Protection", "us-protection-tab", "lock");
        var pane = $options.makePane("us-protection-pane", tab);
        var form = pane.form;
    
        var appendForm = function(element) {
            form.append(element);
            return element.form_element;
        };
        
        form.append($('<h4 style="margin-bottom:0;color:#fff;">Troll Settings</h4>'));
        form_elements.no_images = appendForm($options.makeCheckbox(
            "us-protection-settings-no-images",
            "Do not show inline images.",
            "Images will be shown as links."
        ));
        form_elements.no_emotes = appendForm($options.makeCheckbox(
            "us-protection-settings-no-emotes",
            "Do not show emotes.",
            "Emotes will be shown as image links."
        ));
        form_elements.no_colors = appendForm($options.makeCheckbox(
            "us-protection-settings-no-colors",
            "Do not show colors.",
            "Remove colors/gradients from messages."
        ));
        form_elements.no_upper_case = appendForm($options.makeCheckbox(
            "us-protection-settings-no-upper-case",
            "Do not show UPPER CASE text.",
            "Convert all messages to lower case."
        ));
        form_elements.throttle = appendForm($options.makeCheckbox(
            "us-protection-settings-throttle",
            "Throttle messages.",
            "Mute the user when they're writing messages too fast."
        ));
        form_elements.trim = appendForm($options.makeCheckbox(
            "us-protection-settings-trim",
            "Trim long messages.",
            "Trim messages that are ove 75 characters."
        ));
        form_elements.vote_skip = appendForm($options.makeCheckbox(
            "us-protection-settings-vote-skip",
            "Automatically vote skip videos.",
            "Automatically vote to skip any videos played by the user."
        ));
    
        form.append($('<h4 style="margin-bottom:0;color:#fff;">General Settings</h4>'));
        form_elements.blocked_phrases = appendForm($options.makeInput(
            "us-protection-settings-blocked-phrases",
            "Block messages containing",
            "text",
            "Comma separated list of phrases, e.g. \"hamburgers, taco bell, hate\"."
        ));
    
        form_elements.no_images.prop("checked",     settings.no_images);
        form_elements.no_emotes.prop("checked",     settings.no_emotes);
        form_elements.no_colors.prop("checked",     settings.no_colors);
        form_elements.no_upper_case.prop("checked", settings.no_upper_case);
        form_elements.throttle.prop("checked",      settings.throttle);
        form_elements.vote_skip.prop("checked",     settings.vote_skip);
        form_elements.trim.prop("checked",          settings.trim);
        form_elements.blocked_phrases.val(          settings.blocked_phrases);
        
        $options.tabs().append(tab);
        $options.panes().append(pane);
    };
    
    // Removes the "Protection" tab from the user options.
    var removeOptions = function() {
        $("#us-protection-tab").remove();
        $("#us-protection-pane").remove();
    };
    
    // Updates the local 'settings' object to the form values.
    var updateSettings = function() {
        settings.no_images       = form_elements.no_images.is(":checked");
        settings.no_emotes       = form_elements.no_emotes.is(":checked");
        settings.no_colors       = form_elements.no_colors.is(":checked");
        settings.no_upper_case   = form_elements.no_upper_case.is(":checked");
        settings.throttle        = form_elements.throttle.is(":checked");
        settings.vote_skip       = form_elements.vote_skip.is(":checked");
        settings.trim            = form_elements.trim.is(":checked");
        settings.blocked_phrases = form_elements.blocked_phrases.val().trim();
        splitBlockedPhrases();
        $store.local.set("protection-settings", settings);
    };
    
    // Adds the protection button to the given profile menu.
    var setupProfileMenu = function(menu) {
        if (menu.data("protected")) {
            return;
        }
        
        menu.data("protected", true);
        var name = menu.data("name");
        var btn_group = menu.find(".btn-group-vertical:first");
        var btn = $("<button/>")
            .addClass("btn btn-xs btn-default btn-stop-trolling")
            .appendTo(btn_group);
    
        if (!isTroll(name)) {
            btn.addClass("protection-indicator-inactive");
        } else {
            btn.addClass("protection-indicator-active");
            $(".userlist_item_" + name + ":first")
                .addClass("protection-indicator-active");
        }
    
        // Add a button to user profile menus to turn trolling protection on and off.
        btn.text("Protection")
            .click(function () {
                var index = trolls.indexOf(name);
                if (index == -1) {
                    trolls.push(name);
                    $(".userlist_item_" + name + ":first")
                        .addClass("protection-indicator-active");
                    btn.removeClass("protection-indicator-inactive")
                        .addClass("protection-indicator-active");
                } else {
                    trolls.splice(index, 1);
                    $(".userlist_item_" + name + ":first")
                        .removeClass("protection-indicator-active");
                    btn.addClass("protection-indicator-inactive")
                        .removeClass("protection-indicator-active");
                }
            
                $store.local.set("protection-trolls", trolls);
            });
    
        // Gives mods a button to stop the user from adding to the queue.
        if ($user.rank >= 2) {
            var btnq = $("<button/>")
                .addClass("btn btn-xs btn-default btn-stop-trolling-playlist protection-indicator-inactive")
                .appendTo(btn_group);
            btnq.text("Playlist Block")
                .click(function() {
                    var index = no_queue.indexOf(name);
                    if (index == -1) {
                        no_queue.push(name);
                        btnq.removeClass("protection-indicator-inactive")
                            .addClass("protection-indicator-active");
                    } else {
                        no_queue.splice(index, 1);
                        btnq.addClass("protection-indicator-inactive")
                            .removeClass("protection-indicator-active");
                    }
                
                    $store.local.set("protection-no-queue", no_queue);
                });
        }
    };

    // Splits the blocked phrases.
    var splitBlockedPhrases = function() {
        if (settings.blocked_phrases) {
            phrases_split =
                settings.blocked_phrases.toLowerCase().split(",")
                    .map(Function.prototype.call, String.prototype.trim);
        } else {
            phrases_split = [];
        }
    };
    
    // Converts <img/> tags into plain text.
    var filterImages = function(msg) {
        var match = img_regex.exec(msg);
        while(match != null) {
            if (match[1].indexOf("/proxy/image?u=") === 0) {
                match[1] = match[1].replace("/proxy/image?u=", "")
            }
        
            var replacement = '<a href="' + match[1] + '" target="_blank">' + match[1] + '</a>';
            msg   = msg.replace(match[0], replacement);
            match = img_regex.exec(msg);
        }
        
        return msg;
    };
    
    // Removes color codes from the message.
    var filterColors = function(msg) {
        msg = msg.replace(/\[color (#[a-f0-9]{3,6})\](.*?)\[\/color\]/gi, '$2');
        msg = msg.replace(/\[(#[a-f0-9]{3,6})\](.*?)\[\/#\]/gi, '$2');
    
        return msg;
    };
    
    // Trims long messages.
    var filterTrim = function(msg) {
        if (msg.length > TRIM_LENGTH) {
            msg = msg.substr(0, TRIM_LENGTH) + "...";
        }
        return msg;
    };
    
    // Returns whether the given message should be throttled.
    var shouldThrottle = function(msg) {
        var name  = msg.username;
        var count = 0;
        $each(buffer, function(bmsg) {
            if (bmsg.username == name) {
                count++;
            }
        });
        
        return count > THROTTLE_LIMIT;
    };
    
    // Returns whether the message contains a blocked phrase.
    var hasBlockedPhrase = function(msg) {
        var found = false;
        msg = msg.toLowerCase();
        $each(phrases_split, function(phrase) {
            if (msg.indexOf(phrase) != -1) {
                found = true;
                return null;
            }
        });
        
        return found;
    };
    
    // Add profile menu options for each user.
    $api.on("profile_menu", function(e, menu) {
        setupProfileMenu(menu);
        if (isTroll(menu.data("name"))) {
            setTimeout(function() {
                var item = $(".userlist_item_" + menu.data("name") + ":first");
                item.addClass("protection-indicator-active");
            }, 2000);
        }
    });
    
    // Filter messages from users that have been put in troll prison.
    $api.on("receive", function(e, data) {
        buffer.push(data);
        if (buffer.length > BUFFER_SIZE) {
            buffer.shift();
        }
        if (hasBlockedPhrase(data.msg)) {
            return e.cancel();
        }
        if (isTroll(data.username)) {
            if (shouldThrottle(data)) {
                return e.cancel();
            }
            
            data.meta.no_emotes = settings.no_emotes;
            if (settings.no_colors) {
                data.msg = filterColors(data.msg);
            }
            if (settings.no_upper_case) {
                data.msg = data.msg.toLowerCase();
            }
            if (settings.no_images) {
                data.msg = filterImages(data.msg);
            }
            if (settings.trim) {
                data.msg = filterTrim(data.msg);
            }
            
            data.msg = "[#FFFFFF]" + data.msg + "[/#]";
        }
    });
    
    // Vote skip troll videos.
    $api.on("media_change", function(e, data) {
        if (isTroll(data.queueby) && settings.vote_skip) {
            setTimeout(function() {
                $api.skip();
            }, 2000);
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
    
    // Save our settings when the rest of the user options are saved.
    $api.on("user_options_save", updateSettings);
    
    // Might be deleting the script. Clean up after ourselves.
    $api.on("delete_script", function(e, filename) {
        if ($script.filename == filename) {
            $store.local.remove("protection-settings");
            $store.local.remove("protection-trolls");
            $store.local.remove("protection-no-queue");
            $(".btn-stop-trolling").remove();
            $(".btn-stop-trolling-playlist").remove();
            $each(trolls, function(troll) {
                $(".userlist_item_" + troll + ":first")
                    .removeClass("protection-indicator-active");
            });
            removeStylesheet();
            removeOptions();
        }
    });
    
    // Set everything up.
    $api.on("loaded", function() {
        removeStylesheet();
        addStylesheet();
        removeOptions();
        addOptions();
        splitBlockedPhrases();
    
        $("#userlist").find(".user-dropdown").each(function(i, menu) {
            setupProfileMenu($(menu));
        });
        $each(trolls, function(name) {
            $(".userlist_item_" + name + ":first")
                .addClass("protection-indicator-active");
        });
    });
})();