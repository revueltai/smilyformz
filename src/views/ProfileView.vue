<script setup lang="ts">
  import { ref } from 'vue'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import SettingsSound from '@/components/app/SettingsSound.vue'

  const email = ref('foo')

  function handleLogout() {
    console.log('logout')
  }

  function handleDeleteAccount() {
    console.log('show modal delete account')
  }
</script>

<template>
  <Page
    back-button-to="home"
    content-classes="flex flex-col justify-between gap-6"
  >
    <HeaderUser has-edit-options />

    <form>
      <div class="mb-8">
        <Input
          v-model="email"
          label="Email"
          name="email"
          show-static-field
          class="border-b border-slate-300 pb-3 mb-3"
        />

        <Input
          v-model="email"
          label="Email"
          name="email"
          show-static-field
          class="border-b border-slate-300 pb-3 mb-3"
        />

        <Input
          v-model="email"
          label="Email"
          name="email"
          show-static-field
          class="border-b border-slate-300 pb-3 mb-3"
        />

        <Input
          v-model="email"
          label="Email"
          name="email"
          show-static-field
          class="border-b border-slate-300 pb-3"
        />
      </div>

      <SettingsSound />
    </form>

    <div class="flex flex-col gap-4">
      <Button @click="handleLogout">
        {{ $t('logout') }}
      </Button>

      <Button
        background-color="rose-50"
        background-color-hover="rose-100"
        border-color="rose-600"
        border-color-hover="rose-800"
        @click="handleDeleteAccount"
      >
        {{ $t('deleteAccount') }}
      </Button>
    </div>
  </Page>
</template>
