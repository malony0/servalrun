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
var dir=0; //0~7サーバルちゃんの向き。東側は+4,南(=0)から北上するごとに+1
var count=0;
var wW,wH; //ウィンドウサイズ

var moveFlg=0;

var startTime = new Date().getTime(); //描画開始時刻
var currentTime; //現在時刻
var status; //更新からどれだけ経ったか

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

/*==========================================*/
//メインループ
/*==========================================*/
(function(){
    window.onclick=function(){
	document.getElementById("title").innerHTML="";
    }
})();

getWindowSize();

(function loop(){
    //位置確認
    getCharImagePos();
    getDirection();
    //再描画
    if(moveFlg==1){
	moveCharImage();
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
    
    //	document.getElementById("output6").innerHTML=wW+"*"+wH;
}

//マウス位置取得
function getMousePos(e){
    if(!e) e=window.event;
    
    MX=e.clientX;
    MY=e.clientY;
    
    //	document.getElementById("output1").innerHTML=MX+","+MY;
}

//画像位置取得
function getCharImagePos(){
    var rect=document.getElementById("serval").getBoundingClientRect();
    X=rect.left;
    Y=rect.top;
    
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

//サーバルちゃんを動かす
function moveCharImage(){
    //速度更新
    var DX=MX-(X+IMAGE_WIDTH/2),
	DY=MY-(Y+IMAGE_WIDTH/2),
	R=Math.ceil(Math.sqrt(DX*DX+DY*DY)),
	nVX= VX+ ACCEL*DX/R,
	nVY= VY+ ACCEL*DY/R,
	nX,
	nY;
    
    var imageStyle= document.getElementById("serval").style;
    
    if(nVX<=MAX_SPEED && nVX>=(-1)*MAX_SPEED){
	VX=nVX;
    }
    if(nVY<=MAX_SPEED && nVY>=(-1)*MAX_SPEED){
	VY=nVY;
    }
    
    //位置更新
    nX=X+VX/50;
    nY=Y+VY/50;
    if(X<0 || Y<0 || X+IMAGE_WIDTH>wW || Y+IMAGE_WIDTH>wH){
	//範囲外に出てたら戻す
	imageStyle.left=0+"px";
	imageStyle.top=0+"px";
    } else{
	if(nX>=0 && nX+IMAGE_WIDTH<=wW){
	    imageStyle.left=nX + "px";
	}
	if(nY>=0 && nY+IMAGE_WIDTH<=wH){
	    imageStyle.top=nY + "px";
	}
    }
    
    //	document.getElementById("output4").innerHTML="VX:"+VX+", VY:"+VY;
}



/*==========================================*/
//EventListen
/*==========================================*/
if(document.addEventListener){
    document.addEventListener("mousemove",getMousePos,false);
    document.addEventListener("click",function(){moveFlg=(moveFlg+1)%2;},false);
    window.addEventListener("resize",getWindowSize,false);
}else if(document.attachEvent){
    document.attachEvent("onmousemove",getMousePos,false);
    document.addEventListener("onclick",function(){moveFlg=(moveFlg+1)%2;},false);
    window.addEventListener("onresize",getWindowSize,false);
}


