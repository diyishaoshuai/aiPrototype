// 模拟数据（当 MongoDB 连接失败时使用）
const mockData = [
  {
    title: '短视频应用',
    description: '仿抖音/快手的短视频应用原型，支持多页面切换',
    category: '移动端',
    tags: ['短视频', '社交', '移动端'],
    filePath: '/prototypes/short-video-app.html',
    status: 'PUBLISHED',
    pageStructure: [
      {
        label: '首页',
        id: 'home',
        url: '/prototypes/short-video-app.html#/home'
      },
      {
        label: '热门',
        id: 'hot',
        url: '/prototypes/short-video-app.html#/square'
      },
      {
        label: '发布',
        id: 'publish',
        url: '/prototypes/short-video-app.html#/'
      },
      {
        label: '消息',
        id: 'message',
        url: '/prototypes/short-video-app.html#/social'
      },
      {
        label: '我的',
        id: 'profile',
        url: '/prototypes/short-video-app.html#/'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default mockData
