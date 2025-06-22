<template>
  <q-expansion-item
    expand-separator
    icon="list"
    label="111學年度公告-臺北市立建國高級中學學生社團評鑑暫行辦法"
    caption="請各社團務必詳閱並且遵守"
    default
  >
    <q-card>
      <q-card-section class="text-center">
        <strong>點選按鈕查看校規內容</strong>
      </q-card-section>

      <template v-for="(form, index) in forms" :key="index">
        <div class="row justify-center">
          <q-btn
            :href="form.url"
            style="color: white; background-color: #1c2087"
            class="q-mx-auto"
            target="_blank"
            :label="form.label"
          />
        </div>
        <div class="q-mb-sm" />
      </template>

      <div class="q-mb-sm" />
    </q-card>
  </q-expansion-item>
</template>

<script setup>
const forms = [
  {
    label: '學校首頁公告',
    url: 'https://www.ck.tp.edu.tw/nss/main/freeze/5abf2d62aa93092cee58ceb4/IXZld9j7619/640eabb30a2a8cdfda2a71b4?vector=private&static=false',
  },
  {
    label: '學生社團評鑑暫行辦法',
    url: 'https://drive.google.com/drive/folders/13bsiqyh1teY1e08IZjDmBtY22OWPeeTD',
  },
]
</script>
