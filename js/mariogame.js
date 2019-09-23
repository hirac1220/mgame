// canvas base
const can = document.getElementById("canvas");
const ctx = can.getContext("2d");

/*---------------------------
 * playerについて
 *--------------------------*/
// player元オブジェクト
let player = {
    posX:0,
    posY:can.height/2,
    w:null,
    h:null,
    image:"",
    draw:function(){
        const img = new Image();
        img.src="images/mario.png";
        img.onload=function(){
            ctx.drawImage(img, player.posX, player.posY);
            player.w = img.width;
            player.h = img.height;
            player.image=img;
        }
    }
};

// マウス操作でPlayer動かす関数
$(can).on("mousemove",function(e){
    ctx.clearRect(player.posX,player.posY,player.w,player.h);
    player.posX=e.offsetX;
    player.posY=e.offsetY; 
    ctx.drawImage(player.image,player.posX,player.posY);        
});

/*---------------------------
 * ボールについて
 *--------------------------*/
let ball = {
    speed:30,
    w:null,
    h:null,
    image:"",
    draw:function(){
        const img = new Image();
        img.src="images/fireball.png";
        img.onload=function(){
            ball.w = img.width;
            ball.h = img.height;
            ball.image=img;
        }
    }
};
let fireball = {
    speed:30,
    w:null,
    h:null,
    image:"",
    draw:function(){
        const img = new Image();
        img.src="images/fire.png";
        img.onload=function(){
            fireball.w = img.width;
            fireball.h = img.height;
            fireball.image=img;
        }
    }
};

//ボールの各弾データ管理用の格納配列
let balls = [];
let fire  = [];
// ボール作成の関数
let ballInit = function(){
    playsound("ball.wav");
    offset_x = 35;
    offset_y = 15;
    let newBall = Object.assign({posX:(player.posX+offset_x),posY:player.posY+offset_y},ball);
    ctx.drawImage(newBall.image,newBall.posX,newBall.posY);
    balls.push(newBall);
}
let fireInit= function(){
    playsound("koopa.wav");
    offset_x = 35;
    offset_y = 15;
    let newFire = Object.assign({posX:(newBoss.posX-offset_x),posY:newBoss.posY-offset_y},fireball);
    ctx.drawImage(newFire.image,newFire.posX,newFire.posY);
    fire.push(newFire);
}

// 配列内の全てのボールが移動するための関数
let ballMove = function(ballArray, direction){
    for(let i=0; i<ballArray.length; i++){
        ctx.clearRect(ballArray[i].posX,ballArray[i].posY,ballArray[i].w,ballArray[i].h);   
        ballArray[i].posX += direction*(ballArray[i].speed);
        ctx.drawImage(ballArray[i].image,ballArray[i].posX,ballArray[i].posY,ballArray[i].w,ballArray[i].h);
    }
};
// 配列内の全てのボールを精査して、スクリーンアウトしたら消去する関数
let ballDelete = function(ballArray, direction){
    let new_balls = [];
    for(let i=0; i<ballArray.length;i++){
        if(direction>0 && ballArray[i].posX>can.width){
            delete ballArray[i];
        }
        else if(direction<0 && ballArray[i].posX<-(ballArray[i].w)){ // fire.w分外に出たら消去
            delete ballArray[i];
        }
        else{
            new_balls.push(ballArray[i]);
        }
    }

    if(direction > 0){
        balls = new_balls;
    }
    else{
        fire = new_balls;
    }
};
// mousedownするたびにballデータを作成するようイベント追加
$(window).on("mousedown",ballInit);

/*---------------------------
 * 敵について
 *--------------------------*/
