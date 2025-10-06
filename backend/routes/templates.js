import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createLogger } from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 模板目錄路徑
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates')

// 創建 logger
const logger = createLogger('TEMPLATE')

export default async function templateRoutes(fastify) {
  /**
   * 獲取範本列表
   * GET /api/templates
   */
  fastify.get('/', async (request, reply) => {
    try {
      await logger.info('Fetching template list')

      // 預定義的範本清單
      const templates = [
        {
          id: 'template-1',
          name: '校外社團指導教師會辦單+契約書',
          filename: 'meeting_form_contract.pdf',
          description: '所有外聘老師每年皆須繳交',
          url: '/api/templates/download/template-1',
        },
        {
          id: 'template-2',
          name: '資料卡',
          filename: 'data_card.pdf',
          description: '新進外聘老師需另外繳交一次',
          url: '/api/templates/download/template-2',
        },
      ]

      await logger.info('Template list retrieved successfully', {
        count: templates.length,
      })

      return reply.send({
        success: true,
        data: templates,
      })
    } catch (error) {
      await logger.error('Failed to fetch template list', {
        error: error.message,
        stack: error.stack,
      })
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
    const startTime = Date.now()

    try {
      const { id } = request.params

      await logger.info(`Starting template download request`, { templateId: id })

      // 根據 ID 對應檔案基礎名稱（不含副檔名）
      const templateBaseNames = {
        'template-1': 'meeting_form_contract',
        'template-2': 'data_card',
      }

      const baseName = templateBaseNames[id]

      if (!baseName) {
        await logger.warn(`Template not found - invalid ID`, { templateId: id })
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Template not found',
        })
      }

      await logger.debug(`Looking for template file`, {
        templateId: id,
        baseName,
        templatesDir: TEMPLATES_DIR,
      })

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
        await logger.debug(`Checking file existence`, {
          filepath,
          format: format.ext,
        })

        try {
          await fs.access(filepath)
          foundFile = filepath
          mimeType = format.mimeType
          await logger.info(`Template file found`, {
            filepath,
            format: format.ext,
          })
          break // 找到第一個存在的檔案就停止
        } catch {
          await logger.debug(`File not found, trying next format`, {
            filepath,
            format: format.ext,
          })
          continue
        }
      }

      if (!foundFile) {
        await logger.error(`Template file not found in any format`, {
          templateId: id,
          baseName,
          templatesDir: TEMPLATES_DIR,
          triedFormats: supportedFormats.map((f) => f.ext),
        })
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Template file not found (tried PDF, DOC, DOCX formats)',
        })
      }

      // 使用英文檔名，簡化處理
      const filename = path.basename(foundFile)
      const fileStats = await fs.stat(foundFile)

      await logger.info(`Preparing to send file`, {
        filename,
        size: fileStats.size,
        mimeType,
      })

      // 讀取檔案內容
      const fileContent = await fs.readFile(foundFile)

      await logger.info(`Template download completed successfully`, {
        templateId: id,
        filename,
        size: fileStats.size,
        duration: Date.now() - startTime,
      })

      // 記錄到專門的 template log
      await logger.template('download', id, true, {
        filename,
        size: fileStats.size,
        duration: Date.now() - startTime,
      })

      // 發送檔案
      return reply
        .type(mimeType)
        .header('Content-Disposition', `attachment; filename="${filename}"`)
        .send(fileContent)
    } catch (error) {
      const duration = Date.now() - startTime

      await logger.error(`Template download failed`, {
        templateId: request.params.id,
        error: error.message,
        stack: error.stack,
        duration,
      })

      await logger.template('download', request.params.id, false, {
        error: error.message,
        duration,
      })

      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Internal Server Error',
        message: error.message,
      })
    }
  })
}
