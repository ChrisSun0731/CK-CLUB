import { getAuth } from '../config/firebase.js'
import { getFirestore } from '../config/firebase.js'
import { checkEducationDomain } from '../middleware/auth.js'

export default async function authRoutes(fastify, opts) {
  /**
   * 驗證用戶並設置角色
   * POST /api/auth/verify
   * Body: { idToken: string }
   */
  fastify.post('/verify', async (request, reply) => {
    try {
      const { idToken } = request.body

      if (!idToken) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: '缺少 idToken',
        })
      }

      // 驗證 token
      const decodedToken = await getAuth().verifyIdToken(idToken)
      const { uid, email } = decodedToken

      // 檢查是否為教育帳號
      if (!checkEducationDomain(email)) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: '僅限台北市教育帳號登入',
        })
      }

      // 判斷角色 (這裡使用簡單的規則,可以根據需求調整)
      let role = 'teacher' // 預設為教師

      // 如果 email 包含特定關鍵字,設為管理員
      if (email.includes('admin') || email.includes('affair')) {
        role = 'admin'
      }

      // 儲存或更新用戶資料到 Firestore
      const db = getFirestore()
      await db.collection('users').doc(uid).set(
        {
          uid,
          email,
          role,
          lastLogin: new Date().toISOString(),
        },
        { merge: true },
      )

      // 設置 custom claims
      await getAuth().setCustomUserClaims(uid, { role })

      return reply.send({
        success: true,
        user: {
          uid,
          email,
          role,
        },
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message,
      })
    }
  })

  /**
   * 獲取當前用戶資訊
   * GET /api/auth/me
   */
  fastify.get('/me', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: '未提供身份驗證令牌',
        })
      }

      const idToken = authHeader.split('Bearer ')[1]
      const decodedToken = await getAuth().verifyIdToken(idToken)

      // 從 Firestore 獲取用戶資料
      const db = getFirestore()
      const userDoc = await db.collection('users').doc(decodedToken.uid).get()

      if (!userDoc.exists) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '用戶不存在',
        })
      }

      return reply.send({
        success: true,
        user: userDoc.data(),
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message,
      })
    }
  })
}
