/**
 * Script: Lucky
 * Version: 1.0
 * Author: headzoo
 *
 * Creates a /lucky command, which searches YouTube using the query following
 * the command, and queues the first video found.
 *
 * To use, copy this script into the Options->Scripting box. In the chat box
 * type something like "/lucky grimes kill v maim".
 */
(function() {
    $api.on("send", function(e, data) {
        if (data.msg.indexOf("/lucky ") === 0) {
            $api.search(data.msg.replace("/lucky ", ""));
            e.cancel();
        }
    });
    
    $api.on("search_results", function(e, data) {
        if (data.results.length > 0) {
            $api.queue(data.results[0]);
        }
    });
})();