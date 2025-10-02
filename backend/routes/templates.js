import { getStorage } from '../config/firebase.js'

export default async function templateRoutes(fastify, opts) {
  /**
   * 獲取範本列表
   * GET /api/templates
   */
  fastify.get('/', async (request, reply) => {
    try {
      // 預定義的範本清單
      const templates = [
        {
          id: 'template-1',
          name: '校外社團指導教師會辦單+契約書',
          filename: '會辦單_契約書.pdf',
          description: '所有外聘老師每年皆須繳交',
          url: '/api/templates/download/template-1',
        },
        {
          id: 'template-2',
          name: '資料卡',
          filename: '資料卡.pdf',
          description: '新進外聘老師需另外繳交一次',
          url: '/api/templates/download/template-2',
        },
      ]

      return reply.send({
        success: true,
        data: templates,
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
   * 下載範本
   * GET /api/templates/download/:id
   */
  fastify.get('/download/:id', async (request, reply) => {
    try {
      const { id } = request.params
      const storage = getStorage()

      // 根據 ID 對應檔案路徑
      const templateFiles = {
        'template-1': 'templates/會辦單_契約書.pdf',
        'template-2': 'templates/資料卡.pdf',
      }

      const filePath = templateFiles[id]

      if (!filePath) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '找不到該範本',
        })
      }

      const file = storage.file(filePath)
      const [exists] = await file.exists()

      if (!exists) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '範本檔案不存在',
        })
      }

      // 生成帶有過期時間的下載 URL (24小時有效)
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })

      return reply.send({
        success: true,
        downloadUrl: url,
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