// 敵の元オブジェクト
let enemy = {
    speed:30,
    w:null,
    h:null,
    posX:can.width-48,
    image:"",
    draw:function(){
        const img = new Image();
        img.src="images/enemy1.png";
        img.onload=function(){
            enemy.image = img;
            enemy.w = img.width;
            enemy.h = img.height;
        }
    }
};
let enemy2 = {
    speed:60,
    w:null,
    h:null,
    posX:can.width-48,
    image:"",
    draw:function(){
        const img = new Image();
        img.src="images/enemy2.png";
        img.onload=function(){
            enemy2.image = img;
            enemy2.w = img.width;
            enemy2.h = img.height;
        }
    }
};
let boss = {
    speed:60,
    w:null,
    h:null,
    posX:can.width-100,
    posY:can.height/2,
    image:"",
    draw:function(){
        const img = new Image();
        img.src="images/boss.png";
        img.onload=function(){
            boss.image = img;
            boss.w = img.width;
            boss.h = img.height;
        }
    }
};

// 敵格納用
let enemies = [];
let newBoss = null;
// 敵の出現+配列への格納のための関数]
let appearEnemy = function(){
    let offset_y   = 48;
    let can_height = can.height;
    let y   = Math.floor(Math.random()*can.height); // posY location random late
    if((y-offset_y) <= 0){ // 上画面からはみ出さない処理
        y += offset_y;
    }
    else if((y+offset_y) >= can_height){ // 下画面からはみ出さない処理
        y -= offset_y;
    }
    let newEnemy; 
    if(y%2 == 0){
        newEnemy = Object.assign({posY:y},enemy);
    }
    else{
        newEnemy = Object.assign({posY:y},enemy2);
    } 

    if(getRate()>90 && totalscore.add(0)<1000){
        ctx.drawImage(newEnemy.image,newEnemy.posX,newEnemy.posY);
        enemies.push(newEnemy);
    }
    else if(newBoss==null && totalscore.add(0)>=1000){ // the boss appears over 1000 score
        stopbgm();
        bgm("sounds/castle.mp3");
        newBoss = Object.assign({posY:(can.height-offset_y*2)},boss);
        ctx.drawImage(newBoss.image,newBoss.posX,newBoss.posY);
    }
}

// 敵を動かすための関数
let moveEnemy = function(){
    for(let i=0;i<enemies.length;i++){
        ctx.clearRect(enemies[i].posX,enemies[i].posY,enemies[i].w,enemies[i].h);   
        enemies[i].posX-=enemies[i].speed;
        ctx.drawImage(enemies[i].image,enemies[i].posX,enemies[i].posY,enemies[i].w,enemies[i].h);                
    }
}
let moveBoss = function(){
    if(newBoss == null){
        return;
    }
    offset_y = newBoss.w;
    ctx.clearRect(newBoss.posX,newBoss.posY,newBoss.w,newBoss.h);   
    newBoss.posY += newBoss.speed;
    if(getRate() > 70){
        fireInit();
    }
    ctx.drawImage(newBoss.image,newBoss.posX,newBoss.posY,newBoss.w,newBoss.h);                
    if((newBoss.posY-offset_y)<=0 ||(newBoss.posY+offset_y)>=can.height){ // 上下画面端にきたら
        newBoss.speed = -(newBoss.speed); // change vertical direction
    }
}

// 敵がスクリーンアウトした際に配列から消去するための関数
let enemyDelete = function(){
    let new_enemies = [];
    for(let i=0; i<enemies.length;i++){
        if(enemies[i].posX<0){
            delete enemies[i];
        }
        else{
            new_enemies.push(enemies[i]);
        }
    }
    enemies = new_enemies;
};

/*---------------------------
 * 当たり判定
 *--------------------------*/
