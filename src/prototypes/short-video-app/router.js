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
    path: '/recommend',
    name: 'Recommend',
    component: () => import('./views/Recommend.vue')
  },
  {
    path: '/live',
    name: 'Live',
    component: () => import('./views/Live.vue')
  },
  {
    path: '/social',
    name: 'Social',
    component: () => import('./views/Social.vue')
  },
  {
    path: '/square',
    name: 'Square',
    component: () => import('./views/Square.vue')
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('./views/Publish.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('./views/Search.vue')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('./views/Message.vue')
  },
  {
    path: '/drama',
    name: 'DramaList',
    component: () => import('./views/DramaList.vue')
  },
  {
    path: '/drama/filter',
    name: 'DramaFilter',
    component: () => import('./views/DramaFilter.vue')
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
