var CHAT_LINE_COLOR = "";

var $user = {};
var $options = {
    /**
     *
     * @returns {null}
     */
    root: function() {},
    
    /**
     *
     * @returns {null}
     */
    tabs: function() {},
    
    /**
     *
     * @returns {null}
     */
    panes: function() {},
    
    /**
     *
     * @param label
     * @param tab_id
     * @param icon
     * @returns {*|jQuery|HTMLElement}
     */
    makeTab: function(label, tab_id, icon) {},
    
    /**
     *
     * @param pane_id
     * @param tab
     * @returns {*|jQuery|HTMLElement}
     */
    makePane: function(pane_id, tab) {},
    
    /**
     *
     * @param id
     * @param label
     * @returns {*|jQuery|HTMLElement}
     */
    makeCheckbox: function(id, label) {},
    
    /**
     *
     * @param id
     * @param label
     * @param [type] {String|*}
     * @returns {*|jQuery|HTMLElement}
     */
    makeInput: function(id, label, type) {},
    
    /**
     * 
     * @param buttons
     */
    makeButtonGroup: function(buttons) {}
};

var $store = {
    cookies: {
        "get": function(name, default_value) {},
        
        "set": function(name, value, days) {},
        
        "remove": function(name) {}
    },
    
    /**
     * Provides access to local storage
     */
    local: {
        /**
         * Gets an item from local storage
         *
         * @param key
         * @param default_value
         */
        "get": function(key, default_value) {},
        
        /**
         * Stores an item in local storage
         *
         * @param key
         * @param value
         */
        "set": function(key, value) {},
        
        /**
         * Removes an item from local storage
         *
         * @param key
         */
        "remove": function(key) {}
    },
    
    /**
     * Provides access to the site permanent key/value store.
     */
    database: {
        /**
         * Gets a value from the site database
         *
         * @param key
         * @param default_value
         * @param callback
         * @returns {*}
         */
        "get": function(key, default_value, callback) {},
        
        /**
         * Stores a value in the site database
         *
         * @param key
         * @param value
         * @param callback
         * @returns {*}
         */
        "set": function(key, value, callback) {},
        
        /**
         * Removes a value from the site database
         *
         * @param key
         * @param callback
         * @returns {*}
         */
        "remove": function(key, callback) {},
        
        /**
         * Gets a list of stored keys
         *
         * @param prefix
         * @param callback
         */
        "keys": function(prefix, callback) {}
    }
};

var $proxy = {
    "getJSON": function(url, data, success) {},
    
    "getScript": function(url, success) {},
    
    "get": function(url, data, success, data_type) {},
    
    "post": function(url, data, success, data_type) {}
}

var $api = {
    /**
     * Iterates over an object or array
     *
     * @param obj
     * @param cb
     */
    each: function (obj, cb) {},
    
    /**
     * Registers a callback with the named event
     *
     * @param event
     * @param callback
     */
    on: function (event, callback) {},
    
    /**
     * Sends a message to everyone else in the chat room
     *
     * @param msg
     * @param [meta]
     * @returns {ChatAPI}
     */
    send: function (msg, meta) {},
    
    /**
     * Writes the given notice message to your chat buffer
     *
     * @param msg
     * @param is_error
     */
    notice: function (msg, is_error) {},
    
    /**
     * Displays a popup message in the corner of the page
     *
     * @param msg
     * @param type
     * @param time_out
     */
    toast: function (msg, type, time_out) {},
    
    /**
     * Adds a video to the playlist
     *
     * @param url
     */
    queue: function (url) {},
    
    /**
     * Removes videos from the playlist that have been queued by the given user
     *
     * @param name
     */
    dequeueByName: function (name) {},
    
    /**
     * Vote skips the currently playing video
     */
    skip: function () {},
    
    /**
     * Votes for the currently playing video
     *
     * @param value
     */
    vote: function (value) {},
    
    /**
     * Clears the playlist
     */
    playlistClear: function () {},
    
    /**
     * Shuffles the playlist
     */
    playlistShuffle: function () {},
    
    /**
     * Toggles the playlist lock
     */
    playlistLock: function () {},
    
    /**
     * Searches YouTube for videos matching the given query argument
     *
     * @param query
     * @param type
     */
    search: function (query, type) {},
    
    /**
     * Clears the chat buffer
     */
    clear: function () {},
    
    /**
     * Sets the chat text color
     *
     * @param color
     */
    color: function (color) {},
    
    /**
     * Puts the named user on ignore
     *
     * @param name
     */
    ignore: function (name) {},
    
    /**
     * Takes the named user off ignore
     *
     * @param name
     */
    unignore: function (name) { },
    
    /**
     * Kicks the named user from the chat room with the optional reason
     *
     * @param name
     * @param reason
     */
    kick: function (name, reason) {},
    
    /**
     * Mutes the named user
     *
     * @param name
     */
    mute: function (name) {},
    
    /**
     * Shadow mutes the named user
     *
     * @param name
     */
    smute: function (name) {},
    
    /**
     * Unmutes the named user
     *
     * @param name
     */
    unmute: function (name) {},
    
    /**
     * Bans the named user by their username with an optional reason
     *
     * @param name
     * @param reason
     */
    banByName: function (name, reason) {},
    
    /**
     * Bans the named user by their IP address with an optional reason
     *
     * @param name
     * @param reason
     */
    banByIP: function (name, reason) {},
    
    /**
     * Triggers the named event
     *
     * @param name
     * @param data
     * @returns {ChatEvent}
     */
    trigger: function (name, data) {}
}

function parseBBCodes(msg) {}

function $each(obj, callback) {}