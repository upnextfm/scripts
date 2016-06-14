/**
 * Script: Highlight Words
 * Version: 1.0
 * Author: headzoo
 *
 * Adds a new user option under the Options menu, where users can specify
 * a comma separated list of words that will be highlighted in the chat
 * buffer. Commonly used to specify a list of alternative names people use
 * for the user.
 */
(function() {
    // Add our setting to the Options menu.
    var words = localStorage.getItem("highlight-words");
    if (!words) words = "";
    
    $("#us-highlight-words-group").remove();
    var group = $('<div class="form-group" id="us-highlight-words-group"/>');
    $("#us-chat form:first").append(group);
    
    var label = $('<label class="control-label col-sm-4" for="us-highlight-words"/>');
    label.text("Highlight words. Comma separated.");
    group.append(label);
    
    var div = $('<div class="col-sm-8"/>');
    group.append(div);
    
    var input = $('<input type="text" class="form-control" id="us-highlight-words"/>');
    input.val(words);
    div.append(input);
    
    // Create a regex to match the highlight words.
    var escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    var split = words.split(",")
        .map(Function.prototype.call, String.prototype.trim)
        .map(escapeRegExp);
    var regex = new RegExp('\\b(' + split.join("|") + ')\\b', 'i');
    
    // Watch for the user saving the options, and save our words to local storage.
    $api.on("user_options_save", function() {
        words = input.val();
        localStorage.setItem("highlight-words", words);
    });
    
    // Highlight the chat when the regex matches.
    $api.on("receive", function(e, data) {
        if (regex.test(data.msg)) {
            data.meta.highlight = true;
        }
    });
})();