import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './components/HomePage.vue';
import PacMan from './components/PacMan.vue';
import FlappyBird from './components/FlappyBird.vue';
import FaceMesh from './components/FaceMesh.vue';

const routes = [
  { name: "home", path: '/', component: HomePage },
  { name: "pacman", path: '/pacman', component: PacMan },
  { name: "flappybird", path: '/flappybird', component: FlappyBird },
  { name: "facemesh", path: '/facemesh', component: FaceMesh },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(ElementPlus)
app.use(router);
app.mount('#app');
