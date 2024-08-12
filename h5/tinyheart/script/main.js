let can1;
let can2;

let ctx;
let ctx2;

document.body.onload=function(){
  init();
}

function init(){
  can1=document.getElementById('canvas1')
  ctx=can1.getContext("2d");

  can2=document.getElementById('canvas2')
  ctx=can2.getContext("2d");
}

function gameloop(){
    requestAnimationFrame(gameloop);  //setInterval setTimeout
    console.log('loop');
}