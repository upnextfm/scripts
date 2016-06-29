<h1 id="topic-api-methods">Methods</h1>
<p>
    The API contains a few methods for interacting with the channel. For instance to send messages,
    queue songs, and vote skip videos.
</p>

<!-- $store.local.set() -->
<code id="topic-api-methods-set-storage" class="signature">$store.local.set(key, value)</code>
<p>
    Saves a value to local storage with the given value. All values are serialized
    before saving. Note that local storage is volatile, and values are not guaranteed
    to exist beyond the current browser session.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Saving a plain string.
        $store.local.set("gradient_color", "#FF0000");

        // Saving an object.
        $store.local.set("gradient_color", {
            red: 255,
            green: 0,
            blue: 0
        });
    </code>
</pre>

<!-- $store.local.get() -->
<code id="topic-api-methods-get-storage" class="signature">$store.local.get(key, default_value)</code>
<p>
    Returns a value from local storage. Values are automatically unserialized. Returns the
    <code>default_value</code> when the value does not exist in local storage.
    Note that local storage is volatile, and values are not guaranteed
    to exist beyond the current browser session.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Gets a value from local storage using the key "gradient_color".
        // This will return null if the value does not exist in storage.
        var color = $store.local.get("gradient_color");

        // Same as above, but will return the given default value when the value
        // does not exist in local storage.
        var color = $store.local.get("gradient_color", "#FF0000");
    </code>
</pre>

<!-- $store.local.remove() -->
<code id="topic-api-methods-remove-storage" class="signature">$store.local.remove(key)</code>
<p>
    Removes an item from local storage. Note that local storage is volatile, and values are not guaranteed
    to exist beyond the current browser session.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $store.local.remove("gradient_color");
    </code>
</pre>

<!-- $store.database.set() -->
<code id="topic-api-methods-set-database" class="signature">$store.database.set(key, value, callback)</code>
<p>
    Saves a value to permanent storage in the site database. The <code>key</code> param must be 150
    characters or less. The JSON encoded string value of <code>value</code> must be 5000 bytes
    or less. The <code>value</code> argument may be any kind of value, including arrays and objects.
</p>
<p>
    The optional <code>callback</code> argument is invoked when the operation is complete, and is
    passed any error that occurred as the first argument, and the result of the operation as
    the second argument. The second argument is object with the properties "affectedRows" and "changedRows".
</p>
<p>
    NOTE: Each account may only store 100 values in permanent storage.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $store.database.set("gradient_color", "#FF0000", function(err, res) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Affected rows " + res.affectedRows);
        });
    </code>
</pre>

<!-- $store.database.get() -->
<code id="topic-api-methods-get-database" class="signature">$store.database.get(key, default_value, callback)</code>
<p>
    Returns a value from permanent storage in the site's database. Returns the
    <code>default_value</code> when the value does not exist.
</p>
<p>
    The optional <code>callback</code> argument is a function which receives two values: any error that
    occurred and the value from the database.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // The value will be the default if the key does not exist in the database.
        $store.database.get("gradient_colors", "#FF0000", function(err, value) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Got value: " + value);
        });

        // The default argument is optional. Without a default the value will be
        // null when the key does not exist in the database.
        $store.database.get("gradient_colors", function(err, value) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Got value: " + value);
        });
    </code>
</pre>

<!-- $store.database.remove() -->
<code id="topic-api-methods-remove-database" class="signature">$store.database.remove(key, callback)</code>
<p>
    Removes an item from permanent storage in the site's database. The optional <code>callback</code>
    argument is invoked when the operation is complete, and is passed any error that occurred as
    the first argument, and the result of the operation as the second argument. The second argument
    is object with the properties "affectedRows" and "changedRows".
</p>
<pre>
    <code class="language-javascript line-numbers">
        $store.database.remove("gradient_color", function(err, res) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Affected rows " + res.affectedRows);
        });
    </code>
</pre>

