import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LOGS_DIR = path.join(__dirname, '..', 'logs')

// 確保 logs 目錄存在
async function ensureLogsDir() {
  try {
    await fs.access(LOGS_DIR)
  } catch {
    await fs.mkdir(LOGS_DIR, { recursive: true })
  }
}

// 格式化時間戳
function getTimestamp() {
  return new Date().toISOString()
}

// 獲取當前日期的日誌文件名
function getLogFilename(type = 'general') {
  const date = new Date().toISOString().split('T')[0]
  return `${type}-${date}.log`
}

// 寫入日誌到文件
async function writeToFile(message, type = 'general') {
  await ensureLogsDir()
  const filename = getLogFilename(type)
  const filepath = path.join(LOGS_DIR, filename)
  const logEntry = `[${getTimestamp()}] ${message}\n`

  try {
    await fs.appendFile(filepath, logEntry, 'utf8')
  } catch (error) {
    console.error('Failed to write log to file:', error)
  }
}

// 日誌等級
const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
}

// 主日誌類
class Logger {
  constructor(module = 'APP') {
    this.module = module
  }

  _formatMessage(level, message, meta = {}) {
    const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : ''
    return `[${level}] [${this.module}] ${message}${metaStr}`
  }

  async _log(level, message, meta = {}, logType = 'general') {
    const formattedMessage = this._formatMessage(level, message, meta)

    // 輸出到控制台
    const consoleFn =
      level === LogLevel.ERROR
        ? console.error
        : level === LogLevel.WARN
          ? console.warn
          : console.log

    consoleFn(formattedMessage)

    // 寫入到文件
    await writeToFile(formattedMessage, logType)
  }

  async debug(message, meta = {}) {
    await this._log(LogLevel.DEBUG, message, meta, 'general')
  }

  async info(message, meta = {}) {
    await this._log(LogLevel.INFO, message, meta, 'general')
  }

  async warn(message, meta = {}) {
    await this._log(LogLevel.WARN, message, meta, 'general')
  }

  async error(message, meta = {}) {
    await this._log(LogLevel.ERROR, message, meta, 'error')
  }

  // 針對 API 請求的專門日誌
  async api(method, path, statusCode, meta = {}) {
    const message = `${method} ${path} - ${statusCode}`
    await this._log(LogLevel.INFO, message, meta, 'api')
  }

  // 針對模板下載的專門日誌
  async template(action, templateId, success, meta = {}) {
    const level = success ? LogLevel.INFO : LogLevel.ERROR
    const message = `Template ${action}: ${templateId} - ${success ? 'SUCCESS' : 'FAILED'}`
    await this._log(level, message, meta, 'template')
  }
}

// 創建預設 logger 實例
export function createLogger(module) {
  return new Logger(module)
}

export default Logger
