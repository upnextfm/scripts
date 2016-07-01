/**
 * Name: Greentext
 * Version: 1.B
 * Author: az4521
 * 
 * lets you do greentext
 * >tfw no gf
 *
 * probably super shit
 */
$chat.on("send", function(e, data) {
    if(data.msg[0]==">"){
        data.msg = '[#789922]' + data.msg + '[/#]';
    }
});
