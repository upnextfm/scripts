/**
 * Script: Protection
 * Version: 1.9.1
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
    
    var settings = $store.local.get("protection-settings");
    $each(DEFAULTS, function(val, key) {
        if (settings[key] == undefined) {
            settings[key] = val;
        }
    });
    
    var trolls    = $store.local.get("protection-trolls", []);
    var no_queue  = $store.local.get("protection-no-queue", []);
    var img_regex = /<img.+?src=[\"'](.+?)[\"'].*?>/g;
    var blocked_phrases_split = [];
    var buffer = [];
    
    // Returns whether the user is the troll list.
    var isTroll = function(name) {
        name = name.replace("@", "");
        return trolls.indexOf(name) !== -1;
    };
    
    // Adds our custom css to the page.
    var addStylesheet = function() {
        $("#us-chat-protection-styles").remove();
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
    
    // Adds a "Protection" tab to the user options where the protection
    // settings can be configured.
    var addOptions = function() {
        var options = $("#useroptions");
        var header  = options.find(".modal-header");
        var tabs    = header.find(".nav-tabs");
        var panes   = options.find(".modal-body > .tab-content");
        
        var tab = $('<li/>');
        tab.attr("id", "us-protection-tab");
        tabs.append(tab);
        
        var anchor = $('<a/>');
        anchor.attr("href", "#us-protection-pane");
        anchor.attr("data-toggle", "tab");
        anchor.html('<span class="glyphicon glyphicon-lock"></span> Protection');
        tab.append(anchor);
        
        var pane = $('<div/>');
        pane.addClass("tab-pane");
        pane.attr("id", "us-protection-pane");
        panes.append(pane);
        
        var form = $('<form/>');
        form.addClass("form-horizontal");
        pane.append(form);
        
        form.append($('<h4 style="margin-bottom:0;color:#fff;">Troll Settings</h4>'));
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-no-images">' +
                            '<input type="checkbox" id="us-protection-settings-no-images" />' +
                            'Do not show inline images.' +
                        '</label>' +
                        '<p class="text-muted">Images will be shown as links.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-no-emotes">' +
                            '<input type="checkbox" id="us-protection-settings-no-emotes" />' +
                            'Do not show emotes.' +
                        '</label>' +
                        '<p class="text-muted">Emotes will be shown as image links.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-no-colors">' +
                            '<input type="checkbox" id="us-protection-settings-no-colors" />' +
                            'Do not show colors.' +
                        '</label>' +
                        '<p class="text-muted">Remove colors/gradients from messages.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-no-upper-case">' +
                            '<input type="checkbox" id="us-protection-settings-no-upper-case" />' +
                            'Do not show UPPER CASE text.' +
                        '</label>' +
                        '<p class="text-muted">Convert all messages to lower case.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-throttle">' +
                            '<input type="checkbox" id="us-protection-settings-throttle" />' +
                            'Throttle messages.' +
                        '</label>' +
                        '<p class="text-muted">Mute the user when they\'re writing messages too fast.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-trim">' +
                            '<input type="checkbox" id="us-protection-settings-trim" />' +
                            'Trim long messages.' +
                        '</label>' +
                        '<p class="text-muted">Trim messages that are ove 75 characters.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-vote-skip">' +
                            '<input type="checkbox" id="us-protection-settings-vote-skip" />' +
                            'Automatically vote skip videos.' +
                        '</label>' +
                        '<p class="text-muted">Automatically vote to skip any videos played by the user.</p>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        form.append($('<h4 style="margin-bottom:0;color:#fff;">General Settings</h4>'));
        $(
            '<div class="form-group">' +
                '<label class="control-label col-sm-4" for="us-protection-settings-blocked-phrases">' +
                    'Block messages containing' +
                '</label>' +
                '<div class="col-sm-8">' +
                    '<input type="text" class="form-control" id="us-protection-settings-blocked-phrases"/>' +
                    '<p class="text-muted">Comma separated list of phrases, e.g. "hamburgers, taco bell, hate".</p>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    };
    
    // Removes the "Protection" tab from the user options.
    var removeOptions = function() {
        $("#us-protection-tab").remove();
        $("#us-protection-pane").remove();
    };
    
    // Updates the local 'settings' object to the form values.
    var updateSettings = function() {
        settings.no_images       = $("#us-protection-settings-no-images").is(":checked");
        settings.no_emotes       = $("#us-protection-settings-no-emotes").is(":checked");
        settings.no_colors       = $("#us-protection-settings-no-colors").is(":checked");
        settings.no_upper_case   = $("#us-protection-settings-no-upper-case").is(":checked");
        settings.throttle        = $("#us-protection-settings-throttle").is(":checked");
        settings.vote_skip       = $("#us-protection-settings-vote-skip").is(":checked");
        settings.trim            = $("#us-protection-settings-trim").is(":checked");
        settings.blocked_phrases = $("#us-protection-settings-blocked-phrases").val().trim();
        splitBlockedPhrases();
    };
    
    // Updates the form values from the local 'settings' object.
    var updateForm = function() {
        $("#us-protection-settings-no-images").prop("checked", settings.no_images);
        $("#us-protection-settings-no-emotes").prop("checked", settings.no_emotes);
        $("#us-protection-settings-no-colors").prop("checked", settings.no_colors);
        $("#us-protection-settings-no-upper-case").prop("checked", settings.no_upper_case);
        $("#us-protection-settings-throttle").prop("checked", settings.throttle);
        $("#us-protection-settings-vote-skip").prop("checked", settings.vote_skip);
        $("#us-protection-settings-trim").prop("checked", settings.trim);
        $("#us-protection-settings-blocked-phrases").val(settings.blocked_phrases);
    };
    
    // Splits the blocked phrases.
    var splitBlockedPhrases = function() {
        if (settings.blocked_phrases) {
            blocked_phrases_split =
                settings.blocked_phrases.toLowerCase().split(",")
                    .map(Function.prototype.call, String.prototype.trim);
        } else {
            blocked_phrases_split = [];
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
        $each(blocked_phrases_split, function(phrase) {
            if (msg.indexOf(phrase) != -1) {
                found = true;
                return null;
            }
        });
        
        return found;
    };
    
    // Add indicator next to each troll. Wait a little bit for the
    // page to finished loading.
    setTimeout(function() {
        $each(trolls, function(name) {
            $(".userlist_item_" + name + ":first")
                .addClass("protection-indicator-active");
        });
    }, 2000);
    
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
                console.log("user throttled");
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
    $api.on("user_options_save", function() {
        updateSettings();
        $store.local.set("protection-settings", settings);
    });
    
    // Add buttons to each profile menu which turns protection on/off.
    $api.on("profile_menu", function(e, menu) {
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
                .addClass("btn btn-xs btn-default btn-stop-trolling-playlist  protection-indicator-inactive")
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
    });
    
    addStylesheet();
    removeOptions();
    addOptions();
    updateForm();
    splitBlockedPhrases();
})();