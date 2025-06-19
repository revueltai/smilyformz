<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { MODALS } from '@/configs/constants'
  import { getCountriesForSelect } from '@/configs/countries'
  import { supabase } from '@/services/Supabase.service'
  import { ToastService } from '@/components/shared/Toast/service'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import ModalAvatar from '@/components/app/ModalAvatar.vue'

  const router = useRouter()
  const { t } = useI18n()
  const countries = getCountriesForSelect()

  const email = ref('foo@foo.com')
  const country = ref('en')
  const password = ref('abc123')
  const isLoading = ref(false)
  const isDeletingAccount = ref(false)
  const showDeleteConfirmation = ref(false)

  async function handleLogout() {
    isLoading.value = true

    try {
      await supabase.signOut()
      ToastService.emitToast(t('logoutSuccess'), 'success')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      ToastService.emitToast(t('logoutFailed'), 'error')
    } finally {
      isLoading.value = false
    }
  }

  function handleDeleteAccount() {
    showDeleteConfirmation.value = true
  }

  async function confirmDeleteAccount() {
    isDeletingAccount.value = true

    try {
      await supabase.deleteAccount()
      ToastService.emitToast(t('accountDeleted'), 'success')
      router.push('/')
    } catch (error) {
      console.error('Delete account error:', error)
      ToastService.emitToast(t('accountDeletionFailed'), 'error')
    } finally {
      isDeletingAccount.value = false
      showDeleteConfirmation.value = false
    }
  }

  function cancelDeleteAccount() {
    showDeleteConfirmation.value = false
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
      <Button
        :disabled="isLoading"
        @click="handleLogout"
      >
        {{ isLoading ? $t('loggingOut') : $t('logout') }}
      </Button>

      <Button
        :disabled="isDeletingAccount"
        background-color="rose-50"
        background-color-hover="rose-100"
        border-color="rose-600"
        border-color-hover="rose-800"
        text-color="rose-800"
        @click="handleDeleteAccount"
      >
        {{ isDeletingAccount ? $t('deletingAccount') : $t('deleteAccount') }}
      </Button>
    </div>

    <Modal
      :name="MODALS.AVATAR"
      :heading="$t('createAvatar')"
    >
      <ModalAvatar />
    </Modal>

    <!-- Delete Account Confirmation Modal -->
    <Modal
      v-if="showDeleteConfirmation"
      :name="'deleteAccountConfirmation'"
      :heading="$t('deleteAccountConfirmation')"
    >
      <div class="flex flex-col gap-4">
        <p class="text-slate-600">{{ $t('deleteAccountWarning') }}</p>

        <div class="flex gap-3">
          <Button
            class="flex-1"
            @click="cancelDeleteAccount"
          >
            {{ $t('cancel') }}
          </Button>

          <Button
            class="flex-1"
            :disabled="isDeletingAccount"
            background-color="rose-50"
            background-color-hover="rose-100"
            border-color="rose-600"
            border-color-hover="rose-800"
            text-color="rose-800"
            @click="confirmDeleteAccount"
          >
            {{ isDeletingAccount ? $t('deletingAccount') : $t('confirmDelete') }}
          </Button>
        </div>
      </div>
    </Modal>
  </Page>
</template>
