<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { MODALS } from '@/configs/constants'
  import { getCountriesForSelect } from '@/configs/countries'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'
  import { ToastService } from '@/components/shared/Toast/service'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import ModalAvatar from '@/components/app/ModalAvatar.vue'
  import ModalDeleteAccount from '@/components/app/ModalDeleteAccount.vue'

  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()
  const modalStore = useModalStore()
  const countries = getCountriesForSelect()

  const password = ref('')
  const isLoading = ref(false)
  const isDeletingAccount = ref(false)
  const showDeleteConfirmation = ref(false)

  async function handleLogout() {
    try {
      await userStore.signOut()
      ToastService.emitToast(t('logoutSuccess'), 'success')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      ToastService.emitToast(t('logoutFailed'), 'error')
    }
  }

  function handleDeleteAccount() {
    showDeleteConfirmation.value = true
    modalStore.openModal(MODALS.DELETE_ACCOUNT_CONFIRM)
  }

  async function confirmDeleteAccount() {
    isDeletingAccount.value = true

    try {
      await userStore.deleteAccount()
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

  async function handleUpdateDisplayName(newDisplayName: string) {
    if (newDisplayName && newDisplayName.trim() && newDisplayName !== userStore.displayName) {
      try {
        await userStore.updateDisplayName(newDisplayName.trim())
        ToastService.emitToast(t('displayNameUpdated'), 'success')
      } catch (error) {
        console.error('Error updating display name:', error)
        ToastService.emitToast(t('displayNameUpdateFailed'), 'error')
      }
    }
  }

  function handleEditAvatar() {
    modalStore.openModal(MODALS.AVATAR)
  }
</script>

<template>
  <Page
    back-button-to="home"
    content-classes="flex flex-col justify-between gap-6"
  >
    <HeaderUser
      :display-name="userStore.displayName"
      :has-edit-options="true"
      :avatar-shape="userStore.profile?.avatar.shape"
      :avatar-shape-color="userStore.profile?.avatar.shape_color"
      :avatar-background-color="userStore.profile?.avatar.background_color"
      :avatar-expression="userStore.profile?.avatar.expression"
      @update:display-name="handleUpdateDisplayName"
      @edit-avatar="handleEditAvatar"
    />

    <form>
      <div class="mb-8">
        <Input
          v-model="userStore.email"
          :label="$t('email')"
          :placeholder="$t('enterEmail')"
          name="email"
          type="email"
          show-static-field
          required
          class="border-b border-slate-300 pb-3 mb-3"
        />

        <Select
          v-model="userStore.country"
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

    <Modal
      :name="MODALS.DELETE_ACCOUNT_CONFIRM"
      :heading="$t('deleteAccountConfirmation')"
      @close="cancelDeleteAccount"
    >
      <ModalDeleteAccount
        :is-deleting="isDeletingAccount"
        @cancel="cancelDeleteAccount"
        @confirm="confirmDeleteAccount"
      />
    </Modal>
  </Page>
</template>
