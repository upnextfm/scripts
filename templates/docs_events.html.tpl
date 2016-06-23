<h3 id="topic-api-events">Events</h3>
<p>
    Interacting with the channel is mostly done through the use of event callbacks. The following code
    demonstrates the use of callbacks to CAPITALIZE every message you send. Callbacks are registered
    with events using the <code>$api.on()</code> method, which takes two arguments: the name of the
    event, and the callback function. The function will be called when an event with the given name
    is triggered.
</p>
<pre>
    <code class="language-javascript line-numbers">
        // Registers a callback which filters every message you send _before_ it gets sent
        // to the server, and subsequently broadcast to each user in the channel.
        $api.on("send", function(e, data) {
            // Every message you send will be automatically capitalized.
            data.msg = data.msg.toUpperCase();
        });
    </code>
</pre>
<pre>
    <code class="language-javascript line-numbers">
        // Registers a callback which filters every message you received from the server.
        $api.on("receive", function(e, data) {
            // Every message you receive will be automatically capitalized.
            data.msg = data.msg.toUpperCase();
        });
    </code>
</pre>

<h5>Event Names</h5>
<ul style="list-style-type: none; padding: 0;">
    <li id="topic-api-events-loaded">
        <code class="signature">loaded</code>
        Triggered after every page element has been loaded, and all user scripts have been loaded.
        Page elements are the user list, chat buffer, and video player. No data is passed to the callback.
    </li>
    <li id="topic-api-events-reloaded">
        <code class="signature">reloading</code>
        Triggered after the user scripts have been updated, and are about to be torn down and
        reinserted into the page. No data is passed to the callback.
    </li>
    <li id="topic-api-events-delete-script">
        <code class="signature">delete_script</code>
        Triggered before a script is deleted. The filename of the script being deleted is passed to the callback.
        This is triggered when any script is deleted, not just the script watching the event. Scripts should
        use <code>$script.filename</code> to check if its being deleted.
        <pre>
            <code class="language-javascript">
                $api.on("delete_script", function(e, filename) {
                    if ($script.filename == filename) {
                        console.log("Help! I'm being deleted!");
                    }
                });
            </code>
        </pre>
    </li>
    <li id="topic-api-events-receive">
        <code class="signature">receive</code>
        Triggered when a message is received from another user in the room. The callback gets a
        data object with the following properties.
        <pre>
            <code class="language-javascript">
                {
                    username: String,  // Name of the user that sent the message.
                    msg: String,       // The message sent by the user.
                    msg_clean: String, // Message without color codes.
                    time: Number,      // Time the message was sent.
                    meta: Object,      // Contains a "color" property with the text color.
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-send">
        <code class="signature">send</code>
        Triggered before sending a message to the other users in the room. The callback gets a data
        object which contains the details of your message.
        <pre>
            <code class="language-javascript">
                {
                    msg: String,  // The message you are sending.
                    meta: Object, // Contains a "color" property with your text color.
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-notice">
        <code class="signature">notice</code>
        Triggered when a notice is received from the server. Notices are used to notify users when
        someone up votes or favorites their videos.
        <pre>
            <code class="language-javascript">
                {
                    msg: String // The notice text
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-whisper">
        <code class="signature">whisper</code>
        Triggered when a whisper is received from another user. The callback gets an object which
        contains the whisper data.
        <pre>
            <code class="language-javascript">
                {
                    msg: String,  // The whisper text
                    meta: Object, // Meta information
                    time: Number, // Time the whisper was sent
                    name: String, // Name of the user who sent the whisper
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-command">
        <code class="signature">command</code>
        Triggered when the script receives a command. The callback gets an object which contains the
        command data.
        <pre>
            <code class="language-javascript">
                {
                    to: String,   // Name of the user receiving the command or "#" for the whole channel
                    from: String, // Name of the user that sent the command
                    data: Object  // The command data
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-user-join">
        <code class="signature">user_join</code>
        Triggered when a user joins the channel. The callback gets a data object with the user's details.
        <pre>
            <code class="language-javascript">
                {
                    name: String,  // The user's name
                    rank: Number,  // The user's rank
                    meta: Object,  // Contains properties such as "afk"
                    profile: Object, // Contains "image" (avatar url), and "text" (tagline)
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-user-leave">
        <code class="signature">user_leave</code>
        Triggered when a user leaves the channel. The callback gets an object with the user's name.
        <pre>
            <code class="language-javascript">
                {
                    name: String,  // The user's name
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-playlist">
        <code class="signature">playlist</code>
        Triggered when the channel receives the list of videos in the playlist. The callback gets an
        <i>array</i> of objects that describe each video.
        <pre>
            <code class="language-javascript">
                {
                    queueby: String,  // Name of the user that queued the video
                    media: Object     // Describes the video
                }
            </code>
        </pre>
        <p>
            The "media" property contains the following values.
        </p>
        <pre>
            <code class="language-javascript">
                {
                    duration: Number, // Human readable video duration, e.g. "00:00"
                    seconds: Number,  // Video duration in seconds
                    uid: String,      // Typically a YouTube video id
                    title: String,    // Title of the video
                    type: String,     // "yt" for YouTube videos, "sc" for soundcloud, etc
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-queue">
        <code class="signature">queue</code>
        Triggered before a video gets added to the playlist. The callback gets an object describing where
        the video is being added to the playlist, and a media object.
        <pre>
            <code class="language-javascript">
                {
                    after: Number,  // Video is being inserted after this index
                    item: Object    // Info about the video
                }
            </code>
        </pre>
        <p>
            The "item" property contains information about the video.
        </p>
        <pre>
            <code class="language-javascript">
                {
                    queueby: String,  // Name of the user that queued the video
                    media: Object     // Describes the video
                }
            </code>
        </pre>
        <p>
            The "media" property contains the following values.
        </p>
        <pre>
            <code class="language-javascript">
                {
                    duration: Number, // Human readable video duration, e.g. "00:00"
                    seconds: Number,  // Video duration in seconds
                    uid: String,      // Typically a YouTube video id
                    title: String,    // Title of the video
                    type: String,     // "yt" for YouTube videos, "sc" for soundcloud, etc
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-media-change">
        <code class="signature">media_change</code>
        Triggered before the next song in the playlist begins to play. The callback gets a media object.
        <pre>
            <code class="language-javascript">
                {
                    duration: Number,    // Human readable video duration, e.g. "00:00"
                    seconds: Number,     // Video duration in seconds
                    currentTime: Number, // Time where the video will start to play
                    paused: Boolean,     // Whether the video is paused
                    uid: String,         // Typically a YouTube video id
                    title: String,       // Title of the video
                    type: String,        // "yt" for YouTube videos, "sc" for soundcloud, etc
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-media-update">
        <code class="signature">media_update</code>
        Triggered when the time/synchronization information for the currently playing video updates.
        Typically fires every few seconds. The callback gets an object describing the position
        in the currently playing video.
        <pre>
            <code class="language-javascript">
                {
                    currentTime: Float, // Current position in seconds
                    paused: Boolean,    // Whether the video is paused
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-favorites">
        <code class="signature">favorites</code>
        Triggered when the server sends your list of favorited videos. The callback gets an <i>array</i>
        of objects describing each video.
        <pre>
            <code class="language-javascript">
                {
                    favorite_id: Number, // The favorite id
                    media_id: Number,    // The media id
                    seconds: Number,     // The video duration in seconds
                    time: Number,        // Date/time when the video was favorited
                    uid: String,         // Typically a YouTube video id
                    title: String,       // Title of the video
                    type: String,        // "yt" for YouTube videos, "sc" for soundcloud, etc
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-favorite-add">
        <code class="signature">favorite_add</code>
        Triggered when you have favorited a video. The callback gets an object with the tags used, and
        information about the media.
        <pre>
            <code class="language-javascript">
                {
                    tags: Array,  // Array of strings representing the tags applied to the favorite
                    media: Object // Object describing the video
                }
            </code>
        </pre>
        <p>
            The "media" object contains the following properties.
        </p>
        <pre>
            <code class="language-javascript">
                {
                    id: Number,          // The favorite id
                    seconds: Number,     // The video duration in seconds
                    time: Number,        // Date/time when the video was favorited
                    uid: String,         // Typically a YouTube video id
                    title: String,       // Title of the video
                    type: String,        // "yt" for YouTube videos, "sc" for soundcloud, etc
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-tags">
        <code class="signature">tags</code>
        Triggered when the server sends a list of all tags you have used. The callback gets an array
        of strings, where each string is a tag. For example:
        <pre>
            <code class="language-javascript">
                ["80s", "90s", "Rock", "Kpop"]
            </code>
        </pre>
    </li>
    <li id="topic-api-events-votes">
        <code class="signature">votes</code>
        Triggered when the votes for the currently playing video have changed. The callback gets an
        object with the number of up votes and down votes for the video.
        <pre>
            <code class="language-javascript">
                {
                    up: Number,   // The number of up votes
                    down: Number  // The number of down votes
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-vote-value">
        <code class="signature">vote_value</code>
        Triggered when the vote you gave to the video changes. The callback gets a number that indicates
        how you voted: -1, 1, or 0, indicating whether you down voted, up voted, or remain neutral
        on the vote.
    </li>
    <li id="topic-api-events-emotes-personal">
        <code class="signature">emotes_personal</code>
        Triggered when the server sends your personal emotes. The callback receives an <i>array</i> of
        objects which describe the emote.
        <pre>
            <code class="language-javascript">
                {
                    image: String, // URL of the emote image
                    name: String,  // The string value that triggers the emote
                    regex: RegExp  // Used to find the emote in strings
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-emotes-channel">
        <code class="signature">emotes_channel</code>
        Triggered when the server sends the channel emotes. The callback receives an <i>array</i> of
        objects which describe the emote.
        <pre>
            <code class="language-javascript">
                {
                    image: String, // URL of the emote image
                    name: String,  // The string value that triggers the emote
                    regex: RegExp  // Used to find the emote in strings
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-afk">
        <code class="signature">afk</code>
        Triggered when a user goes afk or comes back from afk. The callback gets an object detailing
        the user and whether they are coming are going into afk.
        <pre>
            <code class="language-javascript">
                {
                    name: String,   // The name of the user
                    afk: Boolean    // True if they are going afk, false if they are coming back
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-profile-menu">
        <code class="signature">profile_menu</code>
        Triggered when the popup profile menu is created for each user in the user list. The callback
        receives a jQuery element with the content of the menu.
    </li>
    <li id="topic-api-events-user-options-save">
        <code class="signature">user_options_save</code>
        Triggered when the user options are being saved. The callback receives an object which represent
        the settings key/value pairs. For example:
        <pre>
            <code class="language-javascript">
                {
                    ignore_channelcss: false
                    ignore_channeljs: false
                    joinmessage: true,
                    show_colors: true
                    show_joins: true
                    show_notices: true,
                    ...
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-channel-option-save">
        <code class="signature">channel_option_save</code>
        Triggered when a single channel option is being saved. Only applicable to admins and mods. The
        callback receives an object which represents the setting key/value pair. For example:
        <pre>
            <code class="language-javascript">
                {
                    join_msg: "Welcome to the lobby!"
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-save-scripts">
        <code class="signature">save_scripts</code>
        Triggered when the scripts are being saved. The callback receives an <i>array</i> of objects which
        have these properties.
        <pre>
            <code class="language-javascript">
                {
                    name: String,  // The name of the script
                    script: String // The script text
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-search-results">
        <code class="signature">search_results</code>
        Triggered with the results of a YouTube search. The callback gets an object which contains
        the results of the search.
        <pre>
            <code class="language-javascript">
                {
                    source: String,   // Always "yt" for YouTube
                    results: Array    // An array of objects representing found videos
                }
            </code>
        </pre>
        <p>
            The "results" property is an array of objects with the following properties.
        </p>
        <pre>
            <code class="language-javascript">
                {
                    duration: String,    // Human readable video duration, e.g. "00:00"
                    seconds: Number,     // The video duration in seconds
                    thumb: Object,       // Contains a "url" property with the thumbnail url
                    uid: String,         // Typically a YouTube video id
                    title: String,       // Title of the video
                    type: String,        // "yt" for YouTube videos, "sc" for soundcloud, etc
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-color-change">
        <code class="signature">color_change</code>
        Triggered when the text color is changed. Fires when the page initially loads as well. The
        callback gets a string with the html color code.
    </li>
    <li id="topic-api-events-blink">
        <code class="signature">blink</code>
        Triggered when the browser title bar is to blink because the user's name was said in chat. The callback
        receives the following object.
        <pre>
            <code class="language-javascript">
                {
                    title_text: String,    // Text that will appear in the title bar, e.g. "*Chat*"
                    blink_setting: String, // Blink setting, either "never", "onlyping", or "always"
                    blink_interval: Number // Speed of flashing title text. Lower equals faster, default is 1000.
                }
            </code>
        </pre>
    </li>
    <li id="topic-api-events-unblink">
        <code class="signature">unblink</code>
        Triggered when the receives focus and blinking is being turned off.
    </li>
</ul>

<h5>Event Object</h5>
<p>
    Each time a registered callback is invoked, it receives an event object as the first
    parameter. The event contains two methods.
</p>
<p>
    <code>Event.stop()</code> Called inside your callback will stop any other callbacks from
    processing the event. For example if you have three callbacks registered with the "receive"
    event, and the first callback calls <code>Event.stop()</code>, the other two registered callbacks
    will not be invoked.
</p>
<p>
    <code>Event.cancel()</code> Called inside your callback stops the channel from processing
    the message. For instance, the following code will prevent ALL messages from appearing in the
    chat buffer.
</p>
<pre>
    <code class="language-javascript line-numbers">
        $api.on("receive", function(e, data) {
            // This causes the channel to completely discard the message, and it won't
            // be shown in your chat buffer.
            e.cancel();
        });
    </code>
</pre>