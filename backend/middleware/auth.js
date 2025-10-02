import { getAuth } from '../config/firebase.js'

/**
 * 驗證 Firebase ID Token
 */
export async function verifyAuth(request, reply) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: '未提供有效的身份驗證令牌',
      })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await getAuth().verifyIdToken(idToken)

    // 將用戶資訊附加到 request
    request.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'teacher', // 從 custom claims 取得角色
    }
  } catch (error) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: '身份驗證失敗: ' + error.message,
    })
  }
}

/**
 * 檢查是否為台北市教育帳號
 */
export function checkEducationDomain(email) {
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN || 'tp.edu.tw'
  return email && email.endsWith(`@${allowedDomain}`)
}

/**
 * 僅允許管理員訪問
 */
export async function requireAdmin(request, reply) {
  await verifyAuth(request, reply)

  if (request.user.role !== 'admin') {
    return reply.status(403).send({
      error: 'Forbidden',
      message: '權限不足,僅限管理員訪問',
    })
  }
}
