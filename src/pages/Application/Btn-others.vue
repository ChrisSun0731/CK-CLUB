<template>
  <q-expansion-item expand-separator icon="list" label="其他相關表件、網址" default>
    <q-card-section class="text-center"><strong>點選按鈕前往連結</strong></q-card-section>

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
</template>

<script setup>
const forms = [
  {
    label: '團體公假單(高一高二分別填寫)',
    url: 'https://drive.google.com/file/d/1AcmMTSnNqS9ITuDNcBvgfGsSYbK2WtD9/view',
  },
  {
    label: '校內場地價目表',
    url: 'https://drive.google.com/file/d/1U14oqVigtUfylIsm9816X4J0JlZYQI2B/view',
  },
  {
    label: '夢紅樓場地價目表',
    url: 'https://drive.google.com/file/d/1jp9XmYpA7Znn5iJp7t_mcyr4n7rWCaIV/view',
  },
  {
    label: '臺北市政府青年局',
    url: 'https://tpyd.gov.taipei/',
  },
]
</script>
