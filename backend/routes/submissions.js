import { getFirestore, getStorage } from '../config/firebase.js'
import { verifyAuth, requireAdmin } from '../middleware/auth.js'

export default async function submissionRoutes(fastify, opts) {
  /**
   * 提交外聘指導教師資料
   * POST /api/submissions
   */
  fastify.post('/', { preHandler: verifyAuth }, async (request, reply) => {
    try {
      const db = getFirestore()
      const storage = getStorage()

      // 使用 multipart 解析表單數據和檔案
      const data = await request.file()
      const fields = {}

      // 解析文字欄位
      for (const [key, value] of Object.entries(request.body || {})) {
        fields[key] = value
      }

      // 處理檔案上傳
      const files = {}
      if (data) {
        const buffer = await data.toBuffer()
        const filename = `submissions/${Date.now()}_${data.filename}`
        const file = storage.file(filename)

        await file.save(buffer, {
          metadata: {
            contentType: data.mimetype,
          },
        })

        // 生成下載 URL
        await file.makePublic()
        const publicUrl = `https://storage.googleapis.com/${storage.name}/${filename}`

        files[data.fieldname] = {
          filename: data.filename,
          url: publicUrl,
          uploadedAt: new Date().toISOString(),
        }
      }

      // 建立提交記錄
      const submission = {
        ...fields,
        files,
        submittedBy: request.user.uid,
        submitterEmail: request.user.email,
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const docRef = await db.collection('submissions').add(submission)

      return reply.status(201).send({
        success: true,
        submissionId: docRef.id,
        data: submission,
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
   * 獲取所有提交記錄 (管理員)
   * GET /api/submissions
   */
  fastify.get('/', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const db = getFirestore()
      const { status, club, limit = 50 } = request.query

      let query = db.collection('submissions').orderBy('createdAt', 'desc')

      if (status) {
        query = query.where('status', '==', status)
      }

      if (club) {
        query = query.where('club', '==', club)
      }

      query = query.limit(parseInt(limit))

      const snapshot = await query.get()
      const submissions = []

      snapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      return reply.send({
        success: true,
        count: submissions.length,
        data: submissions,
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
   * 獲取單筆提交記錄
   * GET /api/submissions/:id
   */
  fastify.get('/:id', { preHandler: verifyAuth }, async (request, reply) => {
    try {
      const db = getFirestore()
      const { id } = request.params

      const doc = await db.collection('submissions').doc(id).get()

      if (!doc.exists) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '找不到該提交記錄',
        })
      }

      const data = doc.data()

      // 檢查權限:只有提交者本人或管理員可以查看
      if (data.submittedBy !== request.user.uid && request.user.role !== 'admin') {
        return reply.status(403).send({
          error: 'Forbidden',
          message: '權限不足',
        })
      }

      return reply.send({
        success: true,
        data: {
          id: doc.id,
          ...data,
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
   * 更新提交狀態 (審核功能 - 管理員)
   * PATCH /api/submissions/:id
   */
  fastify.patch('/:id', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const db = getFirestore()
      const { id } = request.params
      const { status, reviewNote } = request.body

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: '無效的狀態值',
        })
      }

      await db
        .collection('submissions')
        .doc(id)
        .update({
          status,
          reviewNote: reviewNote || '',
          reviewedBy: request.user.uid,
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

      return reply.send({
        success: true,
        message: '狀態更新成功',
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
   * 刪除提交記錄 (管理員)
   * DELETE /api/submissions/:id
   */
  fastify.delete('/:id', { preHandler: requireAdmin }, async (request, reply) => {
    try {
      const db = getFirestore()
      const { id } = request.params

      await db.collection('submissions').doc(id).delete()

      return reply.send({
        success: true,
        message: '刪除成功',
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
