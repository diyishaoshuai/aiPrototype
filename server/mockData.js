// 模拟数据（当 MongoDB 连接失败时使用）
const mockData = [
  {
    _id: 'short-video-app',
    title: '短视频应用',
    description: '仿抖音/快手的短视频应用原型，支持多页面切换',
    category: '移动端',
    tags: ['短视频', '社交', '移动端'],
    filePath: '/prototypes/short-video-app.html',
    status: 'PUBLISHED',
    pageStructure: [
      {
        label: '主要页面',
        id: 'main-pages',
        children: [
          {
            label: '首页',
            id: 'home',
            url: '/prototypes/short-video-app.html#/home'
          },
          {
            label: '推荐',
            id: 'recommend',
            url: '/prototypes/short-video-app.html#/recommend'
          },
          {
            label: '直播',
            id: 'live',
            url: '/prototypes/short-video-app.html#/live'
          },
          {
            label: '广场',
            id: 'square',
            url: '/prototypes/short-video-app.html#/square'
          },
          {
            label: '社交',
            id: 'social',
            url: '/prototypes/short-video-app.html#/social'
          }
        ]
      },
      {
        label: '短剧模块',
        id: 'drama-module',
        children: [
          {
            label: '短剧列表',
            id: 'drama-list',
            url: '/prototypes/short-video-app.html#/drama'
          },
          {
            label: '短剧筛选',
            id: 'drama-filter',
            url: '/prototypes/short-video-app.html#/drama/filter'
          },
          {
            label: '短剧排行榜',
            id: 'drama-ranking',
            url: '/prototypes/short-video-app.html#/drama/ranking'
          },
          {
            label: '短剧播放器',
            id: 'drama-player',
            url: '/prototypes/short-video-app.html#/drama/1'
          }
        ]
      },
      {
        label: '用户功能',
        id: 'user-features',
        children: [
          {
            label: '个人主页',
            id: 'profile',
            url: '/prototypes/short-video-app.html#/profile'
          },
          {
            label: '消息中心',
            id: 'message',
            url: '/prototypes/short-video-app.html#/message'
          },
          {
            label: '搜索',
            id: 'search',
            url: '/prototypes/short-video-app.html#/search'
          }
        ]
      },
      {
        label: '发布',
        id: 'publish',
        url: '/prototypes/short-video-app.html#/publish'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default mockData
