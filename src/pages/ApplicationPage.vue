<template>
  <img
    src="../../public/icons/application.png"
    alt="step"
    style="max-width: 100%; max-height: 100%"
    fit="contain"
  />
  <img
    src="../../public/icons/bar.png"
    alt="list"
    style="max-width: 100%; max-height: 100%"
    fit="contain"
  />
  <div class="q-pa-md" fit="contain">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        icon="list"
        label="A：活動登錄表單"
        caption="無論校內外活動，請務必在跑紙本流程前登錄活動"
        default
      >
        <q-expansion-item
          :header-inset-level="1"
          expand-separator
          icon="receipt"
          label="Receipts"
          default-opened
        >
          <q-expansion-item
            switch-toggle-side
            dense-toggle
            label="Today"
            :header-inset-level="1"
            :content-inset-level="2"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
                architecto suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            switch-toggle-side
            dense-toggle
            label="Yesterday"
            :header-inset-level="1"
            :content-inset-level="2"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
                architecto suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item
          :header-inset-level="1"
          :content-inset-level="1"
          expand-separator
          icon="schedule"
          label="Postponed"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
              eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
              architecto suscipit iste eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-expansion-item>

      <q-expansion-item
        :content-inset-level="0.5"
        expand-separator
        icon="mail"
        label="Inbox"
        caption="5 unread emails"
        default-opened
      >
        <q-expansion-item
          expand-separator
          :content-inset-level="0.5"
          icon="receipt"
          label="Receipts"
        >
          <q-expansion-item label="Today" :content-inset-level="0.5">
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
                architecto suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item label="Yesterday" :content-inset-level="0.5">
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
                eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
                architecto suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-expansion-item>

        <q-expansion-item
          :content-inset-level="0.5"
          expand-separator
          icon="schedule"
          label="Postponed"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit
              eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores
              architecto suscipit iste eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
//
</script>
