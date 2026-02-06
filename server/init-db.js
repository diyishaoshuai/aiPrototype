import mongoose from 'mongoose'
import config from './config.js'
import mockData from './mockData.js'

// 数据模型
const prototypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  tags: [String],
  filePath: { type: String, required: true },
  thumbnail: String,
  status: { type: String, default: 'DRAFT' },
  pageStructure: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Prototype = mongoose.model('Prototype', prototypeSchema)

// 初始化数据库
async function initDatabase() {
  try {
    console.log('🔄 正在连接 MongoDB...')
    await mongoose.connect(config.database.url, config.database.options)
    console.log('✅ MongoDB 连接成功')

    // 检查是否已有数据
    const count = await Prototype.countDocuments()
    console.log(`📊 当前数据库中有 ${count} 条原型数据`)

    if (count === 0) {
      console.log('🔄 正在导入初始数据...')

      // 导入 mockData
      for (const data of mockData) {
        await Prototype.create(data)
        console.log(`✅ 已导入: ${data.title}`)
      }

      console.log('✅ 初始数据导入完成')
    } else {
      console.log('ℹ️  数据库已有数据，跳过导入')
    }

    // 显示所有原型
    const prototypes = await Prototype.find()
    console.log('\n📋 数据库中的原型列表:')
    prototypes.forEach(p => {
      console.log(`  - ${p.title} (${p.category})`)
    })

    await mongoose.connection.close()
    console.log('\n✅ 数据库初始化完成')
    process.exit(0)
  } catch (error) {
    console.error('❌ 初始化失败:', error)
    process.exit(1)
  }
}

initDatabase()
