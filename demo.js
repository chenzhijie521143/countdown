/*
  1.根据数字点阵，绘制时间数字（每个数字独立绘制）
  2.计算时间，且更新时间，然后根据更新的时间绘制数字
  3.根据每个位置上的时间数字的变化，生成彩球并使其运动
  4. 总结：运用定时器每50ms更新一次数据，且重新绘制数字（之所以是50ms,是为了使小球运动的更快一点）

*/

//定义全局变量
var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=768;
var RADIUS=8;
var MARGIN_TOP=60;
var MARGIN_LEFT=30;

const endTime=new Date(2017,8,11,18,51,50);//const定义的变量不可以修改，而且必须初始化。
var curShowTimeSeconds=0;//当前倒计时需要多少秒

var balls = [];//用来存放小球
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload=function(){
   var canvas=document.getElementById('canvas');
   var context=canvas.getContext('2d');
   
   canvas.width=WINDOW_WIDTH;
   canvas.height=WINDOW_HEIGHT;
   
   //获取当前倒计时需要多少秒
   curShowTimeSeconds=getCurShowTimeSeconds();

   //定时器，每桢50ms
   setInterval(function(){

	 //判断用户是否处于当前页面
     if(!document.hidden){
	   //绘制时间数字
        render(context);

	  //数据上的改变
        update();
	 }
	  
   },50);
   //render(context);
};

//改变时间，及小球运动状态
function update(){
   
   //比较当前时间，和下一秒的时间
   var nextShowTimeSeconds=getCurShowTimeSeconds();
   var nextHours=parseInt(nextShowTimeSeconds/3600);
   var nextMinutes=parseInt(nextShowTimeSeconds/60%60);
   var nextSeconds=nextShowTimeSeconds%60;
  
   var curHours=parseInt(curShowTimeSeconds/3600);
   var curMinutes=parseInt(curShowTimeSeconds/60%60);
   var curSeconds=curShowTimeSeconds%60;
   
   //如果时间不相等，则更新时间，生成小球
   if(nextSeconds!=curSeconds)
   {
       
	   //判断每个时间数字的改变，改变则生成小球
       if(parseInt(curHours/10)!=parseInt(nextHours/10)){
	       addBalls(MARGIN_LEFT , MARGIN_TOP,parseInt(curHours/10));
	   }
	    if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
      
	  //更新时间
      curShowTimeSeconds=nextShowTimeSeconds;
   }
   //更新小球运动状态
   updateBalls();
   console.log(balls.length);
}

//更新小球运动状态
function updateBalls()
{
   for(var i=0;i<balls.length;i++)
   {
      balls[i].x += balls[i].vx;
	  balls[i].y += balls[i].vy;
	  balls[i].vy+= balls[i].g;
      

	  //到达最低点则改变速度方向及大小，加摩擦系数0.75
	  if( balls[i].y >= WINDOW_HEIGHT-RADIUS )
	  {
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
       }
   }
   
  
    //循环判断每个小球的位置，将在边界内的小球，放到数组的前面
	var cnt=0;
	for(var i=0;i<balls.length;i++)
	{
		  if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<WINDOW_WIDTH)
		  {   

			  //将符合条件的小球挤到数组的前面，不符合的在cnt后面
		      balls[cnt++]=balls[i];
		  }
	}

	  //删除cnt后面的小球
	  while(balls.length>Math.min(300,cnt)){
		  balls.pop();
	  } 
		
		//判断小球位置，删除已经运动到边界外面的小球
       /*if(balls[i].x + RADIUS < 0 || balls[i].x -RADIUS > WINDOW_WIDTH)

        {

            balls.splice(i,1);

        }*/
	
}

//添加小球的函数
function addBalls(x,y,num)
{
   //遍历数组所小数组中的行
  for(var i=0;i<digit[num].length;i++)
  {
      //遍历每行中的列
      for(var j=0;j<digit[num][i].length;j++)
	  {
	     if(digit[num][i][j]==1)
		 {
		    var aBoll={
			   x:x+j*2*(RADIUS+1)+(RADIUS+1),//x坐标
			   y:y+i*2*(RADIUS+1)+(RADIUS+1),//y坐标
			   g:1.5+Math.random(),//设置小球加速度
               vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,//取值-4/4，Math.pow(a,b) a的b次幂
			   vy:-5,//y方向速度
			   color:colors[Math.floor(Math.random()*colors.length)]//随机获取数组中的颜色
			}
            balls.push(aBoll);
		 }
	  }
  }
}

//计算倒计时的时间 ,秒
function getCurShowTimeSeconds()
{
   var curTime=new Date();

   //倒计时
   /*var ret=endTime.getTime()-curTime.getTime();
   ret=Math.round(ret/1000);//计算秒*/
   
   //时钟
   var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();

   return ret>=0 ? ret: 0;
}

//获取当前时间，并且向绘制数字的函数中传参
function render(cxt)
{
   //刷新图像
   cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

   //计算小时，分钟，秒																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																								
   var hours=parseInt(curShowTimeSeconds/3600);
   // alert(hours);
   //var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
   var minutes=parseInt(curShowTimeSeconds/60%60);
   var seconds=curShowTimeSeconds%60;
   
   //绘制6个数字和两个冒号
   renderDigit(MARGIN_LEFT , MARGIN_TOP,parseInt(hours/10),cxt);
   renderDigit(MARGIN_LEFT+15*(RADIUS+1) , MARGIN_TOP,parseInt(hours%10),cxt);
   renderDigit(MARGIN_LEFT+30*(RADIUS+1) , MARGIN_TOP,10,cxt);
   renderDigit(MARGIN_LEFT+39*(RADIUS+1) , MARGIN_TOP,parseInt(minutes/10),cxt);
   renderDigit(MARGIN_LEFT+54*(RADIUS+1) , MARGIN_TOP,parseInt(minutes%10),cxt);
   renderDigit(MARGIN_LEFT+69*(RADIUS+1) , MARGIN_TOP,10,cxt);
   renderDigit(MARGIN_LEFT+78*(RADIUS+1) , MARGIN_TOP,parseInt(seconds/10),cxt);
   renderDigit(MARGIN_LEFT+93*(RADIUS+1) , MARGIN_TOP,parseInt(seconds%10),cxt);

   //循环遍历，绘制彩色小球
   for(var i=0;i<balls.length;i++)
   {
     cxt.fillStyle=balls[i].color;

	 cxt.beginPath();
     cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
	 cxt.closePath();

	 cxt.fill();
   }
}

//绘制数字 4个参数，x,y坐标和要绘制的数字，以及2d上下文
function renderDigit(x,y,num,cxt)
{
  cxt.fillStyle='rgb(0,102,153)';
  
  //遍历数组所小数组中的行
  for(var i=0;i<digit[num].length;i++)
  {

      //遍历每行中的列
      for(var j=0;j<digit[num][i].length;j++)
	  {

		 //判断，数字为1时则绘制，为0时则不绘制
	     if(digit[num][i][j]==1)
	     {

		    cxt.beginPath();

			//注意圆心的确定
			cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
			cxt.closePath();

			cxt.fill();
 
		 }
	  }
   }
}