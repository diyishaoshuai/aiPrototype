import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './config.js'

const app = express()
const PORT = config.port.api

// CORS 配置
const corsOptions = {
  origin: config.security.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200
}

// 中间件
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 请求日志中间件（开发环境）
if (config.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

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
  pageStructure: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Prototype = mongoose.model('Prototype', prototypeSchema)

// MongoDB 连接配置
const connectDB = async () => {
  try {
    await mongoose.connect(config.database.url, config.database.options)
    console.log('✅ MongoDB 连接成功')
    console.log(`📍 数据库: ${config.database.name}`)
    isMongoConnected = true

    // 检查数据库是否为空，如果为空则初始化数据
    const count = await Prototype.countDocuments()
    if (count === 0) {
      console.log('📦 初始化数据库...')
      const mockData = (await import('./mockData.js')).default
      await Prototype.insertMany(mockData)
      console.log('✅ 数据初始化完成')
    }
  } catch (err) {
    console.log('⚠️  MongoDB 连接失败，使用模拟数据')
    console.error('错误详情:', err.message)
    isMongoConnected = false
  }
}

// 启动数据库连接
connectDB()

export { app, Prototype, PORT, isMongoConnected }
