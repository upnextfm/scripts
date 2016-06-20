/**
 * Script: Magic 8 Ball
 * Version: 1.0
 * Author: headzoo
 *
 * Creates a /8ball command which finds answers to your questions from beyond
 * our realm. Is it really magic? No one knows for sure.
 * 
 * Only one person in the room should run this script.
 */
(function() {
    var answers = [
        {text: "It is certain", color: "good"},
        {text: "It is decidedly so", color: "good"},
        {text: "Without a doubt", color: "good"},
        {text: "Yes, definitely", color: "good"},
        {text: "You may rely on it", color: "good"},
        {text: "As I see it, yes", color: "good"},
        {text: "Most likely", color: "good"},
        {text: "Outlook good", color: "good"},
        {text: "Yes", color: "good"},
        {text: "Signs point to yes", color: "good"},
        
        {text: "Reply hazy try again", color: "doubt"},
        {text: "Ask again later", color: "doubt"},
        {text: "Better not tell you now", color: "doubt"},
        {text: "Cannot predict now", color: "doubt"},
        {text: "Concentrate and ask again", color: "doubt"},
        
        {text: "Don't count on it", color: "bad"},
        {text: "My reply is no", color: "bad"},
        {text: "My sources say no", color: "bad"},
        {text: "Outlook not so good", color: "bad"},
        {text: "Very doubtful", color: "bad"}
    ];
    var color_map = {
        "good": "#00FF00",
        "doubt": "#999999",
        "bad": "#FF0000"
    };
    var regex = new RegExp('^/8ball\\s+(.*)');
    
    $api.on("receive", function(e, data) {
        var matches = data.msg_clean.match(regex);
        if (matches !== null) {
            setTimeout(function() {
                var item = answers[Math.floor(Math.random() * answers.length)];
                var color = color_map[item.color];
                $api.send("[#FFFFFF]Magic 8 Ball «[/#] [" + color + "]" + item.text.toLowerCase() + "[/#] [#FFFFFF]»[/#]");
            }, 2000);
        }
    });
})();