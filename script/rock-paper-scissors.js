/**
 * Name: Rock, Paper, Scissors
 * Version: 1.1
 * Author: headzoo
 * 
 * Play rock, paper, scissors against other users. Start a game by
 * typing '/rps <player1> <player2>' or use only one player to play
 * against the computer.
 */
(function() {
    var command_regex = new RegExp('^/rps\\s+([^\\s]+)(\\s+([^\\s]+))?', 'i');
    var game = null;
    
    function Game(player1, player2) {
        this.player1_name   = player1;
        this.player2_name   = player2;
        this.player1_answer = "";
        this.player2_answer = "";
        
        if (this.player2_name === undefined) {
            this.player2_name = "Computer";
            var rand = Math.random();
            if (rand < .33) {
                this.player2_answer = "rock";
            } else if (rand < .66) {
                this.player2_answer = "paper";
            } else {
                this.player2_answer = "scissors";
            }
        }
    }
    
    Game.prototype.isPlaying = function(name) {
        name = name.toLowerCase();
        return this.player1_name.toLowerCase() == name || this.player2_name.toLowerCase() == name;
    };
    
    Game.prototype.isFinished = function() {
        return this.player1_answer != "" && this.player2_answer != "";
    };
    
    Game.prototype.setAnswer = function(name, answer) {
        answer = answer.toLowerCase();
        if (answer != "rock" && answer != "paper" && answer != "scissors") {
            throw answer + " is invalid. Must be either rock, paper, or scissors.";
        }
        
        name = name.toLowerCase();
        if (this.player1_name.toLowerCase() == name) {
            this.player1_answer = answer;
        } else if (this.player2_name.toLowerCase() == name) {
            this.player2_answer = answer;
        }
    };
    
    Game.prototype.getWinner = function() {
        if (this.player1_answer == "" && this.player2_answer == "") {
            return "Both players lost!";
        } else if (this.player1_answer == "") {
            return this.player2_name + " won with " + this.player2_answer + ".";
        } else if (this.player2_answer == "") {
            return this.player1_name + " won with " + this.player1_answer + ".";
        }
        
        var name   = "";
        var answer = "";
        switch(this.player1_answer) {
            case "rock":
                switch(this.player2_answer) {
                    case "rock":
                        name = "tie";
                        break;
                    case "paper":
                        name   = this.player2_name;
                        answer = "Paper covers rock.";
                        break;
                    case "scissors":
                        name   = this.player1_name;
                        answer = "Rock breaks scissors.";
                        break;
                }
                break;
            case "paper":
                switch(this.player2_answer) {
                    case "rock":
                        name   = this.player1_name;
                        answer = "Paper covers rock.";
                        break;
                    case "paper":
                        name = "tie";
                        break;
                    case "scissors":
                        name   = this.player2_name;
                        answer = "Scissors cut paper.";
                        break;
                }
                break;
            case "scissors":
                switch(this.player2_answer) {
                    case "rock":
                        name   = this.player2_name;
                        answer = "Rock breaks scissors.";
                        break;
                    case "paper":
                        name   = this.player1_name;
                        answer = "Scissors cut paper.";
                        break;
                    case "scissors":
                        name   = "tie";
                        break;
                }
                break;
        }
        
        if (name == "tie") {
            return "Tie game. Both players said " + this.player1_answer + ".";
        }
        
        return name + " won! " + answer;
    };
    
    $chat.on("loaded", function() {
        $chat.on("receive", function(e, data) {
            var match = data.msg_clean.match(command_regex);
            if (match !== null) {
                if (match[1] == "stop") {
                    game = null;
                    return;
                }
            
                if (game !== null) {
                    $chat.send("[#FFFFFF]Rock-Paper-Scissors: A game is already in progress. Please wait.[/#]");
                } else {
                    (function() {
                        game = new Game(match[1], match[3]);
                        setTimeout(function() {
                            if (game !== null && !game.isFinished()) {
                                var winner = game.getWinner();
                                game = null;
                                $chat.send("[#FFFFFF]Rock-Paper-Scissors: " + winner + "[/#]");
                            }
                        }, 30000);
                        $chat.send(
                            "[#FFFFFF]Rock-Paper-Scissors: " + game.player1_name +
                            " vs. " + game.player2_name + ". Each player whisper your answer using `/w " +
                            $user.name + " <answer>`. You have 30 seconds.[/#]"
                        );
                    })();
                }
            }
        });
    
        $chat.on("whisper", function(e, data) {
            if (game !== null && game.isPlaying(data.name)) {
                e.cancel();
                
                try {
                    var answer = removeBBCodes(data.msg.trim());
                    answer     = answer.split(": ");
                    game.setAnswer(data.name, answer[1]);
                } catch (e) {
                    return $chat.send("/w " + data.name + " " + e);
                }
                
                if (game.isFinished()) {
                    var winner = game.getWinner();
                    game = null;
                    $chat.send("[#FFFFFF]Rock-Paper-Scissors: " + winner + "[/#]");
                }
            }
        });
    });
})();