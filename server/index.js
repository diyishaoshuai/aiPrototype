import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 8080

// 中间件
app.use(cors())
app.use(express.json())

// MongoDB 连接状态
let isMongoConnected = false

// 数据模型
const prototypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  tags: [String],
  filePath: { type: String, required: true },
  thumbnail: String,
  status: { type: String, default: 'DRAFT' },
  pageStructure: [{
    label: String,
    id: String,
    url: String,
    children: [{ label: String, id: String, url: String }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Prototype = mongoose.model('Prototype', prototypeSchema)

// MongoDB 连接
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/ai-prototype-hub')
  .then(async () => {
    console.log('✅ MongoDB 连接成功')
    isMongoConnected = true

    // 检查数据库是否为空，如果为空则初始化数据
    try {
      const count = await Prototype.countDocuments()
      if (count === 0) {
        console.log('📦 初始化数据库...')
        const mockData = (await import('./mockData.js')).default
        await Prototype.insertMany(mockData)
        console.log('✅ 数据初始化完成')
      }
    } catch (err) {
      console.error('❌ 数据初始化失败:', err.message)
    }
  })
  .catch(err => {
    console.log('⚠️  MongoDB 连接失败，使用模拟数据')
    console.error('错误详情:', err.message)
    isMongoConnected = false
  })

export { app, Prototype, PORT, isMongoConnected }
