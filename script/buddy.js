/**
 * Name: Buddy
 * Version: 1.1
 * Author: headzoo
 * 
 * Displays your notices and whispers in a separate chat window.
 */
(function() {
    'use strict';
    
    var SAVE_INTERVAL    = 30000;
    var BUFFER_SAVE_SIZE = 5;
    
    var loaded = false,
        buffer,
        whisper_input,
        messages = [],
        last_whisper_from = "";
    
    var Messages = {
        format: function(data) {
            if (data.meta === undefined) {
                data.meta = {};
            }
            if (data.meta.color === undefined) {
                data.meta.color = "#ffffff";
            }
            if (USEROPTS.show_colors) {
                data.msg = parseBBCodes(data.msg);
            } else {
                data.msg = stripHTML(data.msg);
            }
        }
    };
    
    var stripHTML = function(msg) {
        msg = removeBBCodes(msg);
        msg = msg.replace(/<(?:.|\n)*?>/gm, '');
        
        return msg;
    };
    
    var appendStylesheet = function() {
        $("#buddy-stylesheet").remove();
        $(
            '<style id="buddy-stylesheet" type="text/css">' +
                '#buddy-container {' +
                    'margin: 12px;' +
                    'height: 143px;' +
                    'background-color: #000;' +
                    'border: 1px solid #515151;' +
                '}' +
                '#buddy-scroller {' +
                    'height: 110px;' +
                    'overflow-x: hidden;' +
                    'overflow-y: auto;' +
                '}' +
                '#buddy-buffer {' +
                    'margin: 6px;' +
                '}' +
                '#buddy-buffer .timestamp {' +
                    'margin-right: 6px;' +
                '}' +
                '#buddy-buffer .chat-msg.flash {'  +
                    '-webkit-animation-name: flash-animation;'  +
                    '-webkit-animation-duration: 5s;'  +
                    '-webkit-animation-iteration-count: 1;'  +
                    '-webkit-animation-timing-function: ease-in-out;'  +
                    '-moz-animation-name: flash-animation;'  +
                    '-moz-animation-duration: 5s;'  +
                    '-moz-animation-iteration-count: 1;'  +
                    '-moz-animation-timing-function: ease-in-out;'  +
                    'animation-name: flash-animation;'  +
                    'animation-duration: 5s;'  +
                    'animation-iteration-count: 1;'  +
                    'animation-timing-function: ease-in-out;'  +
                '}' +
                '@-webkit-keyframes flash-animation {  '  +
                    'from { background: #333; }'  +
                    'to   { background: #000; }'  +
                '}'  +
                '@keyframes flash-animation {'  +
                    'from { background: #333; }'  +
                    'to   { background: #000; }'  +
                '}' +
                '#buddy-whisper-line {' +
                    'height: 30px;' +
                    'border-top: 1px solid #515151;' +
                '}' +
                '#buddy-whisper-input {' +
                    'box-sizing: border-box;' +
                    'height: 30px;' +
                    'width: 100%;' +
                    'border: 0;' +
                    'background-color: #000;' +
                    'color: #FFF;' +
                    'padding: 0 6px;' +
                '}' +
                '#buddy-whisper-input::-webkit-input-placeholder {' +
                    'color: #555;' +
                '}' +
                '#buddy-whisper-input::-moz-placeholder {' +
                    'color: #555;' +
                '}' +
                '#buddy-whisper-input:-ms-input-placeholder {' +
                    'color: #555;' +
                '}' +
            '</style>'
        ).appendTo($("head"));
    };
    
    var appendContainer = function() {
        $("#buddy-container").remove();
        
        var container = $('<div/>', {
            id: "buddy-container"
        }).prependTo($("#leftpane-inner"));
        
        var scroller = $('<div/>', {
            id: "buddy-scroller"
        }).appendTo(container);
        
        buffer = $('<div/>', {
            id: "buddy-buffer"
        }).appendTo(scroller);
    
        var whisper_line = $('<div/>', {
            id: "buddy-whisper-line"
        }).appendTo(container);
        
        whisper_input = $('<input/>', {
            id: "buddy-whisper-input",
            placeholder: "<username> <message to whisper>"
        }).appendTo(whisper_line);
        
        whisper_input.on("keydown", function(e) {
            if (e.keyCode == 13) {
                var text = whisper_input.val();
                if (text[0] == "@" && last_whisper_from != "") {
                    text = text.replace("@", last_whisper_from);
                }
                
                $api.send("/w " + text);
                whisper_input.val("");
                e.preventDefault();
            } else if (e.keyCode == 9) {
                chatTabComplete(whisper_input, " ");
                e.preventDefault();
            }
        });
        
        buffer.appendMessage = function(data) {
            var parts = stripHTML(data.msg).split(" ");
            if (parts.length > 0 && parts[0] != "You" && parts[0] != "You've") {
                last_whisper_from = parts[0];
            }
            Messages.format(data);
            
            var div = $('<div/>', {
                "class": "chat-msg"
            }).appendTo(buffer);
            if (loaded && data.name != $user.name) {
                div.addClass("flash");
            }
            $('<span/>', {
                "class": "timestamp",
                "text": "[" + formatTimestamp(data.time) + "]"
            }).appendTo(div);
            $('<span/>', {
                "class": "msg",
                "html": data.msg,
                "style": "color: " + data.meta.color
            }).appendTo(div);
    
            scroller.scrollTop(scroller.prop("scrollHeight"));
        };
    };
    
    var onNotice = function(e, data) {
        e.cancel();
        buffer.appendMessage(data);
        messages.push(data);
        if (messages.length > BUFFER_SAVE_SIZE) {
            messages.shift();
        }
    };
    
    var onReceive = function(e, data) {
        if (data.is_mentioned) {
            buffer.appendMessage({
                msg: "[#FFFFFF]" + data.username + " mentioned you:[/#] " + data.msg,
                meta: data.meta,
                time: data.time
            });
        }
    };
    
    var onMediaChange = function(e, data) {
        $.ajax({
            url: "/tracks/who/" + data.type + "/" + data.uid
        }).done(function(res) {
            if (res.length > 1) {
                var index = res.indexOf($user.name);
                if (index !== -1) {
                    res.splice(index, 1);
                    var joined = [res.slice(0, -1).join(', '), res.slice(-1)[0]].join(res.length < 2 ? '' : ' and ');
        
                    buffer.appendMessage({
                        msg: "You've played [i]" + data.title + "[/i] and so did " + joined + ".",
                        meta: {},
                        time: Date.now()
                    });
                }
            }
        });
    };
    
    $api.on("loaded", function() {
        appendStylesheet();
        appendContainer();
        
        $store.database.get("buddy-messages", [], function(err, prev) {
            messages = prev;
            $each(messages, function(data) {
                buffer.appendMessage(data);
            });
            
            $timer.interval("save-messages", SAVE_INTERVAL, function() {
                $store.database.set("buddy-messages", messages);
            });
            
            $api.on("notice whisper", onNotice);
            $api.on("receive", onReceive);
            $api.on("media_change", onMediaChange);
            loaded = true;
        });
    });
    
    $api.on("delete_script", function(e, filename) {
        if ($script.filename == filename) {
            $timer.clearAll();
            $store.database.remove("buddy-messages");
            $("#buddy-stylesheet").remove();
            $("#buddy-container").remove();
        }
    });
})();