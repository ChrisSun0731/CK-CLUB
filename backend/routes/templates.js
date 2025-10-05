import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 模板目錄路徑
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates')

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

      // 根據 ID 對應檔案名稱
      const templateFiles = {
        'template-1': '會辦單_契約書.pdf',
        'template-2': '資料卡.pdf',
      }

      const filename = templateFiles[id]

      if (!filename) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '找不到該範本',
        })
      }

      const filepath = path.join(TEMPLATES_DIR, filename)

      // 檢查檔案是否存在
      try {
        await fs.access(filepath)
      } catch {
        return reply.status(404).send({
          error: 'Not Found',
          message: '範本檔案不存在',
        })
      }

      // 發送檔案
      return reply
        .type('application/pdf')
        .header('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
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
