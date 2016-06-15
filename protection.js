/**
 * Script: Protection
 * Version: 1.7
 *
 * Provides protection against trolls and other nasty users.
 * 
 * Protection settings are configured by clicking Options -> Protection.
 * Click a user's name in the users list and click "Protection On" to 
 * guard against that user.
 * 
 * REFRESH THE PAGE AFTER INSTALLING.
 */
(function() {
    var settings = $api.getStorage("protection-settings", {
        no_images:     true,
        no_emotes:     true,
        no_upper_case: true,
        blocked_phrases: ""
    });
    var trolls    = $api.getStorage("protection-trolls", []);
    var no_queue  = $api.getStorage("protection-no-queue", []);
    var img_regex = /<img.+?src=[\"'](.+?)[\"'].*?>/g;
    var blocked_phrases_split = [];
    
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
        anchor.text("Protection");
        tab.append(anchor);
        
        var pane = $('<div/>');
        pane.addClass("tab-pane");
        pane.attr("id", "us-protection-pane");
        panes.append(pane);
        
        var form = $('<form/>');
        form.addClass("form-horizontal");
        pane.append(form);
        
        form.append($('<h4 style="margin-bottom:0;color:#fff;">Troll Settings</h4>'));
        form.append($('<p>Applies to users flagged as trolls.</p>'));
        $(
            '<div class="form-group">' +
                '<div class="col-sm-8 col-sm-offset-4">' +
                    '<div class="checkbox">' +
                        '<label for="us-protection-settings-no-images">' +
                            '<input type="checkbox" id="us-protection-settings-no-images" />' +
                            'Do not show inline images from trolls.' +
                        '</label>' +
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
                            'Do not show emotes from trolls.' +
                        '</label>' +
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
                            'Do not show UPPER CASE text from trolls.' +
                        '</label>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo(form);
    
        form.append($('<h4 style="margin-bottom:0;color:#fff;">General Settings</h4>'));
        form.append($('<p>Applies to all users.</p>'));
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
        settings.no_upper_case   = $("#us-protection-settings-no-upper-case").is(":checked");
        settings.blocked_phrases = $("#us-protection-settings-blocked-phrases").val().trim();
        splitBlockedPhrases();
    };
    
    // Updates the form values from the local 'settings' object.
    var updateForm = function() {
        $("#us-protection-settings-no-images").prop("checked", settings.no_images);
        $("#us-protection-settings-no-emotes").prop("checked", settings.no_emotes);
        $("#us-protection-settings-no-upper-case").prop("checked", settings.no_upper_case);
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
    
    // Returns whether the message contains a blocked phrase.
    var hasBlockedPhrase = function(msg) {
        var found = false;
        msg = msg.toLowerCase();
        $api.each(blocked_phrases_split, function(phrase) {
            if (msg.indexOf(phrase) != -1) {
                found = true;
                return null;
            }
        });
        
        return found;
    };
    
    // Filter messages from users that have been put in troll prison.
    $api.on("receive", function(e, data) {
        if (hasBlockedPhrase(data.msg)) {
            return e.cancel();
        }
        
        if (trolls.indexOf(data.username.toLowerCase()) !== -1) {
            data.meta.no_emotes = settings.no_emotes;
            if (settings.no_upper_case) {
                data.msg = data.msg.toLowerCase();
            }
            if (settings.no_images) {
                console.log(data.msg);
                data.msg = filterImages(data.msg);
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
    
    // Save our settings when the rest of the user options are saved.
    $api.on("user_options_save", function() {
        updateSettings();
        $api.setStorage("protection-settings", settings);
    });
    
    // Add buttons to each profile menu which turns protection on/off.
    $api.on("profile_menu", function(e, menu) {
        var name      = menu.data("name").toLowerCase();
        var btn_group = menu.find(".btn-group-vertical:first");
        var btn = $("<button/>")
            .addClass("btn btn-xs btn-default btn-stop-trolling")
            .appendTo(btn_group);
        
        // Add a button to user profile menus to turn trolling protection on and off.
        btn.text(trolls.indexOf(name) == -1 ? "Protection On" : "Protection Off")
            .click(function () {
                var index = trolls.indexOf(name);
                if (index == -1) {
                    trolls.push(name);
                    btn.text("Protection Off");
                } else {
                    trolls.splice(index, 1);
                    btn.text("Protection On");
                }
                
                $api.setStorage("protection-trolls", trolls);
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
                    
                    $api.setStorage("protection-no-queue", no_queue);
                });
        }
    });
    
    removeOptions();
    addOptions();
    updateForm();
    splitBlockedPhrases();
})();