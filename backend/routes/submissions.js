import { getFirestore } from '../config/firebase.js'
import { verifyAuth, requireAdmin } from '../middleware/auth.js'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 上傳目錄路徑
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

// 確保上傳目錄存在
async function ensureUploadDir() {
  try {
    await fs.access(UPLOADS_DIR)
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
  }
}

export default async function submissionRoutes(fastify, opts) {
  /**
   * 提交外聘指導教師資料
   * POST /api/submissions
   */
  fastify.post('/', { preHandler: verifyAuth }, async (request, reply) => {
    try {
      const db = getFirestore()
      await ensureUploadDir()

      // 使用 multipart 解析表單數據和檔案
      const parts = request.parts()
      const fields = {}
      const files = {}

      for await (const part of parts) {
        if (part.type === 'file') {
          // 處理檔案上傳
          const buffer = await part.toBuffer()
          const timestamp = Date.now()
          const filename = `${timestamp}_${part.filename}`
          const filepath = path.join(UPLOADS_DIR, filename)

          await fs.writeFile(filepath, buffer)

          files[part.fieldname] = {
            filename: part.filename,
            storedFilename: filename,
            mimetype: part.mimetype,
            size: buffer.length,
            uploadedAt: new Date().toISOString(),
          }
        } else {
          // 處理文字欄位
          fields[part.fieldname] = part.value
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

      // 獲取提交記錄以刪除關聯的檔案
      const doc = await db.collection('submissions').doc(id).get()
      if (doc.exists) {
        const data = doc.data()

        // 刪除相關檔案
        if (data.files) {
          for (const file of Object.values(data.files)) {
            try {
              const filepath = path.join(UPLOADS_DIR, file.storedFilename)
              await fs.unlink(filepath)
            } catch (err) {
              fastify.log.warn(`Failed to delete file: ${file.storedFilename}`)
            }
          }
        }
      }

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

  /**
   * 下載提交的檔案
   * GET /api/submissions/:id/files/:filename
   */
  fastify.get('/:id/files/:filename', { preHandler: verifyAuth }, async (request, reply) => {
    try {
      const db = getFirestore()
      const { id, filename } = request.params

      const doc = await db.collection('submissions').doc(id).get()

      if (!doc.exists) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '找不到該提交記錄',
        })
      }

      const data = doc.data()

      // 檢查權限
      if (data.submittedBy !== request.user.uid && request.user.role !== 'admin') {
        return reply.status(403).send({
          error: 'Forbidden',
          message: '權限不足',
        })
      }

      // 查找檔案
      const fileInfo = Object.values(data.files || {}).find((f) => f.storedFilename === filename)

      if (!fileInfo) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '找不到該檔案',
        })
      }

      // 發送檔案
      const filepath = path.join(UPLOADS_DIR, filename)
      return reply
        .type(fileInfo.mimetype)
        .header('Content-Disposition', `attachment; filename="${fileInfo.filename}"`)
        .send(await fs.readFile(filepath))
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message,
      })
    }
  })
}
