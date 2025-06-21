<template>
  <q-expansion-item
    expand-separator
    icon="list"
    label="B：校內活動場地申請表"
    caption="請詳閱注意事項"
    default
  >
    <q-card>
      <q-expansion-item expand-separator icon="announcement" label="注意事項與使用規則" default>
        <q-card-section class="row justify-center">
          1.
          外校同學入校使用場地或進入社辦請務必4天前申請，申請書請於下方下載申請書(舉辦活動請附企畫書)。<br />
          2.
          依規定有校外同學使用場地，將需收取場地費、照明費、廁所清潔費等：參閱場地價目表(清潔費1小時100元)。<br />
          3. 留意使用規範：臺北市立建國高級中學學生社團活動場地借用及社團辦公室管理規則。
        </q-card-section>
        <div class="row justify-center">
          <q-btn
            href="https://drive.google.com/file/d/1jc45MPTxUwXTIxLJ9kwTJPMzz3DzESlm/view"
            style="color: white; background-color: #1c2087"
            class="q-mx-auto"
            target="_blank"
          >
            查看使用規則
          </q-btn>
        </div>
        <div><br /></div>
      </q-expansion-item>

      <q-expansion-item expand-separator icon="description" label="申請表" default>
        <q-card-section class="text-center"><strong>點選按鈕下載申請表</strong></q-card-section>

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
    label: '一般教室',
    url: 'https://drive.google.com/file/d/1FVZ-kULcDvvmmp1HGPpT4LTKsXs2Fg57/view',
  },
  {
    label: '活動中心三樓',
    url: 'https://drive.google.com/file/d/1Ep80C-4XVieVulk_mdzy_UZba9WwzZqP/view',
  },
  {
    label: '電腦教室',
    url: 'https://drive.google.com/file/d/1c-mVlvNzwmudR064pRuDL4xgG5U75otj/view',
  },
  {
    label: '戶外空間',
    url: 'https://drive.google.com/file/d/1A6IBF6gCUw3RgbVorQ8iTCG2tbjeVsZV/view',
  },
  {
    label: '夢紅樓',
    url: 'https://drive.google.com/file/d/1siuB89eUdb_25_3BCygGhlpxxe7QOQH0/view',
  },
  {
    label: '資源大樓五樓',
    url: 'https://drive.google.com/file/d/1SO-A0gidaayzSvzvRhFJ-zx8NVIAUYz6/view',
  },
]
</script>
