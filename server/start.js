import { app, PORT } from './index.js'
import { errorHandler, notFoundHandler, rateLimiter } from './middleware.js'
import config from './config.js'

// 导入路由
import './routes.js'

// 应用限流中间件（生产环境）
if (config.isProduction) {
  app.use('/api', rateLimiter(100, 60000))
}

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0'
  })
})

// 404 处理
app.use(notFoundHandler)

// 错误处理
app.use(errorHandler)

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 服务器启动成功')
  console.log(`📍 环境: ${config.env}`)
  console.log(`🌐 API 地址: http://localhost:${PORT}`)
  console.log(`📊 健康检查: http://localhost:${PORT}/health`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('⚠️  收到 SIGTERM 信号，正在关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n⚠️  收到 SIGINT 信号，正在关闭服务器...')
  process.exit(0)
})

