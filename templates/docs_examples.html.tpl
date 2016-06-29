<h3 id="topic-examples">Examples</h3>
<h5 id="topic-api-examples-favorites">Queuing Favorites</h5>
<p>
    A user script that automatically queues one of your favorite videos every
    30 minutes.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // The "favorites" event is called when you enter chat. Save the favorites to a local variable.
        var favorites = [];
        $playlist.on("favorites", function(e, data) {
            favorites = data;
        });
    
        // Called when you add a new favorite. Add it to the list of favorites we're keeping track of.
        $playlist.on("favorite_add", function(e, data) {
            favorites.push(data.media);
        });

        // Every 30 minutes, grab one of the favorites at random, and add it to the playlist.
        setInterval(function() {
            var item = favorites[Math.floor(Math.random() * favorites.length)];
            if (item) {
                $playlist.queue(item);
            }
        }, 1800000); // 30 minutes in milliseconds
    </code>
</pre>

<h5 id="topic-api-examples-lucky">I'm Feeling Lucky</h5>
<p>
    Creates a <code>/lucky</code> command, which searches YouTube with a given search term,
    and queues the first video found. Install the script, and then type a search query into
    the chatbox using the command. For example: <code>/lucky grimes kill v maim</code>
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Register a callback which gets every message we send to the server. We'll use this
        // to parse our messages for the "/lucky" command.
        $chat.on("send", function(e, data) {
            if (data.msg.indexOf("/lucky ") === 0) {
                // We search when the message starts with the /lucky command.
                $playlist.search(data.msg.replace("/lucky ", ""));
        
                // Stop the message from being sent to the other users.
                e.cancel();
            }
        });

        // Register a callback to receive the search results. This gets called with the results of
        // calling the the $chat.search() method.
        $playlist.on("search_results", function(e, data) {
            if (data.results.length > 0) {
                // Queue the first video found in the results.
                $playlist.queue(data.results[0]);
            }
        });
    </code>
</pre>