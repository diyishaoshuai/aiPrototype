import { app, Prototype, PORT, isMongoConnected } from './index.js'
import mockData, { getShortVideoAppPageStructure } from './mockData.js'
import { upload } from './upload.js'
import { processPrototypeZip } from './prototypeProcessor.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建完整的Vue原型项目
function createPrototypeProject(filePath, prototypeTitle = '新原型') {
  // 从 filePath 提取项目名称，例如 /prototypes/my-app.html -> my-app
  const fileName = path.basename(filePath, '.html')
  const htmlFullPath = path.join(__dirname, '..', filePath)
  const srcProjectPath = path.join(__dirname, '..', 'src', 'prototypes', fileName)

  // 1. 创建 HTML 入口文件
  const htmlDir = path.dirname(htmlFullPath)
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true })
  }

  if (!fs.existsSync(htmlFullPath)) {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prototypeTitle}</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/prototypes/${fileName}/main.js"></script>
</body>
</html>`
    fs.writeFileSync(htmlFullPath, htmlContent, 'utf-8')
    console.log(`✅ 创建HTML文件: ${htmlFullPath}`)
  }

  // 2. 创建 Vue 项目目录结构
  if (!fs.existsSync(srcProjectPath)) {
    fs.mkdirSync(srcProjectPath, { recursive: true })
    console.log(`✅ 创建项目目录: ${srcProjectPath}`)
  }

  // 3. 创建 main.js
  const mainJsPath = path.join(srcProjectPath, 'main.js')
  if (!fs.existsSync(mainJsPath)) {
    const mainJsContent = `import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Vant from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import routes from './router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(Vant)
app.mount('#app')
`
    fs.writeFileSync(mainJsPath, mainJsContent, 'utf-8')
    console.log(`✅ 创建main.js: ${mainJsPath}`)
  }

  // 继续创建其他文件...
  createAppVue(srcProjectPath, prototypeTitle)
  createRouter(srcProjectPath)
  createViews(srcProjectPath, prototypeTitle)
}

// 创建 App.vue
function createAppVue(projectPath, title) {
  const appVuePath = path.join(projectPath, 'App.vue')
  if (!fs.existsSync(appVuePath)) {
    const appVueContent = `<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup>
// ${title} - 根组件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

/* 隐藏滚动条 */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  display: none;
}
</style>
`
    fs.writeFileSync(appVuePath, appVueContent, 'utf-8')
    console.log(`✅ 创建App.vue: ${appVuePath}`)
  }
}

// 创建 router.js
function createRouter(projectPath) {
  const routerPath = path.join(projectPath, 'router.js')
  if (!fs.existsSync(routerPath)) {
    const routerContent = `export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('./views/Home.vue')
  }
]
`
    fs.writeFileSync(routerPath, routerContent, 'utf-8')
    console.log(`✅ 创建router.js: ${routerPath}`)
  }
}

// 创建 views 目录和默认页面
function createViews(projectPath, title) {
  const viewsPath = path.join(projectPath, 'views')
  if (!fs.existsSync(viewsPath)) {
    fs.mkdirSync(viewsPath, { recursive: true })
    console.log(`✅ 创建views目录: ${viewsPath}`)
  }

  // 创建默认的 Home.vue
  const homeVuePath = path.join(viewsPath, 'Home.vue')
  if (!fs.existsSync(homeVuePath)) {
    const homeVueContent = `<template>
  <div class="home-page">
    <div class="content">
      <div class="icon">🎨</div>
      <h1 class="title">${title}</h1>
      <p class="desc">开始编辑你的原型吧！</p>
    </div>
  </div>
</template>

<script setup>
// 首页
</script>

<style scoped>
.home-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.content {
  text-align: center;
  padding: 40px;
}

.icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 12px;
}

