(function() {
    'use strict';
    
    var container, buffer;
    
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
                data.msg = removeBBCodes(data.msg);
            }
        }
    };
    
    var appendStylesheet = function() {
        $("#buddy-stylesheet").remove();
        $(
            '<style id="buddy-stylesheet" type="text/css">' +
            '#buddy-container {' +
                'margin: 12px;' +
                'padding: 12px;' +
                'height: 130px;' +
                'background-color: rgba(0,0,0,.8);' +
                'border: 1px solid #515151;' +
            '}' +
            '</style>'
        ).appendTo($("head"));
    };
    
    var appendContainer = function() {
        $("#buddy-container").remove();
        
        container = $('<div/>', {
            id: "buddy-container"
        }).prependTo($("#leftpane-inner"));
        buffer = $('<div/>', {
            id: "buddy-buffer"
        }).appendTo(container);
        
        buffer.appendMessage = function(data) {
            console.log(data);
            buffer.scrollTop(buffer.prop("scrollHeight"));
        };
        
        buffer.appendNotice = function(data) {
            Messages.format(data);
    
            var div = $('<div/>', {
                "class": "notice-message"
            }).appendTo(this);
    
            var span = $('<span/>', {
                "class": "timestamp",
                "text": "[" + formatTimestamp(data.time) + "]"
            }).appendTo(div);
    
            var message = $('<span/>', {
                "class": "msg",
                "html": data.msg
            }).appendTo(div);
            console.log(data.msg.length);
            this.scrollTop(this.prop("scrollHeight"));
        };
    };
    
    $api.on("loaded", function() {
        appendStylesheet();
        appendContainer();
        
        $api.on("notice whisper", function(e, data) {
            buffer.appendNotice(data);
        });
    });
})();