/**
 * Name: Ringtone
 * Version: 1.2
 * Author: headzoo
 * 
 * Plays an MP3 when your name is mentioned in chat and you're not watching the
 * chat window. Choose from the built in ringtones or use your own.
 */
(function() {
    var audio       = null;
    var mp3_url     = "";
    var mp3_include = "0";
    var volume      = "1";
    var testing     = false;
    
    // Adds the ringtones tab/pane to the options menu.
    var addOptions = function() {
        $("#us-ringtone-tab").remove();
        $("#us-ringtone-pane").remove();
        
        var tab  = $options.makeTab("Ringtone", "us-ringtone-tab", "bell");
        var pane = $options.makePane("us-ringtone-pane", tab);
        var form = pane.form;
        $options.tabs().append(tab);
        $options.panes().append(pane);
        form.append($('<h4>Ringtone</h4>'));
        
        // Build in...
        $options.makeSelect(
            "us-chat-ringtone-select-input",
            "Built In Ringtone",
            {
                "0": "Choose...",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/Bleepies.mp3": "Bleepies",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/CountBass.mp3": "Count Bass",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/ElectroDnB.mp3": "Electro DnB",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/ForestFrolicLoop.mp3": "Forest Frolic",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/Goodnightmare.mp3": "Good Nightmare",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/Horns.mp3": "Horns",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/Jabberwocky.mp3": "Jabberwocky",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/PopcornSliderLoop.mp3": "Popcorn",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/Punchline.mp3": "Punchline",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/RaggaCoolIsland.mp3": "Cool Island",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/RobotBrainA.mp3": "Robot Brain",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/RubixCube.mp3": "Rubix Cube",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/SloppyBossaLoop.mp3": "Sloppy Bass",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/TechTalk.mp3": "Tech Talk",
                "https://s3.amazonaws.com/assets.upnext.fm/ringtones/ThinkingTensionA.mp3": "Thinking Tension"
            },
            "Use one of the built in ringtones."
        ).appendTo(form);
        $("#us-chat-ringtone-select-input")
            .val(mp3_include)
            .on("change", function() {
                if ($(this).val() != "0") {
                    $("#us-chat-ringtone-file-input").prop("disabled", true);
                    if (testing) {
                        stopTest();
                        playTest();
                    }
                } else {
                    $("#us-chat-ringtone-file-input").prop("disabled", false);
                    stopTest();
                }
            }).trigger("change");
            
        // Upload your own...
        $options.makeInput(
            "us-chat-ringtone-file-input",
            "or MP3 URL",
            "text",
            "The URL of the MP3 file. Dropbox share links may be used, for example https://www.dropbox.com/s/ytfcv4jqxsdskky/song.mp3?dl=0."
        ).appendTo(form);
        $("#us-chat-ringtone-file-input")
            .val(mp3_url)
            .on("change", function() {
                stopTest();
            });
    
        // Play volume...
        $options.makeSelect(
            "us-chat-ringtone-volume-select",
            "Volume",
            {
                "1": "High",
                "0.5": "Medium",
                "0.1": "Low"
            },
            "How loudly the ringtone is played."
        ).appendTo(form);
        $("#us-chat-ringtone-volume-select")
            .val(volume)
            .on("change", function() {
                if (audio) {
                    audio[0].volume = $(this).val();
                }
            });
        
        // Test button...
        form.append($options.makeButtonGroup([{
            id: "us-ringtone-test-btn",
            label: "Test"
        }]));
        $("#us-ringtone-test-btn").on("click", function() {
            if (testing) {
                stopTest();
            } else {
                playTest();
            }
        });
    };
    
    // Start playing the test sound.
    var playTest = function() {
        var mi = $("#us-chat-ringtone-select-input").val();
        var mu = $("#us-chat-ringtone-file-input").val();
        
        if (audio != null && (mu || mi != "0")) {
            if (mi != "0") {
                updateAudioSource(mi);
            } else {
                updateAudioSource(mu);
            }
            
            testing = true;
            audio[0].volume = $("#us-chat-ringtone-volume-select").val();
            audio[0].play();
            $("#us-ringtone-test-btn")
                .removeClass("btn-primary")
                .addClass("btn-default");
        }
    };
    
    // Stop playing the test sound.
    var stopTest = function() {
        if (audio != null) {
            testing = false;
            audio[0].pause();
            $("#us-ringtone-test-btn")
                .addClass("btn-primary")
                .removeClass("btn-default");
        }
    };
    
    // Embeds the audio player in the page.
    // @see http://www.w3schools.com/html/html5_audio.asp
    // @see http://www.w3schools.com/tags/ref_av_dom.asp
    var addAudioPlayer = function() {
        audio = $("#ringtone-audio-player");
        if (audio.length == 0) {
            audio = $('<audio id="ringtone-audio-player"/>');
            $("#wrap").append(audio);
            updateAudioSource();
        }
    };
    
    // Updates the audio player source file.
    var updateAudioSource = function(src) {
        audio.empty();
        
        if (src || mp3_url || mp3_include != "0") {
            var parsed;
            if (src !== undefined) {
                parsed = src;
            } else {
                parsed = (mp3_include != "0") ? mp3_include : mp3_url;
            }
            if (parsed.indexOf("https://www.dropbox.com/s/") === 0) {
                parsed = parsed.replace("www.dropbox.com", "dl.dropboxusercontent.com");
                parsed = parsed.replace("?dl=0", "");
            }
            
            var source = $('<source/>');
            source.attr("type", "audio/mpeg");
            source.attr("src", parsed);
            audio.append(source);
            audio[0].load();
        }
    };
    
    // Save the mp3 url to local storage.
    $chat.on("user_options_save", function() {
        stopTest();
        
        $store.local.set("ringtone-volume", volume);
        
        mp3_url = $("#us-chat-ringtone-file-input").val();
        if (mp3_url.length > 0 && mp3_url.indexOf("https://") !== 0) {
            return alert("Invalid MP3 URL. Must start with 'https://'.");
        }
        $store.local.set("ringtone-url", mp3_url);
        
        mp3_include = $("#us-chat-ringtone-select-input").val();
        if (mp3_url.length > 0 && mp3_url.indexOf("https://") !== 0) {
            return alert("Invalid MP3 URL. Must start with 'https://'.");
        }
        $store.local.set("ringtone-include", mp3_include);
        
        if (mp3_url || mp3_include != "0") {
            updateAudioSource();
        }
    });
    
    // Play the audio when the page blinks.
    $chat.on("blink", function() {
        if (mp3_url) {
            audio[0].volume = volume;
            audio[0].play();
        }
    });
    
    // Stop the audio when the page stops blinking.
    $chat.on("unblink", function() {
        if (mp3_url) {
            audio[0].pause();
            audio[0].currentTime = 0;
        }
    });
    
    // Setup.
    $chat.on("loaded", function() {
        mp3_url     = $store.local.get("ringtone-url", "");
        mp3_include = $store.local.get("ringtone-include", "0");
        volume      = $store.local.get("ringtone-volume", 1);
        addOptions();
        addAudioPlayer();
    });
    
    // Clean up.
    $api.on("delete_script", function(filename) {
        if ($script.filename == filename) {
            $store.local.remove("ringtone-url");
            $store.local.remove("ringtone-include");
            $store.local.remove("ringtone-volume");
            $("#ringtone-audio-player").remove();
            $("#us-ringtone-tab").remove();
            $("#us-ringtone-pane").remove();
        }
    });
})();