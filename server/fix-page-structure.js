import mongoose from 'mongoose'

const DATABASE_URL = 'mongodb://localhost:27017/ai-prototype-hub'

// 定义 Schema
const prototypeSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  tags: [String],
  filePath: String,
  thumbnail: String,
  status: String,
  pageStructure: { type: mongoose.Schema.Types.Mixed },
  createdAt: Date,
  updatedAt: Date
})

const Prototype = mongoose.model('Prototype', prototypeSchema)

// 完整的页面结构数据
function getXingquH5PageStructure() {
  return [
    {
      label: '主页面',
      id: 'main',
      url: '/src/prototypes/xingqu_h5/index.html#/',
      children: [
        { label: '首页', id: 'home', url: '/src/prototypes/xingqu_h5/index.html#/' },
        { label: '功能介绍', id: 'features', url: '/src/prototypes/xingqu_h5/index.html#/features' },
        { label: '界面预览', id: 'preview', url: '/src/prototypes/xingqu_h5/index.html#/preview' },
        { label: '版本更新', id: 'updates', url: '/src/prototypes/xingqu_h5/index.html#/updates' }
      ]
    }
  ]
}

function getXingquWebPageStructure() {
  return [
    {
      label: '主页面',
      id: 'main',
      url: '/src/prototypes/xingqu_web/index.html#/',
      children: [
        { label: '首页', id: 'home', url: '/src/prototypes/xingqu_web/index.html#/' },
        { label: '功能介绍', id: 'features', url: '/src/prototypes/xingqu_web/index.html#/features' },
        { label: '下载页面', id: 'download', url: '/src/prototypes/xingqu_web/index.html#/download' }
      ]
    }
  ]
}

function getShortVideoAppPageStructure() {
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

// 修复页面结构
async function fixPageStructure() {
  try {
    console.log('🔄 开始修复页面结构...')
    await mongoose.connect(DATABASE_URL)
    console.log('✅ 数据库连接成功')

    const prototypes = await Prototype.find({})
    console.log(`📊 找到 ${prototypes.length} 个原型`)

    for (const prototype of prototypes) {
      let updated = false

      if (prototype.title.includes('星趣官网-手机端') || prototype.filePath.includes('xingqu_h5')) {
        prototype.pageStructure = getXingquH5PageStructure()
        updated = true
        console.log(`✏️  更新: ${prototype.title}`)
      } else if (prototype.title.includes('星趣官网-电脑端') || prototype.filePath.includes('xingqu_web')) {
        prototype.pageStructure = getXingquWebPageStructure()
        updated = true
        console.log(`✏️  更新: ${prototype.title}`)
      } else if (prototype.title.includes('短剧') || prototype.filePath.includes('short-video-app')) {
        prototype.pageStructure = getShortVideoAppPageStructure()
        updated = true
        console.log(`✏️  更新: ${prototype.title}`)
      }

      if (updated) {
        await prototype.save()
        console.log(`✅ 保存成功: ${prototype.title}`)
      }
    }

    console.log('🎉 页面结构修复完成！')
    process.exit(0)
  } catch (error) {
    console.error('❌ 修复失败:', error)
    process.exit(1)
  }
}

fixPageStructure()
