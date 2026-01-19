/**
 * 数据库迁移脚本 - 更新原型文件路径
 * 将旧的 /prototypes/xxx.html 路径更新为 /src/prototypes/xxx/index.html
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// 连接数据库
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ai-prototype-hub'

const prototypeSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  tags: [String],
  filePath: String,
  thumbnail: String,
  status: String,
  pageStructure: Array,
  createdAt: Date,
  updatedAt: Date
})

const Prototype = mongoose.model('Prototype', prototypeSchema)

async function migrateFilePaths() {
  try {
    console.log('🔄 开始迁移数据库...')
    await mongoose.connect(DATABASE_URL)
    console.log('✅ 数据库连接成功')

    // 获取所有原型
    const prototypes = await Prototype.find({})
    console.log(`📊 找到 ${prototypes.length} 个原型`)

    for (const prototype of prototypes) {
      const oldPath = prototype.filePath

      // 转换路径格式
      // /prototypes/xingqu_h5.html -> /src/prototypes/xingqu_h5/index.html
      if (oldPath && oldPath.startsWith('/prototypes/')) {
        const fileName = oldPath.replace('/prototypes/', '').replace('.html', '')
        const newPath = `/src/prototypes/${fileName}/index.html`

        console.log(`📝 更新: ${prototype.title}`)
        console.log(`   旧路径: ${oldPath}`)
        console.log(`   新路径: ${newPath}`)

        // 更新 filePath
        prototype.filePath = newPath

        // 更新 pageStructure 中的所有 URL
        if (prototype.pageStructure && prototype.pageStructure.length > 0) {
          updatePageStructureUrls(prototype.pageStructure, fileName)
        }

        await prototype.save()
        console.log(`✅ ${prototype.title} 更新完成\n`)
      }
    }

    console.log('🎉 迁移完成！')
    process.exit(0)
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    process.exit(1)
  }
}

// 递归更新 pageStructure 中的 URL
function updatePageStructureUrls(structure, fileName) {
  for (const item of structure) {
    if (item.url) {
      // /prototypes/xxx.html#/path -> /src/prototypes/xxx/index.html#/path
      item.url = item.url.replace(
        `/prototypes/${fileName}.html`,
        `/src/prototypes/${fileName}/index.html`
      )
    }

    if (item.children && item.children.length > 0) {
      updatePageStructureUrls(item.children, fileName)
    }
  }
}

// 运行迁移
migrateFilePaths()
