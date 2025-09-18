import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDB as dbConnect, disconnectDB, healthCheck } from './services/database.service'

// 导入路由
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import projectRoutes from './routes/projects'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 中间件配置
app.use(helmet()) // 安全中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: Boolean(process.env.CORS_CREDENTIALS) || true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 速率限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15分钟
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // 限制每个IP 100个请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  }
})
app.use('/api', limiter)

// 数据库连接
const initializeDatabase = async () => {
  try {
    await dbConnect()
    console.log('PostgreSQL数据库连接成功')
  } catch (error) {
    console.error('数据库连接失败:', error)
    process.exit(1)
  }
}

// API路由
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes)

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})

// 全局错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: err.errors
    })
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: '无效的ID格式'
    })
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: '数据已存在'
    })
  }
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})

// 启动服务器
const startServer = async () => {
  try {
    await initializeDatabase()
    
    app.listen(PORT, () => {
      console.log(`🚀 TaskFlow API 服务器运行在端口 ${PORT}`)
      console.log(`🌐 API地址: http://localhost:${PORT}/api`)
      console.log(`📋 健康检查: http://localhost:${PORT}/api/health`)
      console.log(`📚 环境: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('服务器启动失败:', error)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...')
  await disconnectDB()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...')
  await disconnectDB()
  process.exit(0)
})

// 启动服务器
startServer()

// 导出app用于测试
export { app }