{% macro top() %}
    <a href="#top" class="top">
        <span class="glyphicon glyphicon-chevron-up"></span>
        Back to Top
    </a>
{% endmacro %}
{% include "head.html.tpl" %}
<div id="content">
    <div id="docs-container">
        <p>
            The site supports user scripting, which allows you to inject your own Javascript into <i>your</i>
            browser when you are inside of a channel. In addition, a light-weight API is provided so that
            you may build "bots" with user scripts.
        </p>
        <p>
            User scripts are created from the Options -> Scripting dialog. Your script are executed after clicking
            save, and when you enter the channel. You can put all of your code into the "Default" text box, or you
            can organize your scripts in multiple files. Which are shown as multiple tabs in on the scripting
            dialog.
        </p>
        
        <div id="docs-table-of-contents" class="list-style-type-none">
            <div class="docs-toc-col col-sm-6">
                <a href="#topic-overview-api" class="docs-tc-root">API</a>
                <ul>
                    <li><a href="#topic-api-api">$api</a></li>
                    <li><a href="#topic-api-channel">$channel</a></li>
                    <li><a href="#topic-api-user">$user</a></li>
                    <li><a href="#topic-api-options">$options</a></li>
                    <li><a href="#topic-api-proxy">$proxy</a></li>
                    <li><a href="#topic-api-store">$store</a></li>
                    <li><a href="#topic-api-timer">$timer</a></li>
                    <li><a href="#topic-api-script">$script</a></li>
                    <li><a href="#topic-api-stylesheet">$stylesheet</a></li>
                    <li><a href="#topic-api-first-script">First Script</a></li>
                </ul>
    
                <a href="#topic-api-methods" class="docs-tc-root" style="display:block;margin-top: 20px;">Methods</a>
                <ul>
                    <li><a href="#topic-api-methods-set-storage">$store.local.set()</a></li>
                    <li><a href="#topic-api-methods-get-storage">$store.local.get()</a></li>
                    <li><a href="#topic-api-methods-remove-storage">$store.local.remove()</a></li>
                    <li><a href="#topic-api-methods-set-database">$store.database.set()</a></li>
                    <li><a href="#topic-api-methods-get-database">$store.database.get()</a></li>
                    <li><a href="#topic-api-methods-remove-database">$store.database.remove()</a></li>
                    <li><a href="#topic-api-methods-keys-database">$store.database.keys()</a></li>

                    <li><a href="#topic-api-methods-timer-interval">$timer.interval()</a></li>
                    <li><a href="#topic-api-methods-timer-once">$timer.once()</a></li>
                    <li><a href="#topic-api-methods-timer-clear">$timer.clear()</a></li>
                    <li><a href="#topic-api-methods-timer-clear-all">$timer.clearAll()</a></li>
                    <li><a href="#topic-api-methods-timer-has">$timer.has()</a></li>
                    
                    <li><a href="#topic-api-methods-send">$api.send()</a></li>
                    <li><a href="#topic-api-methods-notice">$api.notice()</a></li>
                    <li><a href="#topic-api-methods-command">$api.command()</a></li>
                    <li><a href="#topic-api-methods-toast">$api.toast()</a></li>
                    <li><a href="#topic-api-methods-queue">$api.queue()</a></li>
                    <li><a href="#topic-api-methods-dequeue-by-name">$api.dequeueByName()</a></li>
                    <li><a href="#topic-api-methods-skip">$api.skip()</a></li>
                    <li><a href="#topic-api-methods-vote">$api.vote()</a></li>
                    <li><a href="#topic-api-methods-playlist-clear">$api.playlistClear()</a></li>
                    <li><a href="#topic-api-methods-playlist-shuffle">$api.playlistShuffle()</a></li>
                    <li><a href="#topic-api-methods-playlist-lock">$api.playlistLock()</a></li>
                    <li><a href="#topic-api-methods-search">$api.search()</a></li>
                    <li><a href="#topic-api-methods-clear">$api.clear()</a></li>
                    <li><a href="#topic-api-methods-color">$api.color()</a></li>
                    <li><a href="#topic-api-methods-ignore">$api.ignore()</a></li>
                    <li><a href="#topic-api-methods-unignore">$api.unignore()</a></li>
                    <li><a href="#topic-api-methods-kick">$api.kick()</a></li>
                    <li><a href="#topic-api-methods-mute">$api.mute()</a></li>
                    <li><a href="#topic-api-methods-smute">$api.smute()</a></li>
                    <li><a href="#topic-api-methods-unmute">$api.unmute()</a></li>
                    <li><a href="#topic-api-methods-ban-by-name">$api.banByName()</a></li>
                    <li><a href="#topic-api-methods-ban-by-ip">$api.banByIP()</a></li>
                    <li><a href="#topic-api-methods-users">$api.users()</a></li>
                </ul>
            </div>
            
            <div class="docs-toc-col col-sm-6">
                <a href="#topic-api-events" class="docs-tc-root">Events</a>
                <ul>
                    <li><a href="#topic-api-events-loaded">loaded</a></li>
                    <li><a href="#topic-api-events-reloaded">reloaded</a></li>
                    <li><a href="#topic-api-events-delete-script">delete_script</a></li>
                    <li><a href="#topic-api-events-receive">receive</a></li>
                    <li><a href="#topic-api-events-send">send</a></li>
                    <li><a href="#topic-api-events-notice">notice</a></li>
                    <li><a href="#topic-api-events-whisper">whisper</a></li>
                    <li><a href="#topic-api-events-command">command</a></li>
                    <li><a href="#topic-api-events-user-join">user_join</a></li>
                    <li><a href="#topic-api-events-user-leave">user_leave</a></li>
                    <li><a href="#topic-api-events-playlist">playlist</a></li>
                    <li><a href="#topic-api-events-queue">queue</a></li>
                    <li><a href="#topic-api-events-media-change">media_change</a></li>
                    <li><a href="#topic-api-events-media-update">media_update</a></li>
                    <li><a href="#topic-api-events-favorites">favorites</a></li>
                    <li><a href="#topic-api-events-favorite-add">favorite_add</a></li>
                    <li><a href="#topic-api-events-tags">tags</a></li>
                    <li><a href="#topic-api-events-votes">votes</a></li>
                    <li><a href="#topic-api-events-vote-value">vote_value</a></li>
                    <li><a href="#topic-api-events-emotes-personal">emotes_personal</a></li>
                    <li><a href="#topic-api-events-emotes-channel">emotes_channel</a></li>
                    <li><a href="#topic-api-events-afk">afk</a></li>
                    <li><a href="#topic-api-events-profile-menu">profile_menu</a></li>
                    <li><a href="#topic-api-events-user-options-save">user_options_save</a></li>
                    <li><a href="#topic-api-events-channel-option-save">channel_option_save</a></li>
                    <li><a href="#topic-api-events-save-scripts">save_scripts</a></li>
                    <li><a href="#topic-api-events-search-results">search_results</a></li>
                    <li><a href="#topic-api-events-color-change">color_change</a></li>
                    <li><a href="#topic-api-events-blink">blink</a></li>
                    <li><a href="#topic-api-events-unblink">unblink</a></li>
                </ul>
            </div>
    
            <div class="docs-toc-col col-sm-6">
                <a href="#topic-properties" class="docs-tc-root">Properties</a>
                <ul>
                    <li><a href="#topic-properties-version">version</a></li>
                </ul>
            </div>
            
            <div class="docs-toc-col col-sm-6">
                <a href="#topic-examples" class="docs-tc-root">Examples</a>
                <ul>
                    <li><a href="#topic-api-examples-favorites">Queuing Favorites</a></li>
                    <li><a href="#topic-api-examples-lucky">I'm Feeling Lucky</a></li>
                </ul>
            </div>
        </div>
        
        <section class="card">
            {% include "docs_api.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_properties.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_events.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_methods.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_examples.html.tpl" %}
            {{ top() }}
        </section>
    </div>
    
</div>
{% include "foot.html.twig" %}