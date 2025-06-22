<template>
  <q-page class="q-pa-md flex column items-center">
    <q-card flat bordered class="q-pa-lg q-mx-auto" style="max-width: 600px; width: 100%">
      <q-card-section class="column items-center">
        <q-img
          src="../../public/icons/CKHS-LOGO.png"
          alt="cklogo"
          style="max-width: 50%; max-height: 50%"
          fit="contain"
        />
        <br />
        <h4 class="text-center"><strong>建中社團管理平台</strong></h4>
        <br />
        <q-btn
          class="text-center"
          href="https://sites.google.com/gl.ck.tp.edu.tw/ckclub/%E6%B4%BB%E5%8B%95%E7%94%B3%E8%AB%8B%E6%B5%81%E7%A8%8B?authuser=0"
          style="color: white; background-color: #1c2087"
          target="_blank"
        >
          點選可前往原平台
        </q-btn>
      </q-card-section>

      <q-separator spaced />

      <q-card-section>
        <div class="text-h6 text-center q-mb-md">
          <q-img
            src="../../public/icons/mailbox.jpg"
            alt="mailbox"
            style="max-width: 10%; max-height: 10%"
            fit="contain"
          />
          <br />
          <strong>Contact Us</strong>
        </div>

        <q-list dense bordered class="rounded-borders">
          <q-item>
            <q-item-section>
              <q-item-label class="text-center">
                1. 社活組信箱：
                <strong>stud21@gl.ck.tp.edu.tw</strong>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item>
            <q-item-section>
              <q-item-label class="text-center">
                2. 官方 Line@ ID：
                <strong>@893etymk</strong>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
//
</script>
