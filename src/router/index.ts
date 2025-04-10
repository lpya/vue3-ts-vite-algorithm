import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/bfs',
    name: 'bfs',
    component: () => import('@/views/1-bfs.vue')
  },
  {
    path: '/dfs',
    name: 'dfs',
    component: () => import('@/views/2-dfs.vue')
  },
  {
    path: '/astart',
    name: 'astart',
    component: () => import('@/views/3-astart.vue')
  }, 
  {
    path: '/maze',
    name: 'maze',
    component: () => import('@/views/4-maze.vue')
  }
];
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
});

export default router;
