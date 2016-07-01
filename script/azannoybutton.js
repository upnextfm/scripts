/**
 * Name: Az Irritation Button
 * Version: 1.D - API Chage Fix Edition Why Change It So much Headz
 * Adds a button that sends a message to a bot
 * bot then adds to a count of irritations per username
 * The bot replies with commands, which are then seen as a toast
 */
$chat.on("command", function(e,data){
    if(data.from=="az_bot"){
        $chat.toast(data.data);
    }
});
var azadd = function() {
	var az= $('<button class="btn btn-default btn-sm" id="az-button">Az Just Annoyed Me!</button>');
	az.on("click", function() {
		$chat.command("az_bot", "azannoy")
	});
	$("#az-button").remove();
	$(".chatbuttons > .btn-group").append(az);
};
azadd()
