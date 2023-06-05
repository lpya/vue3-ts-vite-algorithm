import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/bfs',
    name: 'bfs',
    component: () => import('@/views/bfs.vue'),
  },
  {
    path: '/dfs',
    name: 'dfs',
    component: () => import('@/views/dfs.vue'),
  },
  {
    path: '/astart',
    name: 'astart',
    component: () => import('@/views/astart.vue'),
  },
  {
    path: '/backtrack',
    name: 'backtrack',
    component: () => import('@/views/backtrack.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

export default router
