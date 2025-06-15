<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img src="../../public/CKHS-LOGO.ico" style="max-width: 5%; max-height: 5%" fit="contain" />
        <q-toolbar-title> 建中社團管理平台 </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>工具列</q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: '首頁',
    icon: 'home',
    link: '/',
  },
  {
    title: '活動申請',
    icon: 'article',
    link: '/application',
  },
  {
    title: '公告',
    icon: 'campaign',
    link: '/announcement',
  },
  {
    title: '教師資料上傳',
    icon: 'cloud',
    link: '/upload',
  },
  {
    title: '公假登錄',
    icon: 'event',
    link: '/official-leave',
  },
  {
    title: '社團銷曠',
    icon: 'edit',
    link: '/skip',
  },
  {
    title: '違規通知',
    icon: 'warning',
    link: '/notice',
  },
  {
    title: '社團評鑑',
    icon: 'star',
    link: '/evaluation',
  },
  {
    title: '社課重補修',
    icon: 'school',
    link: '/retakecourses',
  },
  {
    title: '關於',
    icon: 'info',
    link: '/about',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
