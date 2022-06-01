<script setup>

  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { FaceMeshDetection, DIRECTION } from './FaceMeshDetection.js';
  import PacManImageUrl from '@/assets/pacman.jpg';
  import FlappyBirdImageUrl from '@/assets/flappybird.jpg';
  import FaceMeshImageUrl from '@/assets/facemesh.gif';

  const router = useRouter();

  function goto(path) {
    router.push({ name: path });
  }

  let faceMeshDet = new FaceMeshDetection(dir => {
    console.log(dir)
  });

  onMounted(() => {
    faceMeshDet.init();
  });

</script>

<template>
  <el-row id="main" justify="center">
    <el-col :offset="0" :span="6">

      <div class="card" @click="goto('test')">
        <span class="text"><h1>PAC MAN</h1><h2>PLAY!</h2></span>
        <img class="image" :src="PacManImageUrl" />
      </div>

    </el-col>
    <el-col :offset="0" :span="6">

      <div class="card" @click="goto('test')">
        <span class="text"><h1>Flappy Bird</h1><h2>PLAY!</h2></span>
        <img class="image" :src="FlappyBirdImageUrl" />
      </div>

    </el-col>
    <el-col :offset="0" :span="6">

      <div class="card" @click="goto('test')">
        <span class="text"><h1>Face Mesh</h1><h2>Try It!</h2></span>
        <img class="image" :src="FaceMeshImageUrl" />
      </div>

    </el-col>
  </el-row>
</template>

<style scoped>
#main {
  margin-top: 20vh;
  height: 60vh;
}

.card {
  margin: 0px 20px;
  height: 100%;
  background-color: #343434;
  position: relative;
  overflow: hidden;
}

.card:hover {
  cursor: pointer;
}

.card .text {
  position: absolute;		
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  opacity: 0;
  transition: all 0.8s ease;
  margin: 0;		
  color: white;
  font: 'Rubik', sans-serif;
}

.card:hover .text {
	opacity: 1;
}

.card .image {
  z-index: 9;
  height: 100%;
  width: 100%;
  object-fit: cover;

  -webkit-transform: scale(1);
	transform: scale(1);
	-webkit-transition: 0.8s ease-in-out;
	transition: 0.8s ease-in-out;
}

.card:hover .image {
  opacity: 0.5;
  -webkit-transform: scale(1.3);
	transform: scale(1.3);
  transition: all 0.8s ease;
}

</style>