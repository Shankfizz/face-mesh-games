<script setup>

  import { onMounted, ref } from 'vue';
  import { FaceMeshDetection, DIRECTION } from './FaceMeshDetection.js';

  const direction = ref('none');
  let faceMeshDet = new FaceMeshDetection(dir => {
    console.log(dir)
    direction.value = dir;
  });

  onMounted(() => {
    const canvasElement = document.getElementById('output_canvas');

    canvasElement.width = 1280;
    canvasElement.height = 720;

    faceMeshDet.setCanvas(canvasElement);
    faceMeshDet.init();
  });

</script>

<template>
  <canvas id="output_canvas" width="1280px" height="720px"></canvas>
  <div id="direction">{{ direction }}</div>
</template>

<style scoped>
#direction {
  margin-top: 20px;
  text-align: center;
  font-size: 30px;
}
</style>
