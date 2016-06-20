<h3 id="topic-overview-api">API</h3>
<p>
    Several objects are available to user scripts.
</p>
<ul style="margin:0;padding:0;list-style-type:none;">
    <li>
        <code id="topic-api-api" class="signature">$api</code>
        <p>
            Provides an interface to the chat API. The rest of this documentation covers the properties,
            methods, and events related to this object.
        </p>
    </li>
    <li>
        <code id="topic-api-channel" class="signature">$channel</code>
        <p>
            An object containing information about the channel you are in. The object contains several properties.
        </p>
        <pre style="margin-top: 12px;">
            <code class="language-javascript">
                {
                    bio: String,            // The channel bio/information.
                    css: String,            // The channel CSS.
                    js: String,             // The channel Javascript.
                    emotes: Array,          // An array of channel emotes.
                    motd: String,           // The channel message of the day.
                    name: String,           // The name of the channel.
                    usercount: Number       // The number of users in the channel.
                }
            </code>
        </pre>
    </li>
    <li>
        <code id="topic-api-user" class="signature">$user</code>
        <p>
            An object containing information about you. The object contains several properties.
        </p>
        <pre style="margin-top: 12px;">
            <code class="language-javascript">
                {
                    emotes: Array,          // An array of your personal emotes.
                    name: String,           // Your username.
                    profile: Object,        // Your profile information.
                    rank: Number            // Your channel rank.
                }
            </code>
        </pre>
    </li>
    <li>
        <code id="topic-api-options" class="signature">$options</code>
        <p>
            Reference to an object which represents the channel Options menu. It can be used
            to add additional options to the menu.
        </p>
    </li>
    <li>
        <code id="topic-api-proxy" class="signature">$proxy</code>
        <p>
            Wrapper for jQuery ajax shorthand methods, which sends request through the site proxy.
            Helps to get around CORS and TLS/SSL issues when making remote requests.
            See <a href="http://api.jquery.com/category/ajax/shorthand-methods" target="_blank">http://api.jquery.com/category/ajax/shorthand-methods</a>
        </p>
        <p>
            Contains the methods <code>$proxy.getJSON()</code>, <code>$proxy.getScript()</code>,
            <code>$proxy.get()</code>, and <code>$proxy.post()</code>.
        </p>
    </li>
    <li>
        <code id="topic-api-store" class="signature">$store</code>
        <p>
            Provides access to cookies, localStorage, and the site database key/value store.
            More information about the <code>$store</code> methods are covered in the
            <a href="#topic-api-methods" class="help-tc-root">methods</a> of this documentation.
        </p>
    </li>
    <li>
        <code id="topic-api-annotations" class="signature">$annotations</code>
        <p>
            Object of key/value pairs found in the head of the user script. For instance when
            the user script contains the following doc block:
        </p>
        <pre style="margin-top: 12px;">
            <code class="language-javascript">
                /**
                * Script: Reaction GIFs
                * Version: 1.5
                * Author: headzoo
                *
                * Displays a random image from replygif.net based on your search term
                */
            </code>
        </pre>
        <p>
            The <code>$annotations</code> object will contain the following values:
        </p>
        <pre style="margin-top: 12px;">
            <code class="language-javascript">
                {
                    "Script": "Reaction GIFs",
                    "Version": "1.5",
                    "Author": "headzoo"
                }
            </code>
        </pre>
    </li>
</ul>

<h5 id="topic-api-first-script">First Script</h5>
<p>
    From the site navigation menu click on Options and then Scripting. In the default text box,
    type (or paste) this code and click save.
</p>
<pre>
    <code class="language-javascript line-numbers">
        alert("Your username is " + $user.name + " and you are in the channel " + $channel.name);
    </code>
</pre>