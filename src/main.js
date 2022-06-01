import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createRouter, createWebHistory } from 'vue-router';

import Test from './components/Test.vue';
import HomePage from './components/HomePage.vue';

const routes = [
  { name: "home", path: '/', component: HomePage },
  { name: "test", path: '/test', component: Test },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(ElementPlus)
app.use(router);
app.mount('#app');
