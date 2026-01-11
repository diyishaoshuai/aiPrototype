import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/prototype/:id',
    name: 'PrototypeForm',
    component: () => import('@/views/PrototypeForm.vue')
  },
  {
    path: '/preview/:id',
    name: 'Preview',
    component: () => import('@/views/Preview.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
