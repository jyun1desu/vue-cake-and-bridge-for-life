import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/waitingRoom/:userName',
    name: 'WaitingRoom',
    component: () => import( /* webpackChunkName: "about" */ '../views/WaitingRoom.vue'),
    beforeEnter(routerTo, from, next) {
      if (!store.state.userName) {
        router.push({
          name: "Home",
        });
      }
      next();
    },
  },
  {
    path: '/gameroom/:userName',
    name: 'GameRoom',
    component: () => import( /* webpackChunkName: "about" */ '../views/GameRoom.vue'),
    // beforeEnter(routerTo, from, next) {
    //   if (!store.state.userName) {
    //     router.push({
    //       name: "Home",
    //     });
    //   }
    //   next();
    // }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router