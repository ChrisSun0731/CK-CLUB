<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header class="bg-primary text-white no-print" elevated height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/icons/CKHS-LOGO.png" style="width: 40px; height: 40px" />
          </q-avatar>
          <span v-if="$q.screen.gt.xs" class="q-pl-sm cursor-pointer" @click="goHome">
            建中社團管理平台
          </span>
          <span v-else class="q-pl-sm cursor-pointer" @click="goHome"> 社團管理平台 </span>
        </q-toolbar-title>

        <q-space />

        <!-- 頁面選擇按鈕 -->
        <div class="row q-gutter-xs q-mr-md">
          <q-btn
            v-for="link in linksList"
            :key="link.title"
            :to="link.link"
            @click="changeSelected(link.title)"
            flat
            dense
            :label="link.title"
            :icon="link.icon"
            :class="{ 'active-page': selected === link.title }"
            class="page-btn"
          />
        </div>

        <q-btn flat dense :icon="Dark.isActive ? 'dark_mode' : 'nights_stay'" @click="toggleDark" />
        <q-btn flat dense icon="fullscreen" @click="toggleFullscreen" />
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Dark, LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const selected = ref('頁面選單')

function changeSelected(name) {
  selected.value = name
}

function goHome() {
  router.push('/')
  selected.value = '頁面選單'
}

function toggleDark() {
  Dark.toggle()
  LocalStorage.set('dark', Dark.isActive)
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

const linksList = [
  { title: '活動申請', icon: 'article', link: '/application' },
  { title: '公告', icon: 'campaign', link: '/announcement' },
  { title: '教師資料上傳', icon: 'cloud', link: '/upload' },
  { title: '公假登錄', icon: 'event', link: '/official-leave' },
  { title: '社團銷曠', icon: 'edit', link: '/skip' },
  { title: '違規紀錄', icon: 'warning', link: '/notice' },
  { title: '社團評鑑', icon: 'star', link: '/evaluation' },
  { title: '社課重補修', icon: 'school', link: '/retakecourses' },
  { title: '關於', icon: 'info', link: '/about' },
]
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.page-btn {
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.page-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.active-page {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>
