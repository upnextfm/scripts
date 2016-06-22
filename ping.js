/**
 * Name: Ping
 * Version: 1.1
 * Author: headzoo
 * 
 * Displays your server ping time in the top right hand corner of the page.
 */
(function() {
    $("#ping-time-script").remove();
    var ping_time = $('<div id="ping-time-script" style="position: absolute; right: 16px; top: 52px;font-family: monospace;font-size:10px;">0ms</div>');
    $("#main").append(ping_time);
    
    var timer      = null;
    var start_time = null;
    var sendPing = function() {
        start_time = Date.now();
        socket.emit("chatPing", {});
    };
    
    var handlePong = function() {
        if (START_TIME !== null) {
            var elapsed = (Date.now()) - start_time;
            start_time  = null;
            ping_time.text(elapsed + "ms");
        }
    };
    
    socket.on("chatPong", handlePong);
    sendPing();
    timer = setInterval(function() {
        sendPing();
    }, 30000);
    
    $api.on("reloading", function() {
        if (timer) {
            clearInterval(timer);
        }
    });
})();