<!-- $store.database.keys() -->
<code id="topic-api-methods-keys-database" class="signature">$store.database.keys(prefix, callback)</code>
<p>
    Returns an array of all <i>your</i> keys stored in the database. When <code>prefix</code> is not set
    you will get <i>all</i> of your keys. With <code>prefix</code> set to a non-empty value, you only
    get the keys that start with the given prefix.
</p>
<p>
    The optional <code>callback</code> argument is invoked when the operation is complete, and is
    passed any error that occurred as the first argument, and an array of keys as the second argument.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Get all keys
        $store.database.keys(function(err, keys) {
            if (err) {
                alert(err);
                return;
            }
            console.log(keys);
        });

        // Get keys prefixed with "foo"
        $store.database.keys("foo", function(err, keys) {
            if (err) {
                alert(err);
                return;
            }
            console.log(keys);
        });
    </code>
</pre>

<!-- $timer.interval() -->
<code id="topic-api-methods-timer-interval" class="signature">$timer.interval(name, time, callback)</code>
<p>
    A wrapper around the <code>setInterval()</code> function which sets a callback function to be executed
    at a regular interval. Automatically clears a previously set timer with the same name.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Sets a time to be called once every second.
        $timer.interval("my-timer", 1000, function() {
            console.log("tick");
        });

        // Sets the interval again. This will clear the first timer and
        // create a new one.
        $timer.interval("my-timer", 1000, function() {
            console.log("tock");
        });
    </code>
</pre>

<!-- $timer.once() -->
<code id="topic-api-methods-timer-once" class="signature">$timer.once(name, timeout, callback)</code>
<p>
    A wrapper around the <code>setTimeout()</code> function which sets a callback function to be executed
    once after the given <code>timeout</code>. Automatically clears a previously set timer with the same name.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Sets a timer to be called after 1 second has elapsed.
        $timer.once("my-timer", 1000, function() {
            console.log("tick");
        });

        // Sets the timer again. This will clear the first timer and
        // create a new one.
        $timer.once("my-timer", 1000, function() {
            console.log("tock");
        });
    </code>
</pre>

<!-- $timer.clear() -->
<code id="topic-api-methods-timer-clear" class="signature">$timer.clear(name)</code>
<p>
    A wrapper around the <code>clearTimeout()</code> and <code>clearInterval()</code> functions, which clears
    any timers that were set with the given name.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Sets a time to be called once every second.
        $timer.interval("my-timer", 1000, function() {
            console.log("tick");
        });

        // Now clear the interval.
        $timer.clear("my-timer");
    </code>
</pre>

<!-- $timer.clearAll() -->
<code id="topic-api-methods-timer-clear-all" class="signature">$timer.clearAll()</code>
<p>
    A wrapper around the <code>clearTimeout()</code> and <code>clearInterval()</code> functions, which clears
    <i>all</i> timers that have been set.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Sets a time to be called once every second.
        $timer.interval("my-timer", 1000, function() {
            console.log("tick");
        });

        // Sets a time to be called once every second.
        $timer.interval("my-timer-2", 1000, function() {
            console.log("tock");
        });

        // Now clear all the timers.
        $timer.clearAll();
    </code>
</pre>

<!-- $timer.has() -->
<code id="topic-api-methods-timer-has" class="signature">$timer.has(name)</code>
<p>
    Returns whether a timer has been set with the given name.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Sets a time to be called once every second.
        $timer.interval("my-timer", 1000, function() {
            console.log("tick");
        });

        // Displays "true".
        console.log($timer.has("my-timer"));
        
        // Displays "false".
        console.log($timer.has("another-timer"));
    </code>
</pre>

<!-- $chat.send() -->
<code id="topic-api-methods-send" class="signature">$chat.send(msg, meta)</code>
<p>
    Sends a message to everyone else in the chat room. The value of <code>msg</code> must be a string,
    which contains the message. The <code>meta</code> value is an object which may contain a property
    named "color", which sets the color of the text.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Will send the message "Hey everyone, headzoo has arrived!" or whatever
        // your username is.
        $chat.send("Hey everyone, I have arrived!");

        // Same message, but set the text color to green.
        $chat.send("Hey everyone, I have arrived!", { color: "#00FF00" });
    </code>
