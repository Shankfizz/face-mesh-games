import { 
  FaceMesh, FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS, FACEMESH_LEFT_EYE, FACEMESH_LEFT_EYEBROW, FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL, FACEMESH_LIPS
} from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import * as THREE from 'three';

const DIRECTION = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
  DOWN: 'down',
  NONE: 'none'
}

class FaceMeshDetection {

  #leftEyePoints = [33, 145, 133, 159];
  #rightEyePoints = [362, 374, 263, 386];
  #nosePoints = [1];

  #rightThres = 0.25;
  #leftThres = -0.25;
  #upThres = 0.7;
  #downThres = 0.35;

  #debounceTime = 200; // ms

  constructor(cb) {

    this.faceMesh = null;
    this.camera = null;
    this.canvasElement = null;
    this.videoElement = document.createElement('video');
    this.cb = cb;
    this.lastDir = DIRECTION.NONE;

  }

  setDebounceTime(time) {

    this.#debounceTime = time;

  }

  setCanvas(canvas) {

    this.canvasElement = canvas;
    this.canvasCtx = this.canvasElement.getContext('2d');

  }

  init() {

    this.faceMesh = new FaceMesh({locateFile: (file) => {
      return `node_modules/@mediapipe/face_mesh/${file}`;
    }});

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    let timer = null;
    this.faceMesh.onResults(results => {

      if (this.canvasElement) this.drawResults(results);
      let dir = this.onResults(results);

      if (dir != this.lastDir) { // 方向改变, 立即回调
        this.lastDir = dir;
        this.cb(dir);
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      } else if (!timer) { // 方向不变, 需要考虑debounceTime
        timer = setTimeout(() => timer = null, this.#debounceTime);
        this.cb(dir);
      }

    });

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await this.faceMesh.send({image: this.videoElement});
      },
      width: 1280,
      height: 720
    });

    this.camera.start();

  }

  getMidPoint(landmarks, pointIndexArray) {

    let result = new THREE.Vector3();
    let count = 0;

    pointIndexArray.forEach(index => {
      let point = landmarks[index];
      result.add(new THREE.Vector3(point.x, point.y, point.z));
      count++;
    });

    result.divideScalar(count);
    return result;

  }

  drawResults(results) {

    if (this.canvasElement) {
      this.canvasCtx.save();
      this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
      if (results.multiFaceLandmarks.length != 0) {
        const landmarks = results.multiFaceLandmarks[0];
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
        drawConnectors(this.canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
      }
      this.canvasCtx.restore();
    }

  }

  onResults(results) {

    if (results.multiFaceLandmarks.length == 0) // 未检测到人脸
      return DIRECTION.NONE;

    const landmarks = results.multiFaceLandmarks[0];
    let leftEye = this.getMidPoint(landmarks, this.#leftEyePoints);
    let rightEye = this.getMidPoint(landmarks, this.#rightEyePoints);
    let noise = this.getMidPoint(landmarks, this.#nosePoints);
    let triangle = new THREE.Triangle(leftEye, rightEye, noise);
    let normal = new THREE.Vector3();
    triangle.getNormal(normal);

    let result;
    if (normal.x > this.#rightThres) result = DIRECTION.RIGHT;
    else if (normal.x < this.#leftThres) result = DIRECTION.LEFT;
    else if (normal.y > this.#upThres) result = DIRECTION.UP;
    else if (normal.y < this.#downThres) result = DIRECTION.DOWN;
    else result = DIRECTION.NONE;

    return result;

  }

}

export { FaceMeshDetection, DIRECTION };