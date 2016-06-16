/**
 * Script: Gradients
 * Version: 2.1
 * Author: headzoo
 * Import: https://upnext.fm/js/rainbowvis.js
 *
 * Applies a color gradient to the messages you send.
 *
 * Gradient text is toggled on and off by typing the command /colors into
 * the chat text box, or by clicking the "Gradient On/Off" button.
 *
 * To share your colors with the channel, type the command "/colors share".
 * Your colors will be published to the channel. Other users running this
 * script can click those colors to import them.
 */
(function() {
    var DEFAULT_COLORS = [
        "#FFFFFF",
        "#DADADA",
        "#B6B6B6",
        "#919191",
        "#6D6D6D",
        "#484848",
        "#242424",
        "#000000"
    ];
    
    var DEFAULT_COLOR_COUNT = 5;
    var DEFAULT_MODE        = "stretch";
    var MARK                = "Gradients Script 2.1";
    var REGEX_EMOTE         = new RegExp(':([^:]+):', "g");
    var REGEX_URL           = new RegExp('(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?', "gi");
    var REGEX_MACRO         = new RegExp('@([^@]+)@', "g");
    
    var Colorizer = {
        colors      : DEFAULT_COLORS,
        color_count : DEFAULT_COLOR_COUNT,
        is_on       : true,
        mode        : DEFAULT_MODE,
        rainbow     : new Rainbow(),
        working     : [],
        range       : 0,
        index       : 0,
        length      : 0,
        
        reset: function(range) {
            this.working = Array.prototype.slice.call(this.colors);
            this.length  = this.working.length;
            this.range   = range;
            this.index   = 0;
            if (this.mode == "stretch") {
                this.rainbow.setSpectrumByArray(this.working);
                this.rainbow.setNumberRange(0, range);
            }
        },
        
        next: function() {
            var color = null;
            if (this.mode == "stretch") {
                color = "#" + this.rainbow.colourAt(this.index);
            } else {
                if (this.index >= this.length) {
                    if (this.mode == "alternate") {
                        this.working.reverse();
                    }
                    this.index = 0;
                }
                
                color = this.working[this.index];
            }
            
            this.index++;
            return color;
        },
        
        parse: function(msg) {
            if (!this.is_on) {
                return msg;
            }
            
            var parsed = "";
            var len    = msg.length;
            var chars  = msg.split('');
            var ig_pos = this.getIgnoredPositions(msg);
            this.reset(len);
    
            for (var i = 0; i < len; i++) {
                if (this.isIgnoredPosition(ig_pos, i)) {
                    parsed = parsed + chars[i];
                } else if (chars[i] != " ") {
                    parsed = parsed + "[" + this.next() + "]" + chars[i] + "[/#]";
                } else {
                    parsed = parsed + " ";
                }
            }
    
            return parsed;
        },
        
        getIgnoredPositions: function(msg) {
            var ig_pos = [], matches;
    
            matches = REGEX_URL.exec(msg);
            while(matches !== null) {
                ig_pos.push({
                    start: matches.index,
                    end: REGEX_URL.lastIndex
                });
                matches = REGEX_URL.exec(msg);
            }
            
            matches = REGEX_EMOTE.exec(msg);
            while(matches !== null) {
                ig_pos.push({
                    start: matches.index,
                    end: REGEX_EMOTE.lastIndex
                });
                matches = REGEX_EMOTE.exec(msg);
            }
            
            matches = REGEX_MACRO.exec(msg);
            while(matches !== null) {
                ig_pos.push({
                    start: matches.index,
                    end: REGEX_MACRO.lastIndex
                });
                matches = REGEX_MACRO.exec(msg);
            }
            
            return ig_pos;
        },
        
        isIgnoredPosition: function(ig_pos, i) {
            for(var y = 0; y < ig_pos.length; y++) {
                if (i >= ig_pos[y].start && i < ig_pos[y].end) {
                    return true;
                }
            }
            
            return false;
        }
    };
    
    var addCSS = function() {
        $("#us-chat-gradient-styles").remove();
        $(
            '<style id="us-chat-gradient-styles" type="text/css">' +
                '#us-chat-gradient-preview { background-color: #000; padding: 8px 12px; border: 1px solid #444; } ' +
                '#us-chat-gradient-preview .timestamp { color: #c8c8c8; margin-right: 4px; } ' +
                '#us-chat-gradient-preview .username { color: #c8c8c8; margin-right: 4px; font-weight: 700; } ' +
                '#gradients-indicator { display: inline-block; cursor: pointer; } ' +
                '#gradients-reset { color: #5bc0de; text-decoration: underline; cursor: pointer; } ' +
                '.gradient-color-picker { float: left; } ' +
            '</style>'
        ).appendTo($("head"));
    };
    
    var addOptions = function() {
        $("#us-chat-gradient-settings").remove();
        
        var options = $(
            '<div id="us-chat-gradient-settings">' +
                '<h4>Gradient Preferences</h4>' +
                '<div class="form-group">' +
                    '<label class="control-label col-sm-4" for="us-chat-gradients-mode">' +
                        'Mode' +
                    '</label>' +
                    '<div class="col-sm-8">' +
                        '<select class="form-control gradient-setting-control" id="us-chat-gradients-mode">' +
                            '<option value="stretch">Stretch</option>' +
                            '<option value="alternate">Alternate</option>' +
                            '<option value="repeat">Repeat</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
                
                '<div class="form-group">' +
                    '<label class="control-label col-sm-4" for="us-chat-gradients-color-count">' +
                        'Color Count' +
                    '</label>' +
                    '<div class="col-sm-8">' +
                        '<select class="form-control gradient-setting-control" id="us-chat-gradients-color-count">' +
                            '<option value="2">2</option>' +
                            '<option value="3">3</option>' +
                            '<option value="4">4</option>' +
                            '<option value="5" selected>5</option>' +
                            '<option value="6">6</option>' +
                            '<option value="7">7</option>' +
                            '<option value="8">8</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +

                '<div class="form-group">' +
                    '<label class="control-label col-sm-4">' +
                        'Colors (<span id="gradients-reset">reset</span>)' +
                    '</label>' +
                    '<div class="col-sm-8">' +
                        '<div id="us-chat-gradients-colors-mount" style="text-align: left;"/>' +
                    '</div>' +
                '</div>' +

                '<div class="form-group">' +
                    '<label class="control-label col-sm-4" for="us-chat-gradients-color-count">' +
                        'Preview' +
                    '</label>' +
                    '<div class="col-sm-8">' +
                        '<div id="us-chat-gradient-preview">' +
                            '<span class="timestamp">[20:48:14]</span><span class="username">' + $user.name + ':</span><span class="text">lol</span><br/>' +
                            '<span class="timestamp">[20:49:23]</span><span class="username">' + $user.name + ':</span><span class="text">hahahaha</span><br/>' +
                            '<span class="timestamp">[20:51:02]</span><span class="username">' + $user.name + ':</span><span class="text">i always pictured Toto as a black Freddie Mercury</span><br/>' +
                            '<span class="timestamp">[20:53:46]</span><span class="username">' + $user.name + ':</span><span class="text">if i wa s lockm smtih, hw eaxtaly wwpuld i make the ke to ouru heeat?</span><br/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
        
        $("#us-chat form").append(options);
        $("#us-chat-gradients-colors-mount").append(generatePickers());
        $("#us-chat-gradients-mode").val(Colorizer.mode);
        $("#us-chat-gradients-color-count").val(Colorizer.color_count);
    };
    
    var addToggleButton = function() {
        $("#gradients-indicator").remove();
        var indicator = $('<button class="btn btn-default btn-sm" id="gradients-indicator">Gradient Off</button>');
        indicator.on("click", function() {
            toggleColorizer();
        });
        $(".chatbuttons > .btn-group").append(indicator);
    };
    
    var updatePreview = function() {
        $("#us-chat-gradient-preview").find("span.text").each(function(i, el) {
            var target = $(el);
            var html   = parseBBCodes(Colorizer.parse(target.text()));
            target.html(html);
        });
    };
    
    var generatePickers = function() {
        var container = $('<div/>');
        for(var i = 0; i < Colorizer.color_count; i++) {
            (function(index) {
                if (!Colorizer.colors[index]) {
                    Colorizer.colors[index] = DEFAULT_COLORS[index];
                }
                
                $("#chat-color-" + index).spectrum("destroy").remove();
                var picker = $('<input/>')
                    .attr("id", "chat-color-" + index)
                    .attr("type", "color");
                container.append(picker);
                picker.spectrum({
                    color: Colorizer.colors[index],
                    preferredFormat: "hex",
                    showInput: true,
                    clickoutFiresChange: true,
                    replacerClassName: "gradient-color-picker",
                    hide: function() {
                        Colorizer.colors[index] = picker.spectrum("get").toString("hex");
                        updatePreview();
                    }
                });
            })(i);
        }
        
        return container;
    };
    
    var getPickerColors = function() {
        var colors = [];
        for(var i = 0; i < Colorizer.color_count; i++) {
            var c = $("#chat-color-" + i).spectrum("get").toString();
            colors.push(c);
        }
        
        return colors;
    };
    
    var updatePickers = function() {
        $(".gradient-color-picker").spectrum("destroy").remove();
        $("#us-chat-gradients-colors-mount")
            .empty()
            .append(generatePickers());
    };
    
    var saveSettings = function() {
        $api.setStorage("gradient-colors",      Colorizer.colors);
        $api.setStorage("gradient-mode",        Colorizer.mode);
        $api.setStorage("gradient-color-count", Colorizer.color_count);
    };
    
    var restoreSettings = function() {
        Colorizer.color_count = $api.getStorage("gradient-color-count", DEFAULT_COLOR_COUNT);
        Colorizer.colors      = $api.getStorage("gradient-colors", DEFAULT_COLORS);
        Colorizer.mode        = $api.getStorage("gradient-mode", DEFAULT_MODE);
    };
    
    var shareColors = function() {
        var my_colors = [];
        for(var i = 0; i < Colorizer.colors.length; i++) {
            my_colors.push(
                "[" + Colorizer.colors[i] + "]" + Colorizer.colors[i].toUpperCase() + "[/#] "
            )
        }
        $api.send("[#FFFFFF]" + MARK + ":[/#] " + my_colors.join(" "));
    };
    
    var isNonColorMessage = function(msg) {
        if (msg[0] == "/" || msg[0] == "$") {
            return true;
        } else if (msg.indexOf(MARK) !== -1) {
            return true;
        }
        
        return false;
    };
    
    var toggleColorizer = function() {
        Colorizer.is_on = !Colorizer.is_on;
        if (Colorizer.is_on) {
            $("#gradients-indicator").text("Gradient Off");
        } else {
            $("#gradients-indicator").text("Gradient On");
        }
    };
    
    var importColors = function(line) {
        if (line.indexOf(MARK + ":") === 0) {
            line = line.replace(MARK + ":", "").trim();
            var colors = line.split(" ")
                .filter(function(el) {return el.length != 0});
            for(var i = 0; i < colors.length; i++) {
                if (!colors[i].match(/#[A-F0-9]{6}/)) {
                    return;
                }
            }
        
            if (confirm("Import these colors?")) {
                Colorizer.color_count = colors.length;
                Colorizer.colors      = colors;
                saveSettings();
                updatePickers();
                updatePreview();
                $api.toast("The colors have been imported.");
            }
        }
    };
    
    var resetColors = function() {
        if (confirm("Are you sure you want to reset your colors?")) {
            for(var i = 0; i < Colorizer.color_count; i++) {
                Colorizer.colors[i] = DEFAULT_COLORS[i];
            }
        
            $(".gradient-color-picker").spectrum("destroy").remove();
            $("#us-chat-gradients-colors-mount")
                .empty()
                .append(generatePickers());
            updatePreview();
            saveSettings();
        }
    };
    
    $api.on("loaded", function() {
        restoreSettings();
        addCSS();
        addOptions();
        updatePreview();
        addToggleButton();
        
        var setting_controls = $(".gradient-setting-control");
        setting_controls.off("change.gradients");
        setting_controls.on("change.gradients", function() {
            Colorizer.mode        = $("#us-chat-gradients-mode").val();
            Colorizer.color_count = $("#us-chat-gradients-color-count").val();
    
            updatePickers();
            Colorizer.colors = getPickerColors();
            updatePreview();
        });
    
        var reset = $("#gradients-reset");
        reset.off("click.gradients");
        reset.on("click.gradients", resetColors);
        
        var buffer = $("#messagebuffer");
        buffer.off("click.gradients");
        buffer.on("click.gradients", ".chat-msg", function() {
            var target = $(this);
            if (target.is(".chat-msg")) {
                importColors(target.find(".chat-msg-line:first").text());
            }
        });
        
        $(".sp-input").on("click", function() {
            var target = $(this);
            var val = prompt("Color", target.val());
            if (val && val[0] == "#") {
                target.data("element").spectrum("set", val);
            }
        });
    });
    
    $api.on("user_options_save", function() {
        saveSettings();
    });
    
    $api.on("send", function(e, data) {
        if (data.msg.match(/^\/colou?rs/i)) {
            var args = data.msg.replace(/^\/colou?rs\s+/i, '');
            if (args.toLowerCase() == "share") {
                shareColors();
            } else {
                toggleColorizer();
            }
            e.cancel();
        } else if (!isNonColorMessage(data.msg)) {
            data.msg = Colorizer.parse(data.msg);
        }
    });
})();