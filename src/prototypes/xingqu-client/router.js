export default [
  {
    path: '/',
    component: () => import('./Layout.vue'),
    children: [
      {
        path: '',
        redirect: '/streaming'
      },
      {
        path: '/streaming',
        name: 'StreamingTool',
        component: () => import('./views/StreamingTool.vue')
      }
    ]
  }
]
