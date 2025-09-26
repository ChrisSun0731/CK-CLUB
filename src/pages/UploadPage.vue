<template>
  <q-page class="q-pa-md full-height">
    <div class="full-height column">
      <!-- 上三分之一：A、B 卡片區域 -->
      <div class="row q-col-gutter-md" style="height: 33.33vh; min-height: 250px">
        <!-- A. 校內指導老師 -->
        <div class="col-6">
          <q-card flat bordered class="full-height q-pa-md">
            <div class="text-h6 text-weight-bold text-center q-mb-md">A. 校內指導老師</div>
            <div class="text-center">不須繳交任何文件</div>
          </q-card>
        </div>

        <!-- B. 外聘指導老師 -->
        <div class="col-6">
          <q-card flat bordered class="full-height q-pa-md">
            <div class="text-h6 text-weight-bold text-center q-mb-md">B. 外聘指導老師</div>
            <div class="q-mb-sm">
              <strong>1.</strong> 所有外聘老師：每年皆須繳交新的會辦單+契約書
            </div>
            <div><strong>2.</strong> 新進外聘老師：需另外繳交一次資料卡</div>
          </q-card>
        </div>
      </div>

      <!-- 下三分之二：按鈕 + iframe 區域 -->
      <div class="row q-col-gutter-md q-mt-md" style="height: 66.67vh; min-height: 500px">
        <!-- 左側三分之一：按鈕區域 -->
        <div class="col-4">
          <div class="column q-gutter-md full-height">
            <q-btn
              @click="showIframe(1)"
              :color="activeIframe === 1 ? 'primary' : 'grey-7'"
              :outline="activeIframe !== 1"
              size="lg"
              class="full-width q-pa-md"
            >
              <div class="column items-center">
                <q-icon name="article" size="md" class="q-mb-sm" />
                <div>資料繳交表單</div>
              </div>
            </q-btn>

            <q-btn
              @click="showIframe(2)"
              :color="activeIframe === 2 ? 'primary' : 'grey-7'"
              :outline="activeIframe !== 2"
              size="lg"
              class="full-width q-pa-md"
            >
              <div class="column items-center">
                <q-icon name="description" size="md" class="q-mb-sm" />
                <div>會辦單、契約書</div>
              </div>
            </q-btn>

            <q-btn
              @click="showIframe(3)"
              :color="activeIframe === 3 ? 'primary' : 'grey-7'"
              :outline="activeIframe !== 3"
              size="lg"
              class="full-width q-pa-md"
            >
              <div class="column items-center">
                <q-icon name="badge" size="md" class="q-mb-sm" />
                <div>資料卡</div>
              </div>
            </q-btn>
          </div>
        </div>

        <!-- 右側三分之二：iframe 顯示區域 -->
        <div class="col-8">
          <q-card flat bordered class="full-height">
            <div v-if="!activeIframe" class="full-height flex flex-center text-grey-6">
              <div class="text-center">
                <q-icon name="touch_app" size="64px" class="q-mb-md" />
                <div class="text-h6">請點擊左側按鈕查看內容</div>
              </div>
            </div>

            <iframe
              v-if="activeIframe"
              :src="currentIframeSrc"
              class="full-height"
              style="border: none; width: 100%"
              allow="autoplay"
              allowfullscreen
              frameborder="0"
            ></iframe>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// 狀態管理
const activeIframe = ref(0) // 0: 未選擇, 1-3: 對應不同的 iframe

// iframe 源網址配置
const iframeSources = {
  1: 'https://docs.google.com/forms/d/e/1FAIpQLSf5Nwy5x4QQjvYkBAi_7cEWRflToVx5JqFpQ2V8DBeUINaLyg/viewform?embedded=true',
  2: 'https://drive.google.com/file/d/1b8xBjcQm_IhgmxrXnMLm41vLbl8LqrEt/preview',
  3: 'https://drive.google.com/file/d/1rn7lwwEUPF8FJGBbT-tMA-G0TCq88ZjB/preview',
}

// 計算屬性：當前 iframe 源
const currentIframeSrc = computed(() => {
  return activeIframe.value ? iframeSources[activeIframe.value] : ''
})

// 切換 iframe 顯示
function showIframe(index) {
  activeIframe.value = index
}
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
