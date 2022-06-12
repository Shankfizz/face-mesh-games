<template>
  <div class="game">
    <div class="sky" id = "sky" ref = "sky" ></div>
    <div class="bird" id = "bird" ref = "bird"></div>   
  </div>

  
<section class="pipes-wrap" ref="pipes">
          <div
            class="pipe-item"
            v-for="(item, index) in pipeArr"
            :key="item.id"
            :id="'pipe' + index"
            :style="'right:' + item.right + 'px;'"
          >
            <div
              class="pipe pipe-top"
              :style="'top:-' + item.top + 'px;'"
            ></div>
            <div
              class="pipe pipe-bottom"
              :style="'bottom:-' + item.bottom + 'px;'"
            ></div>
          </div>
</section>
 <div class="score" id="score" ref="score">Score:{{ score }} </div>   
</template>

<script>


    let startSpeed = 1;
    const SPEED = 0.005;             // 加速度
    const UP = 5.0;                 // 速度累加上限
    const UP_SUM = 100;              // 按一次跳跃的高度
    const BIRD_WIDTH = 50;          // 小鸟图片宽50px
    const PIPE_DISTANCE = 350;      // 管道之间的横向距离
    const x = 300;
    const y = 300
    let id = 0;                     // 管道唯一id，从0开始计数
