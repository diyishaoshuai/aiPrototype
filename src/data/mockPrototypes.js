// Mock 原型数据
export const mockPrototypes = [
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
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: 'xingqu-web',
    title: '星趣官网（电脑端）',
    description: '星趣官网电脑端版本',
    category: '网页端',
    tags: ['官网', '企业', '电脑端'],
    filePath: '/prototypes/xingqu_web.html',
    status: 'PUBLISHED',
    pageStructure: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: 'xingqu-h5',
    title: '星趣官网（手机端）',
    description: '星趣官网手机端版本',
    category: '移动端',
    tags: ['官网', '企业', '移动端'],
    filePath: '/prototypes/xingqu_h5.html',
    status: 'PUBLISHED',
    pageStructure: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: 'xingqu-client',
    title: '星趣PC客户端',
    description: '星趣直播推流工具客户端原型',
    category: '客户端',
    tags: ['直播', '工具', '桌面应用'],
    filePath: '/prototypes/xingqu-client.html',
    status: 'PUBLISHED',
    pageStructure: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]
