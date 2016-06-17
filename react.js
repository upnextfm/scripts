/**
 * Script: Reaction GIFs
 * Version: 1.5
 * Author: headzoo
 *
 * Displays a random image from replygif.net based on your search term
 *
 * Use the command "/react [search-term]" where [search-term] is a simple
 * reaction term like "okay" or "clapping". The script provides autocomplete
 * which will suggest possible search terms.
 */
(function() {
    $.getJSON("/proxy/image?u=" + encodeURIComponent("http://replygif.net/api/tags?reaction=1&api-key=39YAprx5Yi"), function(res) {
        $('#chatline').textcomplete([
            {
                id: 'react',
                match: /\/react ([\w]*)$/,
                search: function (term, callback) {
                    callback($.map(res, function (tag) {
                        return tag.title.replace('/react', '').indexOf(term) === 0 ? tag.title : null;
                    }));
                },
                template: function (title) {
                    return title;
                },
                replace: function (title) {
                    return '/react ' + title;
                },
                index: 1
            }
        ], {
            maxCount: 8
        });
    });
    
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