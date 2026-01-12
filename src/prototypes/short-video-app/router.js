export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/square',
    name: 'Square',
    component: () => import('./views/Square.vue')
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('./views/Recommend.vue')
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('./views/Social.vue')
  },
  {
    path: '/drama',
    name: 'DramaList',
    component: () => import('./views/DramaList.vue')
  },
  {
    path: '/drama/:id',
    name: 'DramaDetail',
    component: () => import('./views/DramaDetail.vue')
  },
  {
    path: '/drama/:id/player',
    name: 'DramaPlayer',
    component: () => import('./views/DramaPlayer.vue')
  }
]
