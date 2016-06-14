/**
 * Script: Auto Queue Favorites
 * Version: 1.0
 * Author: headzoo
 *
 * Automatically queues one of the songs from your favorites every
 * 30 minutes.
 */
(function() {
    var favorites = [];
    $api.on("favorites", function(e, data) {
        favorites = data;
    });
    
    $api.on("favorite_add", function(e, data) {
        favorites.push(data.media);
    });
    
    setInterval(function() {
        var item = favorites[Math.floor(Math.random() * favorites.length)];
        if (item) {
            $api.queue(item);
        }
    }, 1800000); // 30 minutes in milliseconds
})();