/**
 * 配置管理模块
 * 统一管理开发环境和生产环境的配置
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 加载环境变量
dotenv.config()

// 环境类型
const NODE_ENV = process.env.NODE_ENV || 'development'
const isDevelopment = NODE_ENV === 'development'
const isProduction = NODE_ENV === 'production'

// 服务器配置
const config = {
  // 环境信息
  env: NODE_ENV,
  isDevelopment,
  isProduction,

  // 服务器端口
  port: {
    frontend: parseInt(process.env.VITE_PORT) || 3000,
    api: parseInt(process.env.API_PORT) || 8080
  },

  // 应用地址
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080'
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/ai-prototype-hub',
    name: process.env.DATABASE_NAME || 'ai-prototype-hub',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // 安全配置
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs'
  }
}

export default config
