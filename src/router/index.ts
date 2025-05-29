import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gameView',
      component: () => import('../views/GameView.vue'),
    },
  ],
})

export default router
