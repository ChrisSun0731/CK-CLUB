<template>
  <div class="row justify-center">
    <img
      src="../../public/icons/application.png"
      alt="step"
      style="max-width: 70%; height: auto; display: block"
    />
  </div>
  <div class="row justify-center">
    <img
      src="../../public/icons/bar.png"
      alt="list"
      style="max-width: 70%; height: auto; display: block"
    />
  </div>

  <div class="q-pa-md" fit="contain">
    <q-list bordered class="rounded-borders">
      <List_A />
      <List_B />
      <List_C />
      <List_D />
      <List_E />
      <List_F />
      <List_G />
      <List_H />
      <List_O />
      <List_P />
    </q-list>
  </div>
</template>

<script setup>
import List_A from './Application/Btn-A.vue'
import List_B from './Application/Btn-B.vue'
import List_C from './Application/Btn-C.vue'
import List_D from './Application/Btn-D.vue'
import List_E from './Application/Btn-E.vue'
import List_F from './Application/Btn-F.vue'
import List_G from './Application/Btn-G.vue'
import List_H from './Application/Btn-H.vue'
import List_O from './Application/Btn-others.vue'
import List_P from './Application/ProposalPage.vue'
</script>
