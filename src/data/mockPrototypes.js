// Mock 原型数据
export const mockPrototypes = [
  {
    _id: 'short-video-app',
    title: '短视频应用',
    description: '仿抖音/快手的短视频应用原型，支持多页面切换',
    category: '移动端',
    tags: ['短视频', '社交', '移动端'],
    filePath: '/src/prototypes/short-video-app/index.html',
    status: 'PUBLISHED',
    pageStructure: [
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
    filePath: '/src/prototypes/xingqu_web/index.html',
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
    filePath: '/src/prototypes/xingqu_h5/index.html',
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
    filePath: '/src/prototypes/xingqu-client/index.html',
    status: 'PUBLISHED',
    pageStructure: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: 'whale-recharge',
    title: '鲸鱼live充值',
    description: '鲸鱼live平台充值页面',
    category: '移动端',
    tags: ['充值', '支付', '移动端'],
    filePath: '/src/prototypes/whale-recharge/index.html',
    status: 'PUBLISHED',
    pageStructure: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]