.desc {
  font-size: 16px;
  opacity: 0.9;
}
</style>
`
    fs.writeFileSync(homeVuePath, homeVueContent, 'utf-8')
    console.log(`✅ 创建Home.vue: ${homeVuePath}`)
  }
}

// 删除原型项目（HTML文件和Vue项目目录）
function deletePrototypeProject(filePath) {
  const fileName = path.basename(filePath, '.html')
  const htmlFullPath = path.join(__dirname, '..', filePath)
  const srcProjectPath = path.join(__dirname, '..', 'src', 'prototypes', fileName)

  // 删除 HTML 文件
  if (fs.existsSync(htmlFullPath)) {
    fs.unlinkSync(htmlFullPath)
    console.log(`🗑️  删除HTML文件: ${htmlFullPath}`)
  }

  // 删除 Vue 项目目录
  if (fs.existsSync(srcProjectPath)) {
    fs.rmSync(srcProjectPath, { recursive: true, force: true })
    console.log(`🗑️  删除项目目录: ${srcProjectPath}`)
  }
}

// 更新 Vite 配置文件，添加新的原型入口
function updateViteConfig(prototypeName) {
  try {
    const viteConfigPath = path.join(__dirname, '..', 'vite.config.js')
    let configContent = fs.readFileSync(viteConfigPath, 'utf-8')

    // 查找 input 对象
    const inputRegex = /input:\s*{([^}]+)}/s
    const match = configContent.match(inputRegex)

    if (match) {
      const existingEntries = match[1]

      // 检查是否已存在该入口
      if (existingEntries.includes(`'${prototypeName}':`)) {
        console.log(`⚠️  Vite配置中已存在入口: ${prototypeName}`)
        return
      }

      // 添加新入口
      const newEntry = `\n        '${prototypeName}': resolve(__dirname, 'prototypes/${prototypeName}.html'),`
      const updatedEntries = existingEntries.trimEnd() + newEntry
      const updatedInput = `input: {${updatedEntries}\n      }`

      configContent = configContent.replace(inputRegex, updatedInput)
      fs.writeFileSync(viteConfigPath, configContent, 'utf-8')

      console.log(`✅ 已更新 vite.config.js，添加入口: ${prototypeName}`)
    } else {
      console.error('❌ 无法找到 vite.config.js 中的 input 配置')
    }
  } catch (error) {
    console.error('❌ 更新 Vite 配置失败:', error)
  }
}

// 规范化单页面原型（xingqu_web 和 xingqu_h5），将 pageStructure 设置为空
function normalizeSinglePagePrototype(proto) {
  if (!proto) return { changed: false, proto }

  const filePath = proto.filePath
  const isSinglePage = filePath && (
    filePath.includes('xingqu_web') ||
    filePath.includes('xingqu_h5')
  )

  if (!isSinglePage) return { changed: false, proto }

  const current = Array.isArray(proto.pageStructure) ? proto.pageStructure : []
  // 如果 pageStructure 不为空，需要清空它
  if (current.length > 0) {
    return {
      changed: true,
      proto: {
        ...proto,
        pageStructure: [] // 单页面原型不需要页面结构
      }
    }
  }

  return { changed: false, proto }
}

function normalizeShortVideoAppPrototype(proto) {
  // 只修正"短视频应用"这个原型（Mongo / mockData 都适用）
  // 主要基于 filePath 判断，因为 filePath 更稳定，不会因为改名而改变
  if (!proto) return { changed: false, proto }

  const filePath = proto.filePath
  // 支持多种 filePath 格式：/prototypes/short-video-app.html 或 /prototypes/short-video-app.html/index.html
  const looksLikeShortVideoApp = filePath && (
    filePath === '/prototypes/short-video-app.html' ||
    filePath.startsWith('/prototypes/short-video-app.html')
  )

  if (!looksLikeShortVideoApp) return { changed: false, proto }

  const desired = getShortVideoAppPageStructure()
  const current = Array.isArray(proto.pageStructure) ? proto.pageStructure : []

  // 检查结构是否完整：应该有子页面
  const hasChildren = current.some(item => 
    item.children && Array.isArray(item.children) && item.children.length > 0
  )
  
  // 检查是否有完整的层级结构（主页面 -> 首页 -> 短剧 -> 子页面）
  // 具体检查：首页下是否有子页面（推荐、直播、短剧等），短剧下是否有子页面（短剧列表、筛选等）
  let hasDeepStructure = false
  if (current.length > 0 && current[0].children && current[0].children.length > 0) {
    // 检查"首页"是否有子页面
    const homeItem = current[0].children.find(child => 
      child.id === 'home' || 
      child.label === '首页' || 
      (typeof child.label === 'string' && child.label.includes('首页'))
    )
    if (homeItem) {
      // 如果"首页"有子页面数组且长度大于0，说明有深层结构
      if (homeItem.children && Array.isArray(homeItem.children) && homeItem.children.length > 0) {
        // 检查"短剧"是否有子页面
        const dramaItem = homeItem.children.find(child => 
          child.id === 'drama' || 
          child.label === '短剧' || 
          (typeof child.label === 'string' && child.label.includes('短剧'))
        )
        if (dramaItem && dramaItem.children && Array.isArray(dramaItem.children) && dramaItem.children.length > 0) {
          hasDeepStructure = true
        } else if (homeItem.children.length > 0) {
          // 或者至少有一些子页面（推荐、直播等）
          hasDeepStructure = true
        }
      }
    }
  }

  // 旧数据常见特征：顶层只有 5 个叶子节点，且包含"热门/消息/我的"等 label
  const isOldFlat =
    current.length > 0 &&
    current.every(n => !n?.children || n.children.length === 0) &&
    current.some(n => ['热门', '消息', '我的'].includes(n?.label))

  // 如果结构不完整（没有子页面或没有深层结构），需要替换
  const shouldReplace =
    current.length === 0 ||
    isOldFlat ||
    !hasChildren ||
    !hasDeepStructure ||
    JSON.stringify(current) !== JSON.stringify(desired)
  
  // 调试日志
  if (looksLikeShortVideoApp) {
    console.log('Normalize check for short-video-app:')
    console.log('  - hasChildren:', hasChildren)
    console.log('  - hasDeepStructure:', hasDeepStructure)
    console.log('  - isOldFlat:', isOldFlat)
    console.log('  - shouldReplace:', shouldReplace)
    console.log('  - current structure:', JSON.stringify(current, null, 2).substring(0, 500))
  }

  if (!shouldReplace) return { changed: false, proto }

  // 规范化 filePath，统一为 /prototypes/short-video-app.html
  const normalizedFilePath = '/prototypes/short-video-app.html'
  
  return {
    changed: true,
    proto: {
      ...proto,
      filePath: normalizedFilePath,
      pageStructure: desired
    }
  }
}

// API 路由

// 获取所有原型
app.get('/api/prototypes', async (req, res) => {
  try {
    // 如果 MongoDB 未连接，使用模拟数据
    if (!isMongoConnected) {
      const { search, category } = req.query
      let filtered = [...mockData]

      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      if (search) {
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
        )
      }

      return res.json(filtered)
    }

    // 使用 MongoDB
    const { search, category } = req.query
    const query = {}

    if (category) query.category = category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const prototypes = await Prototype.find(query).sort({ createdAt: -1 })

    // 修正旧的 pageStructure（异步后台写回，不阻塞响应）
    const fixed = prototypes.map(p => {
      const raw = p.toObject ? p.toObject() : p
      // 先处理单页面原型
      let { changed, proto } = normalizeSinglePagePrototype(raw)
      // 如果不是单页面，再处理短剧应用
      if (!changed) {
        const result = normalizeShortVideoAppPrototype(raw)
        changed = result.changed
        proto = result.proto
      }
      // 如果需要修复，异步后台写回数据库（不阻塞响应）
      if (changed && proto?._id) {
        // 使用 setImmediate 或 setTimeout 异步执行，不阻塞当前响应
        setImmediate(async () => {
          try {
            await Prototype.findByIdAndUpdate(
              proto._id,
              { filePath: proto.filePath, pageStructure: proto.pageStructure, updatedAt: Date.now() },
              { new: false }
            )
          } catch (err) {
            // 忽略写回失败，不影响响应
            console.error(`修复原型 ${proto._id} 的 pageStructure 失败:`, err.message)
          }
        })
      }
      return proto
    })

    res.json(fixed)
  } catch (error) {
    console.error('❌ 获取原型列表失败:', error)
    res.status(500).json({ error: '获取原型列表失败', message: error.message })
  }
})

// 获取单个原型
app.get('/api/prototypes/:id', async (req, res) => {
  try {
    // 如果 MongoDB 未连接，使用模拟数据
    if (!isMongoConnected) {
      const prototype = mockData.find(p => p._id === req.params.id)
      if (!prototype) {
        return res.status(404).json({ error: '原型不存在' })
      }
      return res.json(prototype)
    }

    // 使用 MongoDB
    const prototype = await Prototype.findById(req.params.id)
    if (!prototype) {
      return res.status(404).json({ error: '原型不存在' })
    }
    const raw = prototype.toObject ? prototype.toObject() : prototype
    // 先处理单页面原型
    let { changed, proto } = normalizeSinglePagePrototype(raw)
    // 如果不是单页面，再处理短剧应用
    if (!changed) {
      const result = normalizeShortVideoAppPrototype(raw)
      changed = result.changed
      proto = result.proto
    }
    
    // 强制修复单页面原型：如果 filePath 匹配但 pageStructure 不为空，清空它
    const filePath = raw.filePath
    const isSinglePage = filePath && (
      filePath.includes('xingqu_web') ||
      filePath.includes('xingqu_h5')
    )
    
    if (isSinglePage) {
      const current = Array.isArray(raw.pageStructure) ? raw.pageStructure : []
      if (current.length > 0) {
        console.log('Force fixing pageStructure for single-page prototype')
        try {
          const updated = await Prototype.findByIdAndUpdate(
            raw._id,
            {
              pageStructure: [],
              updatedAt: Date.now()
            },
            { new: true }
          )
          console.log('PageStructure force fixed for single-page prototype')
          const updatedRaw = updated.toObject ? updated.toObject() : updated
          return res.json({ ...updatedRaw, pageStructure: [] })
        } catch (err) {
          console.error('Failed to force fix pageStructure for single-page:', err)
          return res.json({ ...raw, pageStructure: [] }) // 即使保存失败，也返回空结构
        }
      }
    }
    
    // 强制修复：如果 filePath 匹配但结构不完整，直接使用完整结构
    const isShortVideoApp = filePath && (
      filePath === '/prototypes/short-video-app.html' ||
      filePath.startsWith('/prototypes/short-video-app.html')
    )
    
    if (isShortVideoApp) {
      const current = Array.isArray(raw.pageStructure) ? raw.pageStructure : []
      // 检查"首页"是否有子页面
      let needsFix = false
      if (current.length > 0 && current[0].children && current[0].children.length > 0) {
        const homeItem = current[0].children.find(child => 
          child.id === 'home' || 
          (typeof child.label === 'string' && (child.label === '首页' || child.label.includes('首页')))
        )
        if (!homeItem || !homeItem.children || !Array.isArray(homeItem.children) || homeItem.children.length === 0) {
          needsFix = true
        }
      } else {
        needsFix = true
      }
      
      if (needsFix) {
        console.log('Force fixing pageStructure for short-video-app')
        const desired = getShortVideoAppPageStructure()
        try {
          const updated = await Prototype.findByIdAndUpdate(
            raw._id,
            { 
              filePath: '/prototypes/short-video-app.html',
              pageStructure: desired, 
              updatedAt: Date.now() 
            },
            { new: true }
          )
          console.log('PageStructure force fixed and saved')
          const updatedRaw = updated.toObject ? updated.toObject() : updated
          return res.json({ ...updatedRaw, pageStructure: desired })
        } catch (err) {
          console.error('Failed to force fix pageStructure:', err)
          // 即使保存失败，也返回完整结构
          return res.json({ ...raw, pageStructure: getShortVideoAppPageStructure() })
        }
      }
    }
    
    if (changed && proto?._id) {
      try {
        console.log('Normalizing prototype pageStructure for:', proto._id)
        const updated = await Prototype.findByIdAndUpdate(
          proto._id,
          { filePath: proto.filePath, pageStructure: proto.pageStructure, updatedAt: Date.now() },
          { new: true }
        )
        console.log('PageStructure normalized and saved')
        // 返回更新后的数据，再次规范化确保一致性
        const updatedRaw = updated.toObject ? updated.toObject() : updated
        const { changed: changed2, proto: proto2 } = normalizeShortVideoAppPrototype(updatedRaw)
        return res.json(proto2 || updatedRaw)
      } catch (err) {
        console.error('Failed to save normalized pageStructure:', err)
        // 即使保存失败，也返回规范化后的数据
        return res.json(proto)
      }
    }
    // 即使没有改变，也返回规范化后的数据（proto 可能包含规范化后的结构）
    res.json(proto || raw)
  } catch (error) {
    res.status(500).json({ error: '获取原型失败' })
  }
})

// 创建原型
app.post('/api/prototypes', async (req, res) => {
  try {
    const prototype = new Prototype(req.body)
    await prototype.save()

    // 自动创建完整的Vue项目
    if (prototype.filePath) {
      createPrototypeProject(prototype.filePath, prototype.title)

      // 更新 Vite 配置，添加新的入口
      const prototypeName = path.basename(prototype.filePath, '.html')
      updateViteConfig(prototypeName)
    }

    res.status(201).json(prototype)
  } catch (error) {
    console.error('创建原型失败:', error)
    res.status(400).json({ error: '创建原型失败' })
  }
})

// 更新原型
app.put('/api/prototypes/:id', async (req, res) => {
  try {
    // 先获取当前原型数据，以便保留 pageStructure
    const current = await Prototype.findById(req.params.id)
    if (!current) {
      return res.status(404).json({ error: '原型不存在' })
    }
    
    const currentData = current.toObject ? current.toObject() : current
    const updateData = { ...req.body, updatedAt: Date.now() }
    
    // 如果更新数据中没有 pageStructure，保留现有的 pageStructure
    if (!updateData.hasOwnProperty('pageStructure')) {
      updateData.pageStructure = currentData.pageStructure
    }
    
    // 如果 filePath 是单页面原型（xingqu_web 或 xingqu_h5），确保 pageStructure 为空
    if (updateData.filePath && (
      updateData.filePath.includes('xingqu_web') ||
      updateData.filePath.includes('xingqu_h5')
    )) {
      // 单页面原型不需要页面结构
      updateData.pageStructure = []
    }
    // 如果 filePath 是 short-video-app.html，确保 pageStructure 正确
    else if (updateData.filePath && (
      updateData.filePath === '/prototypes/short-video-app.html' ||
      updateData.filePath.startsWith('/prototypes/short-video-app.html')
    )) {
      // 如果当前没有 pageStructure 或者 pageStructure 为空，使用正确的结构
      if (!updateData.pageStructure || updateData.pageStructure.length === 0) {
        updateData.pageStructure = getShortVideoAppPageStructure()
      } else {
        // 如果已有 pageStructure，检查是否需要更新（确保结构完整）
        const desired = getShortVideoAppPageStructure()
        // 检查结构是否完整（有子页面）
        const hasChildren = updateData.pageStructure.some(item => 
          item.children && Array.isArray(item.children) && item.children.length > 0
        )
        if (!hasChildren) {
          // 如果结构不完整（没有子页面），使用正确的结构
          updateData.pageStructure = desired
        } else {
          // 如果结构完整，但可能需要更新 URL（因为 filePath 可能改变）
          // 这里只更新 URL，保留结构
          updateData.pageStructure = updatePageStructureUrls(updateData.pageStructure, updateData.filePath)
        }
      }
    } else {
      // 如果 filePath 不是 short-video-app.html，但原来是，保留 pageStructure（不删除）
      // 如果更新数据中没有 pageStructure，保留现有的
      if (!updateData.hasOwnProperty('pageStructure')) {
        updateData.pageStructure = currentData.pageStructure
      }
    }
    
    const prototype = await Prototype.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    if (!prototype) {
      return res.status(404).json({ error: '原型不存在' })
    }
    
    // 返回前再次规范化，确保数据正确
    const raw = prototype.toObject ? prototype.toObject() : prototype
    // 先处理单页面原型
    let { changed, proto } = normalizeSinglePagePrototype(raw)
    // 如果不是单页面，再处理短剧应用
    if (!changed) {
      const result = normalizeShortVideoAppPrototype(raw)
      changed = result.changed
      proto = result.proto
    }
    if (changed && proto?._id) {
      try {
        await Prototype.findByIdAndUpdate(
          proto._id,
          { filePath: proto.filePath, pageStructure: proto.pageStructure, updatedAt: Date.now() },
          { new: false }
        )
      } catch {
        // ignore
      }
    }
    res.json(proto || raw)
  } catch (error) {
    console.error('Update prototype error:', error)
    res.status(400).json({ error: '更新原型失败' })
  }
})

// 递归更新页面结构中的 URL
function updatePageStructureUrls(structure, basePath) {
  if (!structure || !Array.isArray(structure)) return structure
  return structure.map(item => {
    const updated = { ...item }
    if (item.url && item.url.includes('/prototypes/')) {
      // 更新 URL 中的文件路径部分
      const urlParts = item.url.split('#')
      if (urlParts.length > 0) {
        updated.url = basePath + (urlParts.length > 1 ? '#' + urlParts[1] : '')
      }
    }
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      updated.children = updatePageStructureUrls(item.children, basePath)
    }
    return updated
  })
}

// 删除原型
app.delete('/api/prototypes/:id', async (req, res) => {
  try {
    const prototype = await Prototype.findByIdAndDelete(req.params.id)
    if (!prototype) {
      return res.status(404).json({ error: '原型不存在' })
    }

    // 自动删除整个原型项目
    if (prototype.filePath) {
      deletePrototypeProject(prototype.filePath)
    }

    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除原型失败:', error)
    res.status(500).json({ error: '删除原型失败' })
  }
})

// 上传原型文件
app.post('/api/prototypes/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文件' })
    }

    const { title, description, category, tags } = req.body

    if (!title || !category) {
      return res.status(400).json({ error: '标题和分类为必填项' })
    }

    console.log('📤 收到上传请求:', { title, category, file: req.file.originalname })

    // 生成原型名称（用于文件夹名）
    const prototypeName = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // 处理上传的 ZIP 文件
    const result = await processPrototypeZip(req.file.path, prototypeName)
    console.log('✅ 文件处理成功:', result)

    // 创建数据库记录
    const prototype = new Prototype({
      title,
      description: description || '',
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
      filePath: result.filePath,
      status: 'PUBLISHED',
      createdAt: Date.now(),
      updatedAt: Date.now()
    })

    await prototype.save()
    console.log('✅ 数据库记录创建成功:', prototype._id)

    res.status(201).json({
      success: true,
      message: '原型上传成功',
      prototype: prototype.toObject()
    })
  } catch (error) {
    console.error('❌ 上传失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '上传失败'
    })
  }
})

