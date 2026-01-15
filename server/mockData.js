// 模拟数据（当 MongoDB 连接失败时使用）
export function getShortVideoAppPageStructure() {
  return [
    {
      label: '主页面',
      id: 'main',
      url: '/prototypes/short-video-app.html#/home',
      children: [
        {
          label: '首页',
          id: 'home',
          url: '/prototypes/short-video-app.html#/home',
          children: [
            { label: '推荐', id: 'recommend', url: '/prototypes/short-video-app.html#/recommend' },
            { label: '直播', id: 'live', url: '/prototypes/short-video-app.html#/live' },
            { label: '交友', id: 'social', url: '/prototypes/short-video-app.html#/social' },
            {
              label: '短剧',
              id: 'drama',
              url: '/prototypes/short-video-app.html#/drama',
              children: [
                { label: '短剧列表', id: 'drama-list', url: '/prototypes/short-video-app.html#/drama' },
                { label: '筛选', id: 'drama-filter', url: '/prototypes/short-video-app.html#/drama/filter' },
                { label: '排行榜', id: 'drama-ranking', url: '/prototypes/short-video-app.html#/drama/ranking' },
                { label: '播放（示例）', id: 'drama-player-sample', url: '/prototypes/short-video-app.html#/drama/1' }
              ]
            },
            { label: '搜索', id: 'search', url: '/prototypes/short-video-app.html#/search' }
          ]
        },
        { label: '广场', id: 'square', url: '/prototypes/short-video-app.html#/square' },
        { label: '发布', id: 'publish', url: '/prototypes/short-video-app.html#/publish' },
        { label: '消息', id: 'message', url: '/prototypes/short-video-app.html#/message' },
        { label: '我的', id: 'profile', url: '/prototypes/short-video-app.html#/profile' }
      ]
    }
  ]
}

const mockData = [
  {
    _id: 'short-video-app',
    title: '短视频应用',
    description: '仿抖音/快手的短视频应用原型，支持多页面切换',
    category: '移动端',
    tags: ['短视频', '社交', '移动端'],
    filePath: '/prototypes/short-video-app.html',
    status: 'PUBLISHED',
    pageStructure: getShortVideoAppPageStructure(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default mockData
