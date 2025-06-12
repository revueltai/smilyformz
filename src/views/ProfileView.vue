<script setup lang="ts">
  import { ref } from 'vue'
  import { MODALS } from '@/configs/constants'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import ModalAvatar from '@/components/app/ModalAvatar.vue'

  const countries = ref([
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'es',
      label: 'Spanish',
    },
  ])

  const email = ref('foo@foo.com')
  const country = ref('en')
  const password = ref('abc123')

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
          :label="$t('email')"
          :placeholder="$t('enterEmail')"
          name="email"
          type="email"
          show-static-field
          required
          class="border-b border-slate-300 pb-3 mb-3"
        />

        <Select
          v-model="country"
          :label="$t('country')"
          :options="countries"
          :placeholder="$t('selectCountry')"
          name="country"
          show-static-field
          required
          class="border-b border-slate-300 pb-3 mb-3"
        />

        <Input
          v-model="password"
          :label="$t('password')"
          name="password"
          type="password"
          :placeholder="$t('enterPassword')"
          show-static-field
          required
          class="border-b border-slate-300 pb-3 mb-3"
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
        text-color="rose-800"
        @click="handleDeleteAccount"
      >
        {{ $t('deleteAccount') }}
      </Button>
    </div>

    <Modal
      :name="MODALS.AVATAR"
      :heading="$t('createAvatar')"
    >
      <ModalAvatar />
    </Modal>
  </Page>
</template>
