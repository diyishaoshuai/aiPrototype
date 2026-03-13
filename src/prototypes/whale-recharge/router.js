export default [
  {
    path: '/',
    redirect: '/recharge'
  },
  {
    path: '/recharge',
    name: 'Recharge',
    component: () => import('./views/Recharge.vue')
  }
]
