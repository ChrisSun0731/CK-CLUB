<template>
  <q-expansion-item expand-separator icon="list" label="D：企劃書" caption="請詳閱注意事項" default>
    <q-card>
      <q-expansion-item expand-separator icon="announcement" label="特別注意事項" default>
        <q-card-section class="row justify-center">
          <strong>【經費預算表】</strong>
        </q-card-section>
        <q-card-section class="row justify-center">
          1.
          社費為成員所共享，而非活動費用。若非所有成員皆會出席的活動，請勿使用「社費」支出／補貼，應以收取報名費之形式辦理。<br />
          2.
          經費預算表請務必明列「收入」與「支出」，結餘金額若有盈餘不得收歸社費，應退還參與活動的人員。<br />
          3.
          擬辦活動時應仔細參酌經費使用，避免社團成員需分攤過多金額，表格外也須明確列出每人所需支付／分攤的金額。<br />
        </q-card-section>
        <q-card-section class="row justify-center">
          <strong>【成果報告書】</strong>
        </q-card-section>
        <q-card-section class="row justify-center">
          活動辦理成果請於活動結束後兩週內上傳。
        </q-card-section>
        <div><br /></div>
      </q-expansion-item>

      <q-expansion-item expand-separator icon="description" label="範本、模板與成果上傳" default>
        <q-card-section class="text-center"><strong>點選按鈕下載或開啟表單</strong></q-card-section>

        <template v-for="(form, index) in forms" :key="index">
          <div class="row justify-center">
            <q-btn
              :href="form.url"
              style="color: white; background-color: #1c2087"
              class="q-mx-auto"
              target="_blank"
            >
              {{ form.label }}
            </q-btn>
          </div>
          <div><br /></div>
        </template>
      </q-expansion-item>
    </q-card>
  </q-expansion-item>
</template>

<script setup>
const forms = [
  {
    label: '企劃書目錄模板',
    url: 'https://docs.google.com/document/d/1FglhDEUkn5MzTX-kDwDN2HL4nzJizXOzgbUhKdmRWQw/edit?tab=t.0',
  },
  {
    label: '企劃書範本參考',
    url: 'https://docs.google.com/document/d/1psNb3pbU1nL6WEZW0y-wn4b8il-YTimrVlw8vhv0uSU/edit?tab=t.0',
  },
  {
    label: '成果報告格式',
    url: 'https://drive.google.com/file/d/1k5641_XpStKR5igG4VPGnAOhfJFPsLMU/view',
  },
  {
    label: '成果報告上傳表單',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSdtR-bc9idw6JXl86-4Jr_b1M9yZPsO9ZobRXQ4hT19gGvgFQ/viewform',
  },
]
</script>
