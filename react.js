/**
 * Script: Reaction GIFs
 * Version: 1.0
 * Author: headzoo
 *
 * Displays a random image from replygif.net based on your search term
 *
 * Use the command "/react [search-term]" where [search-term] is a simple
 * reaction term like "okay" or "clapping". For example "/react clapping".
 */
(function() {
    $api.on("send", function(e, data) {
        var msg = data.msg.toLowerCase();
        if (msg.indexOf("/react ") === 0) {
            var query = msg.replace("/react ", "");
            var url   = "http://replygif.net/api/gifs?api-key=39YAprx5Yi&tag=" + query;
            
            $.getJSON("/proxy/image?u=" + encodeURIComponent(url), function(res) {
                if (res.length == 0) {
                    $api.notice("No reaction found.", true);
                } else {
                    var item = res[Math.floor(Math.random()*res.length)];
                    $api.send(item.file);
                }
            });
            
            e.cancel();
        }
    });
})();