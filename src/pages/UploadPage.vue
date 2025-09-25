<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg q-mx-auto" style="max-width: 800px; width: 100%">
      <!-- 標題 -->
      <q-card-section class="text-center">
        <h4><strong>社團教師資料上傳</strong></h4>
      </q-card-section>

      <q-separator spaced />

      <!-- 兩欄佈局：A.校內 和 B.校外 -->
      <q-card-section>
        <div class="row q-col-gutter-lg">
          <!-- A. 校內指導老師 -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height q-pa-md">
              <div class="text-h6 text-weight-bold text-center q-mb-md">A. 校內指導老師</div>
              <div class="text-center">不須繳交任何文件</div>
            </q-card>
          </div>

          <!-- B. 外聘指導老師 -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height q-pa-md">
              <div class="text-h6 text-weight-bold text-center q-mb-md">B. 外聘指導老師</div>
              <div class="q-mb-sm">
                <strong>1.</strong> 所有外聘老師：每年皆須繳交新的會辦單+契約書
              </div>
              <div><strong>2.</strong> 新進外聘老師：需另外繳交一次資料卡</div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <!-- 按鈕區域 - 左側四分之一處 -->
      <q-card-section>
        <div class="row">
          <div class="col-3">
            <div class="column q-gutter-md">
              <q-btn
                href="https://docs.google.com/forms/d/e/1FAIpQLSf5Nwy5x4QQjvYkBAi_7cEWRflToVx5JqFpQ2V8DBeUINaLyg/viewform"
                style="color: white; background-color: #1c2087"
                target="_blank"
                size="md"
                class="full-width"
              >
                1. 資料繳交表單
              </q-btn>

              <q-btn
                href="https://sites.google.com/gl.ck.tp.edu.tw/ckclub/%E7%A4%BE%E5%9C%98%E6%95%99%E5%B8%AB%E8%B3%87%E6%96%99%E4%B8%8A%E5%82%B3?authuser=0#h.bwe8631n56yd"
                style="color: white; background-color: #1c2087"
                target="_blank"
                size="md"
                class="full-width"
              >
                2. 會辦單、契約書
              </q-btn>

              <q-btn
                href="https://sites.google.com/gl.ck.tp.edu.tw/ckclub/%E7%A4%BE%E5%9C%98%E6%95%99%E5%B8%AB%E8%B3%87%E6%96%99%E4%B8%8A%E5%82%B3?authuser=0#h.cg1ohytd944b"
                style="color: white; background-color: #1c2087"
                target="_blank"
                size="md"
                class="full-width"
              >
                3. 資料卡
              </q-btn>
            </div>
          </div>
          <div class="col-9">
            <!-- 右側空白區域 -->
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
