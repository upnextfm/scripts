/**
 * Script: Greentext
 * Version: 1.A
 * Author: az4521
 * 
 * lets you do greentext
 * >tfw no gf
 *
 * probably super shit
 */
$api.on("send", function(e, data) {
    if(data.msg[0]==">"){
        data.msg = '[#789922]' + data.msg + '[/#]';
    }
});