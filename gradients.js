/**
 * Script: Greentext
 * Version: 1.A
 * Author az4521
 * lets you do greentext
 * >tfw no gf
 *
 * probably super shit
 */
$api.on("send", function(e, data) {
    if(data.msg[0]==">"){
        var green = '[#789922]' + data.msg + '[/#]'
        data.msg = green
    }
}); 
/**
 * Script: Gradients
 * Version: 2.2
 * Author: headzoo
 * Edited by:az4521
 * Edit: added support for greentext script
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
        "#91f0b4",
        "#96a0e0",
        "#b38af4",
        "#78eed4",
        "#05db57",
        "#7fd6f6",
        "#6db1e7",
        "#46dee2",
        "#4cceae",
        "#84fc0b"
    ];
    
    var DEFAULT_COLOR_COUNT = 5;
    var DEFAULT_MODE        = "stretch";
    var MARK                = "Gradients Script";
    var MARK_VERSION        = "v2.2";
    var REGEX_EMOTE         = new RegExp(':([^:]+):', "g");
    var REGEX_URL           = new RegExp('(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?', "gi");
    var REGEX_MACRO         = new RegExp('@([^@]+)@', "g");
    var REGEX_HEX_COLOR     = new RegExp('#[a-f0-9]{6}', "gi");
    
    var pickers = [];
    var state   = [];
    
    var Colorizer = {
        is_on       : $api.getStorage("gradient-is-on", true),
        colors      : DEFAULT_COLORS,
        color_count : DEFAULT_COLOR_COUNT,
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
                this.working.push("#000000");
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
        
        parse: function(msg, force_on) {
            if (!this.is_on && !force_on) {
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
    
    var pushState = function() {
        state.unshift({
            colors: Array.prototype.slice.call(Colorizer.colors),
            color_count: Colorizer.color_count,
            mode: Colorizer.mode
        });
        $("#gradients-undo").removeClass("disabled");
    };
    
    var resetState = function() {
        state = [];
        $("#gradients-undo").addClass("disabled");
    };
    
    var addStylesheet = function() {
        $("#us-chat-gradient-styles").remove();
        $(
            '<style id="us-chat-gradient-styles" type="text/css">' +
                '#us-chat-gradient-preview { background-color: #000; padding: 8px 12px; border: 1px solid #444; } ' +
                '#us-chat-gradient-preview .timestamp { color: #c8c8c8; margin-right: 4px; } ' +
                '#us-chat-gradient-preview .username { color: #c8c8c8; margin-right: 4px; font-weight: 700; } ' +
                '#gradients-credits { font-size: 12px; text-align: right;-webkit-transition-property:color;-webkit-transition-duration: 1s, 1s;-webkit-transition-timing-function: linear, ease-in; } ' +
                '#gradients-indicator { display: inline-block; cursor: pointer; } ' +
                '.gradients-reset-undo { -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;text-transform:uppercase;font-size:12px; margin-top: -5px;margin-left:4px;color: #5bc0de; text-decoration: underline; cursor: pointer; } ' +
                '.gradients-reset-undo.disabled { color: #5C7C86; } ' +
                '.gradient-color-picker { float: left; } ' +
                '.gradient-indicator-active::after { content: "\\2022"; margin-left: 8px; color: #00FF00; } ' +
                '.gradient-indicator-inactive::after { content: "\\2022"; margin-left: 8px; color: #aaa; } ' +
                '.gradient-picker-add { margin-left: 10px; width: 20px; height: 30px; display: inline-block; text-align: center; } ' +
                '.gradient-picker-add .glyphicon { vertical-align: text-bottom;font-size: 20px;line-height: 8px;cursor:pointer; text-shadow: 1px 1px rgba(0, 0, 0, 0.7); } ' +
                '.gradient-picker-add:hover .glyphicon { color: #FFF; text-shadow: 2px 2px rgba(0, 0, 0, 0.9);  } ' +
            '</style>'
        ).appendTo($("head"));
    };
    
    var addOptions = function() {
        $("#us-gradients-tab").remove();
        $("#us-gradients-pane").remove();
    
        var tab  = $options.makeTab("Gradients", "us-gradients-tab", "tint");
        var pane = $options.makePane("us-gradients-pane", tab);
        $options.tabs().append(tab);
        $options.panes().append(pane);
        
        var options = $(
            '<form id="us-chat-gradient-settings" class="form-horizontal">' +
                '<h4 style="text-align: right;color:#FFF;margin-bottom:2px;">' + MARK + ' ' + MARK_VERSION + '</h4>' +
                '<p id="gradients-credits">' +
                    'Credits: headzoo.' +
                '</p>' +
                
                '<div class="form-group">' +
                    '<label class="control-label col-sm-1">' +
                        'Colors' +
                    '</label>' +
                    '<div class="col-sm-11">' +
                        '<div id="us-chat-gradients-colors-mount" style="text-align: left;"/>' +
                    '</div>' +
                '</div>' +

                '<div class="form-group">' +
                    '<label class="control-label col-sm-1" for="us-chat-gradients-mode">' +
                        'Mode' +
                    '</label>' +
                    '<div class="col-sm-11">' +
                        '<select class="form-control gradient-setting-control" id="us-chat-gradients-mode">' +
                            '<option value="stretch">Stretch</option>' +
                            '<option value="alternate">Alternate</option>' +
                            '<option value="repeat">Repeat</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +

                '<div class="form-group">' +
                    '<label class="control-label col-sm-1" for="us-chat-gradients-color-count">' +
                    '</label>' +
                    '<div class="col-sm-11">' +
                        '<div id="us-chat-gradient-preview">' +
                            '<span class="timestamp">[20:48:14]</span><span class="username">' + $user.name + ':</span><span class="text gradient-preview-text">lol</span><br/>' +
                            '<span class="timestamp">[20:49:23]</span><span class="username">' + $user.name + ':</span><span class="text gradient-preview-text">hahahaha</span><br/>' +
                            '<span class="timestamp">[20:51:02]</span><span class="username">' + $user.name + ':</span><span class="text gradient-preview-text">i always pictured Toto as a black Freddie Mercury</span><br/>' +
                            '<span class="timestamp">[20:53:46]</span><span class="username">' + $user.name + ':</span><span class="text gradient-preview-text">if i wa s lockm smtih, hw eaxtaly wwpuld i make the ke to ouru heeat?</span><br/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<span id="gradients-random" class="gradients-reset-undo pull-right">Random</span>' +
                '<span id="gradients-reset" class="gradients-reset-undo pull-right">Reset</span>' +
                '<span id="gradients-undo" class="gradients-reset-undo disabled pull-right">Undo</span>' +
            '</form>'
        );
        
        pane.append(options);
        $("#us-chat-gradients-colors-mount").append(generatePickers());
        $("#us-chat-gradients-mode").val(Colorizer.mode);
    };
    
    var addIndicator = function() {
        var indicator = $('<button class="btn btn-default btn-sm" id="gradients-indicator">Gradient</button>');
        indicator.on("click", function() {
            toggleColorizer();
        });
        updateIndicator(indicator);
        
        $("#gradients-indicator").remove();
        $(".chatbuttons > .btn-group").append(indicator);
    };
    
    var updateIndicator = function(indicator) {
        indicator = indicator || $("#gradients-indicator");
        if (Colorizer.is_on) {
            indicator
                .attr("title", "Gradients are active. Click to disable.")
                .removeClass("gradient-indicator-inactive")
                .addClass("gradient-indicator-active");
        } else {
            indicator
                .attr("title", "Gradients are not activated. Click to enable.")
                .removeClass("gradient-indicator-active")
                .addClass("gradient-indicator-inactive");
        }
    };
    
    var toggleColorizer = function() {
        Colorizer.is_on = !Colorizer.is_on;
        $api.setStorage("gradient-is-on", Colorizer.is_on);
        updateIndicator();
    };
    
    var generatePickers = function() {
        var useroptions = $("#useroptions");
        var container   = $('<div/>');
        
        for(var i = 0; i < Colorizer.color_count; i++) {
            (function(index) {
                if (!Colorizer.colors[index]) {
                    Colorizer.colors[index] = DEFAULT_COLORS[index];
                }
                
                var picker = $('<input/>')
                    .attr("id", "chat-color-" + index)
                    .attr("type", "color");
                pickers.push(picker);
                container.append(picker);
                
                picker.spectrum({
                    color: Colorizer.colors[index],
                    preferredFormat: "hex",
                    showInput: true,
                    clickoutFiresChange: true,
                    replacerClassName: "gradient-color-picker",
                    appendTo: useroptions,
                    hide: function() {
                        pushState();
                        Colorizer.colors[index] = picker.spectrum("get").toString("hex");
                        updatePreview();
                    }
                });
            })(i);
        }
    
        var picker_add = $(
            '<div class="gradient-picker-add" title="Add Color">' +
                '<span class="glyphicon glyphicon-plus"></span>' +
            '</div>'
        ).on("click", function() {
            pushState();
            Colorizer.color_count = parseInt(Colorizer.color_count) + 1;
            if (Colorizer.color_count > DEFAULT_COLORS.length) {
                Colorizer.color_count = DEFAULT_COLORS.length;
            }
            updatePickers();
            Colorizer.colors = getPickerColors();
            updatePreview();
        });
        container.append(picker_add);
    
        var picker_minus = $(
            '<div class="gradient-picker-add" title="Remove Color">' +
                '<span class="glyphicon glyphicon-minus"></span>' +
            '</div>'
        ).on("click", function() {
            pushState();
            Colorizer.color_count = parseInt(Colorizer.color_count) - 1;
            if (Colorizer.color_count < 2) {
                Colorizer.color_count = 2;
            }
            updatePickers();
            Colorizer.colors = getPickerColors();
            updatePreview();
        });
        container.append(picker_minus);
        
        return container;
    };
    
    var updatePickers = function() {
        $api.each(pickers, function(picker) {
            picker.spectrum("destroy").remove();
        });
        pickers = [];
        $("#us-chat-gradients-colors-mount")
            .empty()
            .append(generatePickers());
    };
    
    var getPickerColors = function() {
        var colors = [];
        $api.each(pickers, function(picker) {
            colors.push(picker.spectrum("get").toString());
        });
        
        return colors;
    };
    
    var updatePreview = function() {
        $(".gradient-preview-text").each(function(i, el) {
            var target = $(el);
            var html   = parseBBCodes(Colorizer.parse(target.text(), true));
            target.html(html);
        });
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
    
    var resetColors = function() {
        if (confirm("Are you sure you want to reset your colors?")) {
            Colorizer.mode = DEFAULT_MODE;
            Colorizer.color_count = DEFAULT_COLOR_COUNT;
            for(var i = 0; i < Colorizer.color_count; i++) {
                Colorizer.colors[i] = DEFAULT_COLORS[i];
            }
            
            $api.each(pickers, function(picker) {
                picker.spectrum("destroy").remove();
            });
            pickers = [];
            $("#us-chat-gradients-colors-mount")
                .empty()
                .append(generatePickers());
            $("#us-chat-gradients-mode").val(Colorizer.mode);
            
            updatePickers();
            updatePreview();
            resetState();
        }
    };
    
    var undoColors = function() {
        var saved = state.shift();
        if (saved !== undefined) {
            Colorizer.mode        = saved.mode;
            Colorizer.colors      = saved.colors;
            Colorizer.color_count = saved.color_count;
            
            $api.each(pickers, function(picker) {
                picker.spectrum("destroy").remove();
            });
            pickers = [];
            $("#us-chat-gradients-colors-mount")
                .empty()
                .append(generatePickers());
            $("#us-chat-gradients-mode").val(Colorizer.mode);
            
            updatePickers();
            updatePreview();
            
            if (state.length == 0) {
                $("#gradients-undo").addClass("disabled");
            }
        }
    };
    
    var randomizeColors = function() {
        var colors = [];
        for(var i = 0; i < Colorizer.color_count; i++) {
            Colorizer.colors[i] = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        }
        
        $api.each(pickers, function(picker) {
            picker.spectrum("destroy").remove();
        });
        pickers = [];
        $("#us-chat-gradients-colors-mount")
            .empty()
            .append(generatePickers());
    
        updatePickers();
        updatePreview();
    };
    
    var shareColors = function() {
        var my_colors = [];
        for(var i = 0; i < Colorizer.colors.length; i++) {
            my_colors.push(
                "[" + Colorizer.colors[i] + "]" + Colorizer.colors[i].toUpperCase() + "[/#] "
            )
        }
        $api.send("[#FFFFFF]" + MARK + " " + MARK_VERSION + ":[/#] " + my_colors.join(" "));
    };
    
    var isNonColorMessage = function(msg) {
        return (msg[0] == "/" || msg[0] == "$" || msg[0] == "@" || msg.indexOf(MARK) == 9 || (msg.indexOf("[#789922]>") == 0 && msg.indexOf("[/#]") == msg.length-4));
    };
    
    var importColors = function(line) {
        var matches = REGEX_HEX_COLOR.exec(line);
        if (matches === null) {
            return;
        }
        
        var colors  = [];
        while(matches !== null) {
            colors.push(matches[0]);
            matches = REGEX_HEX_COLOR.exec(line);
        }
        if (colors.length < 2 && colors.length > DEFAULT_COLORS.length) {
            return;
        }
        
        if (confirm(MARK + " " + MARK_VERSION +". Import these " + colors.length + " colors?\n\n" + colors.join(", "))) {
            Colorizer.color_count = colors.length;
            Colorizer.colors      = colors;
            saveSettings();
            updatePickers();
            updatePreview();
            $api.toast("The colors have been imported.");
        }
    };
    
    var startCredits = function() {
        var an_timer = null;
        var an_index = 0;
        var credits  = $("#gradients-credits")
            .css("color", Colorizer.colors[an_index]);
        var useroptions = $("#useroptions");
        useroptions.on("show.bs.modal", function() {
            an_timer = setInterval(function() {
                an_index++;
                if (an_index > Colorizer.colors.length) {
                    an_index = 0;
                }
                credits.css("color", Colorizer.colors[an_index]);
            }, 1000);
        });
        useroptions.on("hidden.bs.modal", function() {
            if (an_timer) {
                clearInterval(an_timer);
            }
        });
    };
    
    $api.on("loaded", function() {
        restoreSettings();
        addStylesheet();
        addOptions();
        addIndicator();
        updatePreview();
        startCredits();
        
        var settings = $(".gradient-setting-control");
        settings.off("change.gradients");
        settings.on("change.gradients", function() {
            pushState();
            Colorizer.mode = $("#us-chat-gradients-mode").val();
            updatePickers();
            Colorizer.colors = getPickerColors();
            updatePreview();
        });
    
        var reset = $("#gradients-reset");
        reset.off("click.gradients");
        reset.on("click.gradients", resetColors);
        
        var undo = $("#gradients-undo");
        undo.off("click.gradients");
        undo.on("click.gradients", undoColors);
        
        var random = $("#gradients-random");
        random.off("click.gradients");
        random.on("click.gradients", randomizeColors);
        
        var buffer = $("#messagebuffer");
        buffer.off("click.gradients");
        buffer.on("click.gradients", ".chat-msg", function() {
            var target = $(this);
            if (target.is(".chat-msg")) {
                importColors(target.find(".chat-msg-line:first").text());
            }
        });
        
        $("#us-chat-gradient-settings").on("click", ".sp-input", function() {
            var target = $(this);
            console.log(target);
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
