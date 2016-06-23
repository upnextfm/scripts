/**
 * Name: Ringtone
 * Version: 1.0
 * Author: headzoo
 * 
 * Plays an MP3 when your name is said in chat and you're not watching the
 * chat window.
 */
(function() {
    var audio   = null;
    var mp3_url = "";
    
    // Adds the mp3 url option to the chat menu.
    var addOptions = function() {
        $("#us-chat-ringtone-file-input")
            .parents(".form-group:first")
            .remove();
        
        var form  = $("#us-chat").find("form");
        var group = $options.makeInput(
            "us-chat-ringtone-file-input",
            "Ringtone MP3 URL",
            "text",
            "The URL of the MP3 file. Dropbox share links may be used, for example https://www.dropbox.com/s/ytfcv4jqxsdskky/song.mp3?dl=0."
        ).appendTo(form);
        $("#us-chat-ringtone-file-input").val(mp3_url);
    };
    
    // Embeds the audio player in the page.
    var addAudioPlayer = function() {
        $("#ringtone-audio-player").remove();
        
        audio = $('<audio id="ringtone-audio-player"/>');
        $("#wrap").append(audio);
        updateAudioSource();
    };
    
    // Updates the audio player source file.
    var updateAudioSource = function() {
        audio.empty();
        if (mp3_url) {
            var parsed = mp3_url;
            if (parsed.indexOf("https://www.dropbox.com/s/") === 0) {
                parsed = parsed.replace("www.dropbox.com", "dl.dropboxusercontent.com");
                parsed = parsed.replace("?dl=0", "");
            }
            
            var source = $('<source type="audio/mpeg"/>');
            source.attr("src", parsed);
            audio.append(source);
            audio[0].load();
        }
    };
    
    mp3_url = $store.local.get("ringtone-url", "");
    addOptions();
    addAudioPlayer();
    
    // Save the mp3 url to local storage.
    $api.on("user_options_save", function() {
        mp3_url = $("#us-chat-ringtone-file-input").val();
        if (mp3_url.indexOf("https://") !== 0) {
            return alert("Invalid MP3 URL. Must start with 'https://'.");
        }
        
        $store.local.set("ringtone-url", mp3_url);
        if (mp3_url) {
            updateAudioSource();
        }
    });
    
    // Play the audio when the page blinks.
    $api.on("blink", function() {
        if (mp3_url) {
            audio[0].play();
        }
    });
    
    // Stop the audio when the page stops blinking.
    $api.on("unblink", function() {
        if (mp3_url) {
            audio[0].pause();
            audio[0].currentTime = 0;
        }
    });
})();