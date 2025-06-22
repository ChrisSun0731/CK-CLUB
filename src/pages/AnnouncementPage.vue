<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card flat bordered class="q-pa-lg q-mx-auto" style="max-width: 600px; width: 100%">
      <q-card-section class="column items-center">
        <q-img
          src="../../public/icons/CKHS-LOGO.png"
          alt="cklogo"
          style="max-width: 50%; max-height: 50%"
          fit="contain"
        />
        <h4 class="text-center"><strong>社團校規公告</strong></h4>
      </q-card-section>

      <q-separator spaced />

      <q-card-section>
        <div class="q-pa-md" fit="contain">
          <q-list bordered class="rounded-borders">
            <List_L1 />
            <List_L2 />
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import List_L1 from './Announcement/Btn-L1.vue'
import List_L2 from './Announcement/Btn-L2.vue'
</script>
