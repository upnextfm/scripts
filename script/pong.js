/**
 * Name: Peer-To-Peer Pong
 * Version: 1.A
 * Author: az4521
 * 
 * I FINALLY GOT IT WORKING SLIGHTLY.
 * 
 * basically lets you start a pong game
 * with anyone else who has the script.
 *
 * commands:
 *     /pong [username]  - request to start a pong game with another user
 *     /pong accept      - accept a request to start a pong game
 *     /pong decline     - decline a request to start a pong game
 *
 * bugs:
 *     something with collision detection on client-side paddle. makes everything register as a collision.
 *     lags a bunch with high ping connections
 *     no way to end the game without refreshing the page
 *     uses enough CPU to make the fan in my laptop sound like a jet engine
 */

//create canvas
function pong_add(){
    var canv = $("<canvas id='pong' width=640 height=480 style='width:50%'>get a better browser</canvas>");
    $("#pong").remove();
    $("#leftpane").append(canv);
}
//P2P setup stuff
client = 0;possible_peer="";peer=""
$chat.on("send",function(e,data){
	if(data.msg.toLowerCase().indexOf("/pong ")===0){
	        e.cancel();
		if (client===0){
			possible_peer = data.msg.replace("/pong ","").trim();
			$chat.command(possible_peer,"init_pong_p2p");
			$chat.notice("Pong request sent");
		}
		else {
			if(data.msg.toLowerCase()=="/pong accept"){
				$chat.command(possible_peer,"accept_pong_p2p");pong_add();animate_pong(update_pong);peer=possible_peer;
			}
			if(data.msg.toLowerCase()=="/pong decline"){
				$chat.command(possible_peer,"decline_pong_p2p");
			}
		}
	}
});
$chat.on("command",function(e,data){
	if(data.data == "init_pong_p2p"){
		client=1;
		$chat.notice("Incoming pong request");
		$chat.notice("Accept with /pong accept");
		$chat.notice("Decline with /pong decline");
		possible_peer = data.from;
	}
	if(data.data=="accept_pong_p2p"){
		$chat.notice("Pong request accepted")
		$chat.notice("Starting game...")
		peer = data.from;client=0;possible_peer="";pong_add();animate_pong(update_pong);
	}
	if(data.data=="decline_pong_p2p"){
		$chat.notice("Pong request denied")
		peer = "";possible_peer="";client=0
	}
});
//get animation crap
animate_pong=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback){window.setTimeout(callback, 1000/60)};
//init variables
ballx=320;bally=290;ballxspeed=0;ballyspeed=0;p1y=250;p2y=250;p1s=0;p2s=0;keys_down=[0,0];
function update_pong(){ //key controller
	document.onkeydown=function(e){switch(e.keyCode){
			case 87:
				keys_down[0]=1;break;
			case 83:
				keys_down[1]=1;break;}};
	document.onkeyup=function(e){switch(e.keyCode){
			case 87:
				keys_down[0]=0;break;
			case 83:
				keys_down[1]=0;break;}};
	if(keys_down[0]==1){p1y-=4;};
	if(keys_down[1]==1){p1y+=4;};
	if (p1y<100){p1y=100;};
	if (p1y>400){p1y=400;};
	if(client){//client commands
		if (keys_down[0]||keys_down[1]){
			$chat.command(peer,"cy"+p1y);
		}
		$chat.on("command",function(e,data){
			if(data.data.indexOf("sy")===0){
				p2y=data.data.replace("sy","");
			}
			else if(data.data.indexOf("bx")===0){
				ballx=640-parseInt(data.data.replace("bx",""));
			}
			else if(data.data.indexOf("by")===0){
				bally=parseInt(data.data.replace("by",""));
			}
			else if(data.data.indexOf("ss")===0){
				p2s=data.data.replace("ss","");
			}
			else if(data.data.indexOf("cs")===0){
				p1s=data.data.replace("cs","");
			}
		});
	} else {
		//server commands
		if (bally>=470||bally<=110){ballyspeed*=-1;}
		ballx+=ballxspeed
		bally+=ballyspeed
		if (ballx<50 && bally>=p1y && bally<=p1y+80 && ballxspeed<0){ballxspeed*=-1;ballyspeed=((bally-p1y)/8)-5}
		if (ballx>590 && bally>=p2y && bally<=p2y+80 && ballxspeed>0){ballxspeed*=-1;ballyspeed=((bally-p2y)/8)-5;console.log(((bally-p2y)/8)-5)}
		$chat.command(peer,"bx"+(ballx));$chat.command(peer,"by"+(bally));
		if (!(ballxspeed||ballyspeed)){
			ballxspeed = Math.random() < 0.5 ? 1*2.5 : -1*2.5;
			ballyspeed = Math.floor(Math.random()*(3+3+1))-3;
			$chat.command(peer,"bx"+(ballx));$chat.command(peer,"by"+(bally));
		}
		if (ballx>650){ballx=320;bally=290;ballxspeed=0;ballyspeed=0;p2s+=1;$chat.command(peer,"cs"+p2s);}
		if (ballx<-10){ballx=320;bally=290;ballxspeed=0;ballyspeed=0;p1s+=1;$chat.command(peer,"ss"+p1s);}
		if(keys_down[0]||keys_down[1]){
			$chat.command(peer,"sy"+p1y);
		}
		$chat.on("command",function(e,data){
			if(data.data.indexOf("cy")===0){
				p2y=data.data.replace("cy","");
			}
		});
	}
	draw_pong(ballx,bally,p1y,p2y,p1s,p2s);
	animate_pong(update_pong);
};
function draw_pong(b_x,b_y,p1_y,p2_y,p1_s,p2_s) {
	canvas=document.getElementById("pong");
	canvas.tabIndex = 1;
	ctx=canvas.getContext("2d");
	ctx.font="90px Arial";
	ctx.fillStyle="black";
	ctx.fillRect(0,0,640,480);
	ctx.fillStyle="white";
	ctx.fillRect(20,p1_y,20,80);
	ctx.fillRect(600,p2_y,20,80);
	ctx.fillRect(b_x-10,b_y-10,20,20);
	ctx.fillRect(0,80,640,20);
	ctx.fillText(" "+p1_s+"                "+p2_s,40,70);
	for(i=0;i<5;i++){
		ctx.fillRect(315,i*80+111,10,40);
	};
};
