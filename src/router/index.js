import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/waitingRoom',
    name: 'WaitingRoom',
    component: () => import(/* webpackChunkName: "about" */ '../views/WaitingRoom.vue'),
  },
  {
    path: '/gameroom',
    name: 'GameRoom',
    component: () => import(/* webpackChunkName: "about" */ '../views/GameRoom.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
