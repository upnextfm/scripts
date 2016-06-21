/**
 * Script: Ping
 * Version: 1.0
 * Author: headzoo
 * 
 * Displays your server ping time in the top right hand corner of the page.
 */
(function() {
    $("#ping-time-script").remove();
    var ping_time = $('<div id="ping-time-script" style="position: absolute; right: 16px; top: 52px;font-family: monospace;font-size:10px;">0ms</div>');
    $("#main").append(ping_time);
    
    var START_TIME = null;
    var sendPing = function() {
        START_TIME = Date.now();
        socket.emit("chatPing", {});
    };
    
    var handlePong = function() {
        var elapsed = (Date.now()) - START_TIME;
        START_TIME = null;
        ping_time.text(elapsed + "ms");
    };
    
    socket.on("chatPong", handlePong);
    sendPing();
    setInterval(function() {
        sendPing();
    }, 30000);
})();