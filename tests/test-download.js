/**
 * 本地檔案下載 API 測試腳本
 *
 * 用途：測試範本下載 API 是否正常工作
 *
 * 執行方式：
 * node test-download.js
 */

const fs = require('fs')
const path = require('path')
const http = require('http')

// 測試配置
const TEST_CONFIG = {
  host: 'localhost',
  port: 3000,
  templates: [
    { id: 'template-1', expectedFilename: 'meeting_form_contract.pdf' },
    { id: 'template-2', expectedFilename: 'data_card.doc' },
  ],
}

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function testDownload(templateId, expectedFilename) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    log(`\n${'='.repeat(60)}`, 'cyan')
    log(`開始測試: ${templateId}`, 'cyan')
    log(`預期檔名: ${expectedFilename}`, 'cyan')
    log('='.repeat(60), 'cyan')

    const options = {
      hostname: TEST_CONFIG.host,
      port: TEST_CONFIG.port,
      path: `/api/templates/download/${templateId}`,
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    }

    const req = http.request(options, (res) => {
      log(`\n📡 Response Status: ${res.statusCode}`, res.statusCode === 200 ? 'green' : 'red')
      log(`📋 Headers:`, 'blue')
      Object.entries(res.headers).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`)
      })

      let data = []
      let receivedBytes = 0

      res.on('data', (chunk) => {
        data.push(chunk)
        receivedBytes += chunk.length
        process.stdout.write(`\r📥 已接收: ${receivedBytes} bytes`)
      })

      res.on('end', () => {
        const duration = Date.now() - startTime
        const buffer = Buffer.concat(data)

        console.log() // 換行
        log(`\n✅ 下載完成`, 'green')
        log(`📦 檔案大小: ${buffer.length} bytes`, 'green')
        log(`⏱️  耗時: ${duration} ms`, 'green')

        // 解析 Content-Disposition
        const contentDisposition = res.headers['content-disposition']
        let actualFilename = 'unknown'
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/)
          if (match) {
            actualFilename = match[1]
          }
        }

        log(`\n📄 檔名比對:`, 'yellow')
        log(`   預期: ${expectedFilename}`, 'yellow')
        log(`   實際: ${actualFilename}`, 'yellow')
        log(
          `   結果: ${actualFilename === expectedFilename ? '✅ 相符' : '❌ 不符'}`,
          actualFilename === expectedFilename ? 'green' : 'red',
        )

        // 儲存測試檔案
        const outputDir = path.join(__dirname, 'test-downloads')
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true })
        }

        const outputPath = path.join(outputDir, actualFilename)
        fs.writeFileSync(outputPath, buffer)
        log(`\n💾 測試檔案已儲存至: ${outputPath}`, 'blue')

        // 驗證檔案完整性
        const fileStats = fs.statSync(outputPath)
        log(`\n🔍 檔案驗證:`, 'yellow')
        log(`   檔案大小: ${fileStats.size} bytes`, 'yellow')
        log(
          `   可讀取: ${fs.existsSync(outputPath) ? '✅' : '❌'}`,
          fs.existsSync(outputPath) ? 'green' : 'red',
        )

        resolve({
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          fileSize: buffer.length,
          duration,
          actualFilename,
          expectedFilename,
          filenameMatch: actualFilename === expectedFilename,
          outputPath,
        })
      })
    })

    req.on('error', (error) => {
      log(`\n❌ 請求失敗: ${error.message}`, 'red')
      reject(error)
    })

    req.setTimeout(10000, () => {
      req.destroy()
      log(`\n❌ 請求逾時 (10秒)`, 'red')
      reject(new Error('Request timeout'))
    })

    req.end()
  })
}

async function runTests() {
  log('\n' + '='.repeat(60), 'cyan')
  log('範本下載 API 測試工具', 'cyan')
  log('='.repeat(60), 'cyan')
  log(`測試目標: http://${TEST_CONFIG.host}:${TEST_CONFIG.port}`, 'blue')
  log(`測試範本數量: ${TEST_CONFIG.templates.length}`, 'blue')

  const results = []

  for (const template of TEST_CONFIG.templates) {
    try {
      const result = await testDownload(template.id, template.expectedFilename)
      results.push(result)
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        templateId: template.id,
      })
    }
  }

  // 輸出總結
  log('\n' + '='.repeat(60), 'cyan')
  log('測試結果總結', 'cyan')
  log('='.repeat(60), 'cyan')

  const successCount = results.filter((r) => r.success).length
  const totalCount = results.length

  log(`\n總測試數: ${totalCount}`, 'blue')
  log(`成功: ${successCount}`, successCount === totalCount ? 'green' : 'yellow')
  log(`失敗: ${totalCount - successCount}`, totalCount - successCount === 0 ? 'green' : 'red')

  results.forEach((result, index) => {
    const template = TEST_CONFIG.templates[index]
    log(`\n📋 範本 ${template.id}:`, 'yellow')
    if (result.success) {
      log(`   ✅ 狀態碼: ${result.statusCode}`, 'green')
      log(`   ✅ 檔案大小: ${result.fileSize} bytes`, 'green')
      log(`   ✅ 耗時: ${result.duration} ms`, 'green')
      log(
        `   ${result.filenameMatch ? '✅' : '❌'} 檔名: ${result.actualFilename}`,
        result.filenameMatch ? 'green' : 'red',
      )
      log(`   💾 儲存至: ${result.outputPath}`, 'blue')
    } else {
      log(`   ❌ 失敗: ${result.error}`, 'red')
    }
  })

  log('\n' + '='.repeat(60), 'cyan')
  log(
    successCount === totalCount ? '✅ 所有測試通過！' : '⚠️  部分測試失敗',
    successCount === totalCount ? 'green' : 'yellow',
  )
  log('='.repeat(60), 'cyan')

  process.exit(successCount === totalCount ? 0 : 1)
}

// 執行測試
runTests().catch((error) => {
  log(`\n❌ 測試執行失敗: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
