<div class="col-sm-3 card">
    <div id="sidebar">
        <img src="images/logo.png" style="width: 100%;" />
        <h2>Official upnext.fm script repository and API documentation.</h2>
        <ul class="sidebar-items">
            <li{% if active_sidebar_item == "scripts" %} class="active"{% endif %}>
                <a href="index.html" class="docs-tc-root">Scripts</a>
            </li>
            <li{% if active_sidebar_item == "installing" %} class="active"{% endif %}>
                <a href="installing.html" class="docs-tc-root">How To Install Scripts</a>
            </li>
            <li{% if active_sidebar_item == "docs" %} class="active"{% endif %}>
                <a href="docs.html" class="docs-tc-root">API Documentation</a>
                <div{% if active_sidebar_item != "docs" %} class="hidden"{% endif %}>
                    <a href="docs.html#topic-api-api" class="docs-tc-root sub">Overview</a>
                    <ul id="sidebar-item-api">
                        <li><a href="docs.html#topic-api-api">$api</a></li>
                        <li><a href="docs.html#topic-api-chat">$chat</a></li>
                        <li><a href="docs.html#topic-api-playlist">$playlist</a></li>
                        <li><a href="docs.html#topic-api-channel">$channel</a></li>
                        <li><a href="docs.html#topic-api-user">$user</a></li>
                        <li><a href="docs.html#topic-api-options">$options</a></li>
                        <li><a href="docs.html#topic-api-proxy">$proxy</a></li>
                        <li><a href="docs.html#topic-api-store">$store</a></li>
                        <li><a href="docs.html#topic-api-timer">$timer</a></li>
                        <li><a href="docs.html#topic-api-script">$script</a></li>
                        <li><a href="docs.html#topic-api-stylesheet">$stylesheet</a></li>
                        <li><a href="docs.html#topic-api-first-script">First Script</a></li>
                    </ul>
                    
                    <a href="docs.html#topic-properties" class="docs-tc-root sub">Properties</a>
                    <ul id="sidebar-item-properties">
                        <li><a href="docs.html#topic-properties-version">$api.version</a></li>
                    </ul>
        
                    <a href="docs.html#topic-api-methods" class="docs-tc-root sub">Methods</a>
                    <ul id="sidebar-item-methods">
                        <li><a href="docs.html#topic-api-methods-send">$chat.send()</a></li>
                        <li><a href="docs.html#topic-api-methods-notice">$chat.notice()</a></li>
                        <li><a href="docs.html#topic-api-methods-command">$chat.command()</a></li>
                        <li><a href="docs.html#topic-api-methods-toast">$chat.toast()</a></li>
                        <li><a href="docs.html#topic-api-methods-clear">$chat.clear()</a></li>
                        <li><a href="docs.html#topic-api-methods-color">$chat.color()</a></li>
                        <li><a href="docs.html#topic-api-methods-ignore">$chat.ignore()</a></li>
                        <li><a href="docs.html#topic-api-methods-unignore">$chat.unignore()</a></li>
                        <li><a href="docs.html#topic-api-methods-kick">$chat.kick()</a></li>
                        <li><a href="docs.html#topic-api-methods-mute">$chat.mute()</a></li>
                        <li><a href="docs.html#topic-api-methods-smute">$chat.smute()</a></li>
                        <li><a href="docs.html#topic-api-methods-unmute">$chat.unmute()</a></li>
                        <li><a href="docs.html#topic-api-methods-ban-by-name">$chat.banByName()</a></li>
                        <li><a href="docs.html#topic-api-methods-ban-by-ip">$chat.banByIP()</a></li>
                        <li><a href="docs.html#topic-api-methods-users">$chat.users()</a></li>
        
                        <li><a href="docs.html#topic-api-methods-playlist-queue">$playlist.queue()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-dequeue-by-name">$playlist.dequeueByName()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-skip">$playlist.skip()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-vote">$playlist.vote()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-clear">$playlist.clear()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-shuffle">$playlist.shuffle()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-lock">$playlist.lock()</a></li>
                        <li><a href="docs.html#topic-api-methods-playlist-search">$playlist.search()</a></li>
        
                        <li><a href="docs.html#topic-api-methods-set-storage">$store.local.set()</a></li>
                        <li><a href="docs.html#topic-api-methods-get-storage">$store.local.get()</a></li>
                        <li><a href="docs.html#topic-api-methods-remove-storage">$store.local.remove()</a></li>
                        <li><a href="docs.html#topic-api-methods-set-database">$store.database.set()</a></li>
                        <li><a href="docs.html#topic-api-methods-get-database">$store.database.get()</a></li>
                        <li><a href="docs.html#topic-api-methods-remove-database">$store.database.remove()</a></li>
                        <li><a href="docs.html#topic-api-methods-keys-database">$store.database.keys()</a></li>
        
                        <li><a href="docs.html#topic-api-methods-timer-interval">$timer.interval()</a></li>
                        <li><a href="docs.html#topic-api-methods-timer-once">$timer.once()</a></li>
                        <li><a href="docs.html#topic-api-methods-timer-clear">$timer.clear()</a></li>
                        <li><a href="docs.html#topic-api-methods-timer-clear-all">$timer.clearAll()</a></li>
                        <li><a href="docs.html#topic-api-methods-timer-has">$timer.has()</a></li>
                    </ul>
        
                    <a href="docs.html#topic-api-events" class="docs-tc-root sub">Events</a>
                    <ul id="sidebar-item-events">
                        <li><a href="docs.html#topic-api-events-delete-script">$api.delete_script</a></li>
                        <li><a href="docs.html#topic-api-events-save-scripts">$api.save_scripts</a></li>
        
                        <li><a href="docs.html#topic-api-events-loaded">$chat.loaded</a></li>
                        <li><a href="docs.html#topic-api-events-reloaded">$chat.reloaded</a></li>
                        <li><a href="docs.html#topic-api-events-receive">$chat.receive</a></li>
                        <li><a href="docs.html#topic-api-events-send">$chat.send</a></li>
                        <li><a href="docs.html#topic-api-events-notice">$chat.notice</a></li>
                        <li><a href="docs.html#topic-api-events-whisper">$chat.whisper</a></li>
                        <li><a href="docs.html#topic-api-events-command">$chat.command</a></li>
                        <li><a href="docs.html#topic-api-events-user-join">$chat.user_join</a></li>
                        <li><a href="docs.html#topic-api-events-user-leave">$chat.user_leave</a></li>
                        <li><a href="docs.html#topic-api-events-emotes-personal">$chat.emotes_personal</a></li>
                        <li><a href="docs.html#topic-api-events-emotes-channel">$chat.emotes_channel</a></li>
                        <li><a href="docs.html#topic-api-events-afk">$chat.afk</a></li>
                        <li><a href="docs.html#topic-api-events-profile-menu">$chat.profile_menu</a></li>
                        <li><a href="docs.html#topic-api-events-user-options-save">$chat.user_options_save</a></li>
                        <li><a href="docs.html#topic-api-events-channel-option-save">$chat.channel_option_save</a></li>
                        <li><a href="docs.html#topic-api-events-color-change">$chat.color_change</a></li>
                        <li><a href="docs.html#topic-api-events-blink">$chat.blink</a></li>
                        <li><a href="docs.html#topic-api-events-unblink">$chat.unblink</a></li>
        
                        <li><a href="docs.html#topic-api-events-playlist-loaded">$playlist.loaded</a></li>
                        <li><a href="docs.html#topic-api-events-queue">$playlist.queue</a></li>
                        <li><a href="docs.html#topic-api-events-media-change">$playlist.media_change</a></li>
                        <li><a href="docs.html#topic-api-events-media-update">$playlist.media_update</a></li>
                        <li><a href="docs.html#topic-api-events-favorites">$playlist.favorites</a></li>
                        <li><a href="docs.html#topic-api-events-favorite-add">$playlist.favorite_add</a></li>
                        <li><a href="docs.html#topic-api-events-tags">$playlist.tags</a></li>
                        <li><a href="docs.html#topic-api-events-votes">$playlist.votes</a></li>
                        <li><a href="docs.html#topic-api-events-vote-value">$playlist.vote_value</a></li>
                        <li><a href="docs.html#topic-api-events-search-results">$playlist.search_results</a></li>
                    </ul>
        
                    <a href="docs.html#topic-examples" class="docs-tc-root sub">Examples</a>
                    <ul id="sidebar-item-examples">
                        <li><a href="docs.html#topic-api-examples-favorites">Queuing Favorites</a></li>
                        <li><a href="docs.html#topic-api-examples-lucky">I'm Feeling Lucky</a></li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</div>
