// 模拟数据（当 MongoDB 连接失败时使用）
export function getShortVideoAppPageStructure() {
  return [
    {
      label: '主页面',
      id: 'main',
      url: '/src/prototypes/short-video-app/index.html#/home',
      children: [
        {
          label: '首页',
          id: 'home',
          url: '/src/prototypes/short-video-app/index.html#/home',
          children: [
            { label: '推荐', id: 'recommend', url: '/src/prototypes/short-video-app/index.html#/recommend' },
            { label: '直播', id: 'live', url: '/src/prototypes/short-video-app/index.html#/live' },
            { label: '交友', id: 'social', url: '/src/prototypes/short-video-app/index.html#/social' },
            {
              label: '短剧',
              id: 'drama',
              url: '/src/prototypes/short-video-app/index.html#/drama',
              children: [
                { label: '短剧列表', id: 'drama-list', url: '/src/prototypes/short-video-app/index.html#/drama' },
                { label: '筛选', id: 'drama-filter', url: '/src/prototypes/short-video-app/index.html#/drama/filter' },
                { label: '排行榜', id: 'drama-ranking', url: '/src/prototypes/short-video-app/index.html#/drama/ranking' },
                { label: '播放（示例）', id: 'drama-player-sample', url: '/src/prototypes/short-video-app/index.html#/drama/1' }
              ]
            },
            { label: '搜索', id: 'search', url: '/src/prototypes/short-video-app/index.html#/search' }
          ]
        },
        { label: '广场', id: 'square', url: '/src/prototypes/short-video-app/index.html#/square' },
        { label: '发布', id: 'publish', url: '/src/prototypes/short-video-app/index.html#/publish' },
        { label: '消息', id: 'message', url: '/src/prototypes/short-video-app/index.html#/message' },
        { label: '我的', id: 'profile', url: '/src/prototypes/short-video-app/index.html#/profile' }
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
    filePath: '/src/prototypes/short-video-app/index.html',
    status: 'PUBLISHED',
    pageStructure: getShortVideoAppPageStructure(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default mockData
