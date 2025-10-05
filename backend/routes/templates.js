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

      // 根據 ID 對應檔案基礎名稱（不含副檔名）
      const templateBaseNames = {
        'template-1': '會辦單_契約書',
        'template-2': '資料卡',
      }

      const baseName = templateBaseNames[id]

      if (!baseName) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '找不到該範本',
        })
      }

      // 支援的檔案格式（優先順序由高到低）
      const supportedFormats = [
        { ext: '.pdf', mimeType: 'application/pdf' },
        { ext: '.doc', mimeType: 'application/msword' },
        {
          ext: '.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      ]

      // 依優先順序尋找檔案
      let foundFile = null
      let mimeType = null

      for (const format of supportedFormats) {
        const filepath = path.join(TEMPLATES_DIR, baseName + format.ext)
        try {
          await fs.access(filepath)
          foundFile = filepath
          mimeType = format.mimeType
          break // 找到第一個存在的檔案就停止
        } catch {
          // 檔案不存在，繼續尋找下一個格式
          continue
        }
      }

      if (!foundFile) {
        return reply.status(404).send({
          error: 'Not Found',
          message: '範本檔案不存在（已嘗試 PDF、DOC、DOCX 格式）',
        })
      }

      // 取得實際檔案名稱
      const actualFilename = path.basename(foundFile)

      // 發送檔案
      return reply
        .type(mimeType)
        .header(
          'Content-Disposition',
          `attachment; filename="${encodeURIComponent(actualFilename)}"`,
        )
        .send(await fs.readFile(foundFile))
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message,
      })
    }
  })
}