export default {
  inject:['reload'],
  name: 'HelloWorld',
  setup(props,context){
  
  },
  data() {
    return {
      ctx:null,
      start: false,
      clientWidth: 0,
      clientHeight: 0,
      ix:0,
      iy:0,
      spaceHeight: [360, 300, 240], // 上管道与下管道之间的距离
      pipeArr: [],                  // 管道数组
      score: 0,                     // 得分
      jumpSum: 0,                   // 当前跳跃相对高度
      jumpFlag: false,              // true-按下空格键跳跃上升阶段；false-自由落体阶段
      gameOver: false,              // 游戏失败的flag，用于停止动画帧
    };
  },
  mounted() {

    let _this = this;
    //设置按键绑定
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key >= 65 && key <= 90) {
        _this.handleKeyPress(String.fromCharCode(key).toLowerCase());
      }
    };
    //初始化数据
    _this.init();
    //设置动画循环
    (function animloop() {
      if(!_this.gameOver){
        _this.loop();
        _this.pipesMove();
        window.requestAnimationFrame(animloop);}
      })();

  },
  methods:{
    init(){
      let _this = this;
      let bird = _this.$refs.bird;
      _this.clientHeight=document.documentElement.clientHeight;
      _this.clientWidth =document.documentElement.clientWidth;
      _this.addPipe(id++);
      _this.setBird();
      console.log(this.pipeArr[0].right)
    },
    loop(){
      let _this = this;
      //监测跳跃flag
      if(_this.jumpFlag==true){
        _this.jump();
      }
      else{
      let top = bird.offsetTop;
      //碰到边界判断游戏结束
      if (top > _this.clientHeight - BIRD_WIDTH || top <= 0) {
        _this.resetGame();
        return;
      }
      //小鸟降落
      bird.style.top = top + startSpeed * startSpeed + "px";  
      //给予小鸟加速度
      if (startSpeed < UP) {
        startSpeed += SPEED;
      }
      }
    },
    setBird(){
      bird.style.top = y;
    },
    jump() {
      let _this = this;
      if (_this.jumpSum > UP_SUM) {
        // 到顶部就落下
        _this.jumpFlag = false;
        _this.jumpSum = 0;
        startSpeed = 1;
      } else {
        bird.style.top = bird.offsetTop - 8 + "px";
        _this.jumpSum += 8;
      }
    },  
    handleKeyPress(key) {
      let _this = this;
      if(key == 'w')
      {
        _this.jumpFlag = true;
      }
    },
      /****************************** 
       * 
       * 
       * 
       * 添加柱子
       * 
       * 
       * 
       ******************************/
    addPipe(id) {
      
      let obj = {};
      let top_num = this.sum(10, 170);
      let height = this.spaceHeight[
        Math.floor(Math.random() * this.spaceHeight.length)
      ]; // 随机选取间隙值
      let bottom_num = height - top_num;
      obj.top = top_num;
      obj.id = id;
      obj.right = -(PIPE_DISTANCE / 2);
      obj.bottom = bottom_num;
      this.pipeArr.push(obj);
      },
      sum(m, n) {
      // 随机n-m之间的数字
      return Math.floor(Math.random() * (m - n) + n);
      },
      /****************************** 
       * 
       * 
       * 
       * 柱子移动
       * 
       * 
       * 
       ******************************/
      pipesMove() {
      
      let _this = this;
      //管道列表为空，退出
      if (_this.pipeArr.length === 0) {
        return;
      }
      //管道列表中的首位已经越过边界
      let right0 = _this.pipeArr[0].right;
      if (right0 > this.clientWidth + 300) {
        this.pipeArr.shift();
      }
      //当空间剩余时，添加管道
      let right_last = _this.pipeArr[_this.pipeArr.length - 1].right;
      if (right_last >= PIPE_DISTANCE / 2) {
        id++;
        this.addPipe(id);
      }
      //管道与小鸟的碰撞监测
      for (let i = 0; i < _this.pipeArr.length; i++) {
        
        // 判断一下小鸟是否接触到了管道，小鸟50*50，left：300px；管道宽100px；管道进入范围right是width-450到width-300
        if (
          _this.pipeArr[i].right >= _this.clientWidth - 450 &&
          _this.pipeArr[i].right <= _this.clientWidth - 300
        ) {
          // 该管道进入了小鸟触碰范围
          let bird_top = bird.offsetTop;
          // 12是小鸟图片素材上下有空白间隙
          if (
            bird_top <= _this.clientHeight / 2 - _this.pipeArr[i].top - 12 ||
            bird_top >=
              _this.clientHeight / 2 + _this.pipeArr[i].bottom - BIRD_WIDTH + 12
          ) {
            // 碰到了管道
            _this.resetGame();
            return;
          }
        }
        if (_this.pipeArr[i].right >= _this.clientWidth - 300) { // 当某个管道刚好在小鸟左边，证明小鸟通过该管道，根据管道id算出小鸟得分
          _this.score = _this.pipeArr[i].id + 1;
        }
        _this.pipeArr[i].right = _this.pipeArr[i].right + 3; // 管道每帧移动2px
      }
        },
        resetGame()
        {
          alert("游戏结束，得分为"+this.score);
          bird.style.top = x +"px";
          bird.style.right = y +"px";
          this.score= 0;   
          id= 0;           
          startSpeed=1;    
          this.pipeArr=[];        
          this.setBird();      
          this.addPipe(id);
          this.reload(); 
        }
  }
}

</script>

<style>
#score {
  height: 50px;
  widows: 50px;
  position: absolute;
  left:50px;
  top:50px;
}
#bird{
  background-image:url("../assets/img/bird0_1.png");
  height: 50px;
  width: 50px;
  border-radius: 100%;
  position:absolute;
  left:300px;
  top:300px;
}
#sky {
    background: url('../assets/img/sky.png') ;
    height:1000px;
    width:100%;
    position: absolute;
    left: 0;
    top: 0;
}


#pipes-wrap {
        position: relative;
        height: 100%;
        overflow: hidden;}
.pipe-item {
  position: absolute;
  height: 100%;
  width: 100px;}
.pipe {
  width: 100%;
  height: 50%;
  position: relative;
}
.pipe-top {
  background: url('../assets/img/pipe_down.png') no-repeat;
  background-size: 100px;
  background-position: bottom;
}
.pipe-bottom {
  background: url('../assets/img/pipe_up.png') no-repeat;
  background-size: 100px;
  background-position: top;
}


</style>



