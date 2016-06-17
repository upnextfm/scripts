/**
 * Script: Lucky
 * Version: 1.1
 * Author: headzoo
 *
 * Creates a /lucky command, which searches YouTube using the query following
 * the command, and queues the first video found.
 *
 * To use, copy this script into the Options->Scripting box. In the chat box
 * type something like "/lucky grimes kill v maim".
 */
(function() {
    var is_searching = false;
    
    $api.on("send", function(e, data) {
        if (data.msg.indexOf("/lucky ") === 0) {
            is_searching = true;
            $api.search(data.msg.replace("/lucky ", ""));
            e.cancel();
        }
    });
    
    $api.on("search_results", function(e, data) {
        if (is_searching) {
            if (data.results.length > 0) {
                $api.queue(data.results[0]);
            }
            is_searching = false;
        }
    });
})();