</pre>

<!-- $chat.notice() -->
<code id="topic-api-methods-notice" class="signature">$chat.notice(msg, is_error)</code>
<p>
    Writes the given notice message to your chat buffer. Set <code>is_error</code> to true
    to show an error notice.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Shows a regular notice.
        $chat.notice("Your song has been queued.");

        // Shows an error notice.
        $chat.notice("Could not find song.", true);
    </code>
</pre>

<!-- $chat.command() -->
<code id="topic-api-methods-command" class="signature">$chat.command(to, data)</code>
<p>
    Sends a command to other bots. The <code>to</code> argument must be the name of a user
    in the channel, or the pound sign "#" to broadcast the message to the whole room. The
    <code>data</code> argument may contain any kind of data, including strings, numbers,
    objects and arrays.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Send command to single user (bot)
        $chat.command("headzoo", {
            move: "up",
            pos: 3
        });

        // Broadcast command to entire channel
        $chat.command("#", {
            move: "up",
            pos: 3
        });
    </code>
</pre>

<!-- $chat.toast() -->
<code id="topic-api-methods-toast" class="signature">$chat.toast(msg, type, time_out)</code>
<p>
    Displays a popup message in the corner of the page. Valid values for <code>type</code> are
    "success", "warning", and "error". Defaults to "success". The <code>time_out</code> argument
    specifies how long the message is shown in milliseconds before fading out.
</p>
<p>
    See <a href="http://codeseven.github.io/toastr/demo.html" target="_blank">
        http://codeseven.github.io/toastr/demo.html
    </a>
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Show a success message.
        $chat.toast("Your song has been queued.");

        // Show a warning message.
        $chat.toast("Could not find user.", "warning");

        // Show an error message.
        $chat.toast("Failed to complete action.", "error");
    </code>
</pre>

<!-- $chat.clear() -->
<code id="topic-api-methods-clear" class="signature">$chat.clear()</code>
<p>
    Clears the chat buffer.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.clear();
    </code>
</pre>

<!-- $chat.color() -->
<code id="topic-api-methods-color" class="signature">$chat.color(hex_code)</code>
<p>
    Sets the chat text color.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.color("#c13b3b");
    </code>
</pre>

<!-- $chat.ignore() -->
<code id="topic-api-methods-ignore" class="signature">$chat.ignore(name)</code>
<p>
    Puts the named user on ignore.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.ignore("az4521");
    </code>
</pre>

<!-- $chat.unignore() -->
<code id="topic-api-methods-unignore" class="signature">$chat.unignore(name)</code>
<p>
    Takes the named user off ignore.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.unignore("az4521");
    </code>
</pre>

<!-- $chat.kick() -->
<code id="topic-api-methods-kick" class="signature">$chat.kick(name, reason)</code>
<p>
    Kicks the named user from the chat room with the optional reason.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.kick("az4521", "Being a troll.");
    </code>
</pre>

<!-- $chat.mute() -->
<code id="topic-api-methods-mute" class="signature">$chat.mute(name)</code>
<p>
    Mutes the named user. Only applicable to moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.mute("az4521");
    </code>
</pre>

<!-- $chat.smute() -->
<code id="topic-api-methods-smute" class="signature">$chat.smute(name)</code>
<p>
    Shadow mutes the named user. Only applicable to moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.smute("az4521");
    </code>
</pre>

<!-- $chat.unmute() -->
<code id="topic-api-methods-unmute" class="signature">$chat.unmute(name)</code>
<p>
    Unmutes the named user. Only applicable to moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.unmute("az4521");
    </code>
</pre>

<!-- $chat.banByName() -->
<code id="topic-api-methods-ban-by-name" class="signature">$chat.banByName(name, reason)</code>
<p>
    Bans the named user by their username with an optional reason. Only applicable to moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.banByName("az4521", "Being a troll.");
    </code>
