/**
 * Express 中间件集合
 */

// 错误处理中间件
export const errorHandler = (err, req, res, next) => {
  console.error('❌ 服务器错误:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || '服务器内部错误'

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}

// 404 处理中间件
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: '请求的资源不存在',
      path: req.path
    }
  })
}

// 请求限流中间件（简单实现）
const requestCounts = new Map()

export const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
      return next()
    }

    const record = requestCounts.get(ip)

    if (now > record.resetTime) {
      record.count = 1
      record.resetTime = now + windowMs
      return next()
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: '请求过于频繁，请稍后再试'
        }
      })
    }

    record.count++
    next()
  }
}