let hitJudge = function(){
    for(let i=0;i<balls.length;i++){
        const b = balls[i]; // each ball
        for(let j=0;j<enemies.length;j++){
            const a = enemies[j]; //each enemy
            if((b.posX+b.w)>=a.posX&&(b.posY+b.h)>=a.posY&&b.posY<=(a.posY+a.h)){
                if(enemies[j].speed==30){   // クリボー
                    playsound("attack.mp3");
                }
                else{
                    playsound("attack2.wav");    
                }
                totalscore.add(100);
                enemies.splice(j,1);
                ctx.clearRect(a.posX,a.posY,a.w,a.h);
                balls.splice(i,1);
                ctx.clearRect(b.posX,b.posY,b.w,b.h);
            }
        }
        if(newBoss!=null){
            if((b.posX+b.w)>=newBoss.posX&&(b.posY+b.h)>=newBoss.posY&&b.posY<=(newBoss.posY+newBoss.h)){
                ctx.clearRect(newBoss.posX,newBoss.posY,newBoss.w,newBoss.h);
                balls.splice(i,1);
                ctx.clearRect(b.posX,b.posY,b.w,b.h);
                playsound("attack2.wav");
                totalscore.add(100);
            }
        }
    }
}
let damageJudge = function(){
    const p = player;
    for(let i=0;i<enemies.length;i++){
        const e = enemies[i]; //each enemy
        if((p.posX+p.w)>=e.posX&&p.posX<=(e.posX+e.w)&&(p.posY+p.h)>=e.posY&&p.posY<=(e.posY+e.h)){ // playerとenemy接触
            totallife.minus();
        }
    }
    for(let j=0;j<fire.length;j++){
        const f = fire[j]; //each fire
        if((p.posX+p.w)>=f.posX&&p.posX<=(f.posX+f.w)&&(p.posY+p.h)>=f.posY&&p.posY<=(f.posY+f.h)){ // playerとfire接触
            totallife.minus();
        }
    }
}

/*---------------------------
 * その他関数
 *--------------------------*/
function getRate(){
    return Math.floor(Math.random()*100); 
}
   
let totalscore = (function (){
    let score = 0;
    return {
        add: function (sc) {
            score += sc;
            $("#score").html('SCORE: '+score);
            if(score>0 && score%2000==0){
                stopTimer();
                stopbgm();
                playsound("clear.wav");
                $("#popup").fadeIn(1000);
                $("#end_panel").fadeIn(1000);
            }
            return score;
        }
    };
}());

let totallife = (function (){
    let life = 3;
    return {
        minus: function () {
            if(life == 0)
            {
                playsound("gameover.wav");
            }   
            else {
                --life;
                $("#life").html('LIFE x '+life);
                playsound("dead.wav");
            }
        }
    };
}());

function playsound(wavfile){
    wav_path = "sounds/"
    let audio = new Audio(wav_path+wavfile);
    audio.play();   
}

/*---------------------------
 * 読み込み時に実行する関数
 *--------------------------*/
// click start event
$(function(){
    $("#start").on("click",cleardisplay);
    $("#gray_panel").on("click",cleardisplay);
  });
  function cleardisplay(){
    $("#start").fadeOut(50);
    $("#gray_panel").fadeOut(50);
    bgm("sounds/base.mp3");
    startTimer();
}
// click end event
$(function(){
    $("#popup").on("click",ending);
    $("#end_panel").on("click",ending);
  });
  function ending(){
    window.location = "ending.html"
}
  
$(window).on("load",function(){
    player.draw();
    ball.draw();
    fireball.draw();
    enemy.draw();
    enemy2.draw();
    boss.draw();
});

let audio;
function bgm(path){
    audio = new Audio(path);
    audio.autoplay = true;
    audio.loop     = true;
    audio.play();   
}
function stopbgm(){
    if(!audio.ended){
        audio.pause();
        audio.currentTime = 0;
    }
    return false;
}

/*---------------------------
 * ループで実行する関数
 *--------------------------*/
let timer;
function startTimer(){
    timer=setInterval(function(){
        ballMove(balls, +1);
        ballMove(fire,  -1);
        ballDelete(balls, +1);
        ballDelete(fire,  -1);
        appearEnemy();
        moveEnemy();
        moveBoss(); 
        hitJudge();
    }, 100);
}
function stopTimer(){
    clearInterval(timer);
}
setInterval(function(){
    damageJudge();
}, 300);