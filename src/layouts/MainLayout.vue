<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="bg-primary text-white no-print" elevated height-hint="98">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" aria-label="Menu" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/icons/CKHS-LOGO.png" style="width: 40px; height: 40px" />
          </q-avatar>
          <span v-if="$q.screen.gt.xs" class="q-pl-sm">建中社團管理平台</span>
          <span v-else class="q-pl-sm">社團管理平台</span>
        </q-toolbar-title>

        <q-space />
        <q-btn flat dense :icon="Dark.isActive ? 'dark_mode' : 'nights_stay'" @click="toggleDark" />
        <q-btn flat dense icon="fullscreen" @click="toggleFullscreen" />
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" bordered show-if-above side="left">
      <q-list class="menu-list fit column">
        <q-item-label header class="bg-primary text-white text-bold">選單</q-item-label>

        <q-item
          v-for="link in linksList"
          :key="link.title"
          :to="link.link"
          :active="selected === link.title"
          @click="changeSelected(link.title)"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Dark, LocalStorage } from 'quasar'

const leftDrawerOpen = ref(true)
const selected = ref('首頁')

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function changeSelected(name) {
  selected.value = name
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
  { title: '首頁', icon: 'home', link: '/' },
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
.q-drawer .q-item {
  transition: background-color 0.2s;
}
.q-drawer .q-item:hover {
  background-color: #e3f2fd;
}
.q-drawer .q-item--active {
  background-color: #bbdefb;
  color: #0d47a1;
}
</style>