</pre>

<!-- $chat.banByIP() -->
<code id="topic-api-methods-ban-by-ip" class="signature">$chat.banByIP(name, reason)</code>
<p>
    Bans the named user by their IP address with an optional reason. Only applicable to moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $chat.banByIP("az4521", "Being a troll.");
    </code>
</pre>

<!-- $chat.users() -->
<code id="topic-api-methods-users" class="signature">$chat.users()</code>
<p>
    Returns an array of names for each user in the channel.
</p>
<pre>
    <code class="language-javascript line-numbers">
        var names = $chat.users();
        console.log(names);
    </code>
</pre>

<!-- $playlist.queue() -->
<code id="topic-api-methods-playlist-queue" class="signature">$playlist.queue(video)</code>
<p>
    Adds a video to the playlist. The value of the <code>video</code> argument may be one of two things:<br />
    String: A media url, such as the url to a YouTube video.<br />
    Object: A media object. Must contain the properties "uid", "type", and "title".
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Queue a video from a media url.
        $playlist.queue("https://www.youtube.com/watch?v=OsCfufAp2tM");

        // Queue a video using a media object.
        $playlist.queue({
            type: "yt",                   // It's a YouTube video
            uid: "OsCfufAp2tM",           // The id of the video
            title: "Grimes - California"  // The title of the video
        });
    </code>
</pre>

<!-- $playlist.dequeueByName() -->
<code id="topic-api-methods-playlist-dequeue-by-name" class="signature">$playlist.dequeueByName(username)</code>
<p>
    Removes videos from the playlist that have been queued by the given user.
    Only applicable to moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $playlist.dequeueByName("headzoo");
    </code>
</pre>

<!-- $playlist.skip() -->
<code id="topic-api-methods-playlist-skip" class="signature">$playlist.skip()</code>
<p>
    Vote skips the currently playing video.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $playlist.skip();
    </code>
</pre>

<!-- $playlist.vote() -->
<code id="topic-api-methods-playlist-vote" class="signature">$playlist.vote(value)</code>
<p>
    Votes for the currently playing video. Valid values for the <code>value</code> are 1 to up vote
    the video, or -1 to down vote the video. Calling the method a second time with the same value
    toggles the vote.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Up vote the video.
        $playlist.vote(1);

        // Take back the up vote by calling again with the same value.
        $playlist.vote(1);

        // Down vote the video.
        $playlist.vote(-1);

        // Take back the down vote by calling again with the same value.
        $playlist.vote(-1);
    </code>
</pre>

<!-- $playlist.clear() -->
<code id="topic-api-methods-playlist-clear" class="signature">$playlist.clear()</code>
<p>
    Clears the playlist. Only applicable to chat moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $playlist.clear();
    </code>
</pre>

<!-- $playlist.shuffle() -->
<code id="topic-api-methods-playlist-shuffle" class="signature">$playlist.shuffle()</code>
<p>
    Shuffles the playlist. Only applicable to chat moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $playlist.shuffle();
    </code>
</pre>

<!-- $playlist.lock() -->
<code id="topic-api-methods-playlist-lock" class="signature">$playlist.lock()</code>
<p>
    Toggles the playlist lock on and off. Only applicable to chat moderators.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $playlist.lock();
    </code>
</pre>

<!-- $playlist.search() -->
<code id="topic-api-methods-playlist-search" class="signature">$playlist.search(query, type)</code>
<p>
    Searches YouTube for videos matching the given <code>query</code> argument. The <code>type</code>
    argument defaults to "yt" and is currently ignored. Used in conjunction with the
    <code>search_results</code> event.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Register an event which receives the search results.
        $playlist.on("search_results", function(e, data) {
            if (data.results.length > 0) {
                $playlist.queue(data.results[0]);
            }
        });

        // Now perform the search.
        $playlist.search("Grimes");
    </code>
</pre>