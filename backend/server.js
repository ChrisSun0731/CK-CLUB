import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import dotenv from 'dotenv'
import { initializeFirebase } from './config/firebase.js'
import submissionRoutes from './routes/submissions.js'
import authRoutes from './routes/auth.js'
import templateRoutes from './routes/templates.js'

dotenv.config()

const fastify = Fastify({
  logger: true,
})

// 註冊 CORS
await fastify.register(cors, {
  origin: ['http://localhost:9000', 'http://localhost:8080'], // Quasar dev server
  credentials: true,
})

// 註冊檔案上傳支援
await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

// 初始化 Firebase Admin
initializeFirebase()

// 健康檢查
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// 註冊路由
await fastify.register(authRoutes, { prefix: '/api/auth' })
await fastify.register(submissionRoutes, { prefix: '/api/submissions' })
await fastify.register(templateRoutes, { prefix: '/api/templates' })

// 啟動服務器
const start = async () => {
  try {
    const port = process.env.PORT || 3000
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port: parseInt(port), host })
    console.log(`🚀 Server running at http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
