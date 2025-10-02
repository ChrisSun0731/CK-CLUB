<template>
  <q-page class="q-pa-md">
    <div class="column">
      <!-- 上方：說明卡片 -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- A. 校內指導老師 -->
        <div class="col-6">
          <q-card flat bordered class="q-pa-md">
            <div class="text-h6 text-weight-bold text-center q-mb-md">A. 校內指導老師</div>
            <div class="text-center">不須繳交任何文件</div>
          </q-card>
        </div>

        <!-- B. 外聘指導老師 -->
        <div class="col-6">
          <q-card flat bordered class="q-pa-md">
            <div class="text-h6 text-weight-bold text-center q-mb-md">B. 外聘指導老師</div>
            <div class="q-mb-sm">
              <strong>1.</strong> 所有外聘老師：每年皆須繳交新的會辦單+契約書
            </div>
            <div><strong>2.</strong> 新進外聘老師：需另外繳交一次資料卡。</div>
          </q-card>
        </div>
      </div>

      <!-- 主要區域：表單與範本下載 -->
      <div class="row q-col-gutter-md">
        <!-- 左側：表單區域 -->
        <div class="col-12 col-md-8">
          <q-card flat bordered class="q-pa-lg">
            <div class="text-h5 q-mb-md">
              <q-icon name="description" class="q-mr-sm" />
              外聘指導教師資料繳交表單
            </div>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <!-- 社團資訊 -->
              <div class="text-subtitle1 text-weight-bold q-mt-md">社團資訊</div>
              <q-separator />

              <q-select
                v-model="formData.club"
                :options="clubOptions"
                label="社團名稱 *"
                filled
                :rules="[(val) => !!val || '請選擇社團']"
              />

              <q-input v-model="formData.clubLeader" label="社長" filled />

              <q-input
                v-model.number="formData.grade"
                type="number"
                label="年級 *"
                filled
                :rules="[(val) => !!val || '請輸入年級']"
              />

              <!-- 教師資訊 -->
              <div class="text-subtitle1 text-weight-bold q-mt-lg">教師資訊</div>
              <q-separator />

              <q-input
                v-model="formData.teacherName"
                label="教師姓名 *"
                filled
                :rules="[(val) => !!val || '請輸入教師姓名']"
              />

              <q-input v-model="formData.lineId" label="Line ID *" filled />

              <!-- 繳交項目 -->
              <div class="text-subtitle1 text-weight-bold q-mt-lg">繳交項目</div>
              <q-separator />

              <q-checkbox v-model="formData.items.contractAndAgreement" label="會辦單+契約書" />
              <q-checkbox v-model="formData.items.dataCard" label="資料卡" />
              <q-checkbox v-model="formData.items.others" label="其他" />

              <q-input
                v-if="formData.items.others"
                v-model="formData.items.otherDescription"
                label="其他說明"
                type="textarea"
                filled
                rows="3"
              />

              <!-- 檔案上傳 -->
              <div class="text-subtitle1 text-weight-bold q-mt-lg">檔案上傳</div>
              <q-separator />

              <q-file
                v-if="formData.items.contractAndAgreement"
                v-model="files.contractFile"
                label="會辦單+契約書 (PDF, 最大 10MB)"
                filled
                accept=".pdf"
                max-file-size="10485760"
                @rejected="onFileRejected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <q-file
                v-if="formData.items.dataCard"
                v-model="files.dataCardFile"
                label="資料卡 (PDF, 最大 10MB)"
                filled
                accept=".pdf"
                max-file-size="10485760"
                @rejected="onFileRejected"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <!-- 提交按鈕 -->
              <div class="q-mt-lg">
                <q-btn
                  type="submit"
                  label="提交資料"
                  color="primary"
                  size="lg"
                  :loading="submitting"
                  :disable="!isAuthenticated"
                  class="full-width"
                />
                <div v-if="!isAuthenticated" class="text-caption text-negative q-mt-sm">
                  請先登入才能提交資料
                </div>
              </div>
            </q-form>
          </q-card>
        </div>

        <!-- 右側：範本下載 -->
        <div class="col-12 col-md-4">
          <q-card flat bordered class="q-pa-md sticky-card">
            <div class="text-h6 q-mb-md">
              <q-icon name="download" class="q-mr-sm" />
              範本下載
            </div>

            <q-list separator>
              <q-item
                v-for="template in templates"
                :key="template.id"
                clickable
                @click="downloadTemplate(template.id)"
              >
                <q-item-section avatar>
                  <q-icon name="picture_as_pdf" color="red" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ template.name }}</q-item-label>
                  <q-item-label caption>{{ template.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="download" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/composables/useAuth'
import { createSubmission, getTemplates, getTemplateDownloadUrl } from 'src/services/api'

const $q = useQuasar()
const { isAuthenticated } = useAuth()

// 表單數據
const formData = ref({
  club: null,
  clubCode: '',
  clubLeader: '',
  grade: null,
  teacherName: '',
  lineId: '',
  items: {
    contractAndAgreement: false,
    dataCard: false,
    others: false,
    otherDescription: '',
  },
})

// 檔案數據
const files = ref({
  contractFile: null,
  dataCardFile: null,
})

// 社團選項 (從圖片中提取的建中社團列表)
const clubOptions = ref([
  '籃球社',
  '排球社',
  '羽球社',
  '桌球社',
  '網球社',
  '游泳社',
  '田徑社',
  '足球社',
  '棒球社',
  // 可以繼續添加更多社團
])

// 範本列表
const templates = ref([])

// 提交狀態
const submitting = ref(false)

// 載入範本列表
onMounted(async () => {
  try {
    const response = await getTemplates()
    templates.value = response.data
  } catch (error) {
    console.error('載入範本失敗:', error)
  }
})

// 提交表單
async function onSubmit() {
  if (!isAuthenticated.value) {
    $q.notify({
      type: 'negative',
      message: '請先登入才能提交資料',
    })
    return
  }

  try {
    submitting.value = true

    // 建立 FormData
    const submitData = new FormData()

    // 添加文字欄位
    Object.keys(formData.value).forEach((key) => {
      if (key === 'items') {
        submitData.append(key, JSON.stringify(formData.value[key]))
      } else {
        submitData.append(key, formData.value[key])
      }
    })

    // 添加檔案
    if (files.value.contractFile) {
      submitData.append('contractFile', files.value.contractFile)
    }
    if (files.value.dataCardFile) {
      submitData.append('dataCardFile', files.value.dataCardFile)
    }

    // 提交到後端
    await createSubmission(submitData)

    $q.notify({
      type: 'positive',
      message: '資料提交成功！',
      caption: '請等待管理員審核',
    })

    // 重置表單
    resetForm()
  } catch (error) {
    console.error('提交失敗:', error)
    $q.notify({
      type: 'negative',
      message: '提交失敗: ' + (error.response?.data?.message || error.message),
    })
  } finally {
    submitting.value = false
  }
}

// 下載範本
async function downloadTemplate(templateId) {
  try {
    const response = await getTemplateDownloadUrl(templateId)
    window.open(response.downloadUrl, '_blank')
  } catch (error) {
    console.error('下載失敗:', error)
    $q.notify({
      type: 'negative',
      message: '下載失敗，請稍後再試',
    })
  }
}

// 檔案拒絕處理
function onFileRejected(rejectedEntries) {
  $q.notify({
    type: 'negative',
    message: `檔案不符合要求: ${rejectedEntries[0].failedPropValidation}`,
  })
}

// 重置表單
function resetForm() {
  formData.value = {
    club: null,
    clubCode: '',
    clubLeader: '',
    grade: null,
    teacherName: '',
    lineId: '',
    items: {
      contractAndAgreement: false,
      dataCard: false,
      others: false,
      otherDescription: '',
    },
  }
  files.value = {
    contractFile: null,
    dataCardFile: null,
  }
}
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 20px;
}
</style>
