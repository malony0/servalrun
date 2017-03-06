//requesAnimationFrame Prefix
(function(){
    var requestAnimationFrame=
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame;
    window.requestAnimationFrame=requestAnimationFrame;
})();

const ACCEL = 5; //加速度
const MAX_SPEED = 200; //最大速度
const MAX_COUNT = 4;
const IMAGE_WIDTH = 64;
const ADJUST = 16; //判定を画像にどれだけめり込ませるか？
const INTERVAL =200;

var X=0,Y=0; //画像の位置
var VX=0, VY=0; //画像の速度 
var MX=0, MY=0; //マウス位置
var relTX=0, relTY=0; //タップ位置(相対)
var dir=0; //0~7サーバルちゃんの向き。東側は+4,南(=0)から北上するごとに+1
var count=0;
var wW,wH; //ウィンドウサイズ

var moveFlg=0;
var isPc=0;

var startTime = new Date().getTime(); //描画開始時刻
var currentTime; //現在時刻
var status; //更新からどれだけ経ったか

//PC判別 iOSとAndroid以外は知らん
(function(){
    if(!navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)){
	isPc=1;
    }else{
	document.getElementById("titleimg").src="src/title2.png";
    }
})();

//画像の読み込み（ぽ）
/*==============
  デフォルト
  S 00/SW 03
  W 06/SE 15
  E 18/NW 09
  N 12/NE 21
  ============== */
charImage = new Array();
for(i=0;i<24;i++){
    charImage[i]=new Image();
}
charImage[0].src="src/s0.png";
charImage[1].src="src/s1.png";
charImage[2].src="src/s2.png";
charImage[3].src="src/sw0.png";
charImage[4].src="src/sw1.png";
charImage[5].src="src/sw2.png";
charImage[6].src="src/w0.png";
charImage[7].src="src/w1.png";
charImage[8].src="src/w2.png";
charImage[9].src="src/nw0.png";
charImage[10].src="src/nw1.png";
charImage[11].src="src/nw2.png";
charImage[12].src="src/n0.png";
charImage[13].src="src/n1.png";
charImage[14].src="src/n2.png";
charImage[15].src="src/se0.png";
charImage[16].src="src/se1.png";
charImage[17].src="src/se2.png";
charImage[18].src="src/e0.png";
charImage[19].src="src/e1.png";
charImage[20].src="src/e2.png";
charImage[21].src="src/ne0.png";
charImage[22].src="src/ne1.png";
charImage[23].src="src/ne2.png";


(function(){
    window.onclick=function(){
	document.getElementById("title").innerHTML="";
    }
    window.ontouchstart=function(){
	moveFlg=1;
	document.getElementById("title").innerHTML="";
    }
    
})();

getWindowSize();

/*==========================================*/
//メインループ
/*==========================================*/

(function loop(){
    //位置確認
    getCharImagePos();
    updateMouseByTouch();     //マウス位置更新（スマホのみ）
    getDirection();
    //再描画
    if(moveFlg==1){
	updateCharImageSpeed();
	updateCharImagePos();
    }
    drawCharImage();
    //	document.getElementById("output3").innerHTML="status:"+status+", count:"+count;
    
    //カウントアップ
    currentTime=new Date().getTime();
    status=currentTime-startTime;
    if(status>INTERVAL){
	startTime=new Date().getTime();
	count+=1;
	if(count>3) count=0;
    }
    
    window.requestAnimationFrame(loop);
})();


/*===============*/
/*関数定義*/
/*===============*/

//画面サイズ取得
function getWindowSize(){
    wW=window.innerWidth;
    wH=window.innerHeight;
    
  // document.getElementById("output6").innerHTML=wW+"*"+wH;
}

//マウス位置取得
function getMousePos(e){
    if(!e) e=window.event;
    
    MX=e.pageX;
    MY=e.pageY;
    
    //	document.getElementById("output1").innerHTML=MX+","+MY;
}

//タップ位置取得
function getTouchPos(e){
    if(!e) e=window.event;

    relTX=e.touches[0].pageX-X;
    relTY=e.touches[0].pageY-Y;

   //  document.getElementById("output10").innerHTML=relTX+","+relTY;
}

//タップ位置からマウス位置を更新
function updateMouseByTouch(){
    if(relTX!=0 || relTY!=0){
	MX=X+relTX;
	MY=X+relTY;
    }
}


//画像位置取得
function getCharImagePos(){
    var rect=document.getElementById("serval").getBoundingClientRect();
    X=rect.left + window.pageXOffset;
    Y=rect.top + window.pageYOffset;
    
    //	document.getElementById("output5").innerHTML="X:"+X+", Y;"+Y;
}

//画像から見たマウス方向
function getDirection(){
    dir=0;
    
    if(MX>X+IMAGE_WIDTH-ADJUST) dir+=4;
    if(X+ADJUST<=MX && MX<=X+IMAGE_WIDTH-ADJUST){
	if(MY<Y) dir=4;
    }else{
	if(MY>Y+IMAGE_WIDTH-ADJUST){
	    dir+=1;
	}else if(Y+ADJUST<=MY && MY<=Y+IMAGE_WIDTH-ADJUST){
	    dir+=2;
	}else if(MY<Y+ADJUST){
	    dir+=3;
	}
    }
    
    //	document.getElementById("output2").innerHTML=dir;
}

//方向・段階に応じた画像を返す
function drawCharImage(){
    if(count==3){
	document.getElementById("serval").src=charImage[3*dir+1].src; //4回目は2に戻るんだにゃ(po)
    }else{
	document.getElementById("serval").src=charImage[3*dir+count].src;
    }
}

//速度更新
function updateCharImageSpeed(){
    var DX=MX-(X+IMAGE_WIDTH/2),
	DY=MY-(Y+IMAGE_WIDTH/2),
	R=Math.ceil(Math.sqrt(DX*DX+DY*DY)),
	nVX= VX+ ACCEL*DX/R,
	nVY= VY+ ACCEL*DY/R,
	nX,
	nY;
    
    if(nVX<=MAX_SPEED && nVX>=(-1)*MAX_SPEED){
	VX=nVX;
    }
    if(nVY<=MAX_SPEED && nVY>=(-1)*MAX_SPEED){
	VY=nVY;
    }
}

//位置更新
function updateCharImagePos(){
    var imageStyle= document.getElementById("serval").style;
    
    nX=X+VX/50;
    nY=Y+VY/50;

    //範囲外に出てたら戻す
    if(nX<0){
	nX=0;
    }
    if(nY<0){
	nY=0;
    }
    if(nX+IMAGE_WIDTH>wW){
	nX=wW-IMAGE_WIDTH;
    }
    if(nY+IMAGE_WIDTH>wH){
	nY=wH-IMAGE_WIDTH;
    }

    //更新
    imageStyle.left=nX + "px";
    imageStyle.top=nY + "px";
    
    
    //	document.getElementById("output4").innerHTML="VX:"+VX+", VY:"+VY;
}


/*==========================================*/
//EventListen
/*==========================================*/
document.addEventListener("touchstart",function(){moveFlg=1;},false);
document.addEventListener("touchstart",getTouchPos,false);
document.addEventListener("touchmove",getTouchPos,{passive: false});
document.body.addEventListener("touchmove", function(e){e.preventDefault();},{passive:false}); //スクロール無効
document.addEventListener("mousemove",getMousePos,false);
document.addEventListener("mouseup", function(){ if(isPc==1){moveFlg=(moveFlg+1)%2;} }, false);
window.addEventListener("resize",getWindowSize,false);




