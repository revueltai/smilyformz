<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { MODALS } from '@/configs/constants'
  import { getCountriesForSelect } from '@/configs/countries'
  import { getLanguagesForSelect } from '@/configs/languages'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'
  import { ToastService } from '@/components/shared/Toast/service'
  import Page from '@/components/app/Page.vue'
  import HeaderUser from '@/components/app/HeaderUser.vue'
  import SettingsSound from '@/components/app/SettingsSound.vue'
  import ModalAvatar from '@/components/app/ModalAvatar.vue'
  import ModalDeleteAccount from '@/components/app/ModalDeleteAccount.vue'
  import ModalReloginConfirm from '@/components/app/ModalReloginConfirm.vue'
  import EmailConfirmationWarning from '@/components/app/EmailConfirmationWarning.vue'
  import ModalCredits from '@/components/app/ModalCredits.vue'
  import { useFormValidation } from '@/composables/useFormValidation'
  import type { ValidationState } from '@/composables/useFormValidation'
  import { usePWA } from '@/composables/usePwa'
  import { useGameStore } from '@/stores/game.store'

  const router = useRouter()
  const { t } = useI18n()
  const gameStore = useGameStore()
  const { validatePassword, validateEmail } = useFormValidation()
  const isPWA = usePWA()

  const userStore = useUserStore()
  const modalStore = useModalStore()
  const countries = getCountriesForSelect()
  const languages = getLanguagesForSelect()

  const password = ref('')
  const email = ref(userStore.email)
  const isLoading = ref(false)
  const isDeletingAccount = ref(false)
  const isUpdatingCredentials = ref(false)
  const showDeleteConfirmation = ref(false)
  const currentCountry = ref(userStore.country)
  const currentLanguage = ref(userStore.language)
  const headerUserKey = ref(0)
  const pendingEmailUpdate = ref('')
  const pendingPasswordUpdate = ref('')
  const pendingFieldType = ref<'email' | 'password' | 'both'>('email')

  const touched = ref({
    email: false,
    password: false,
  })

  const validationStates = ref<ValidationState>({
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
  })

  const emailError = computed(() =>
    shouldShowError('email') ? validationStates.value.email.message : '',
  )

  const passwordError = computed(() =>
    shouldShowError('password') ? validationStates.value.password.message : '',
  )

  const emailInvalid = computed(() => shouldShowError('email'))

  const passwordInvalid = computed(() => shouldShowError('password'))

  function shouldShowValidation(fieldName: keyof typeof touched.value) {
    return touched.value[fieldName]
  }

  function shouldShowError(fieldName: keyof typeof touched.value) {
    return (
      shouldShowValidation(fieldName) &&
      (fieldName === 'email' ? email.value : password.value) &&
      !validationStates.value[fieldName].isValid
    )
  }

  function forceUpdateHeaderUserComponent() {
    headerUserKey.value++
  }

  function revertDisplayName(originalDisplayName: string) {
    if (userStore.profile) {
      userStore.profile.display_name = originalDisplayName
    }

    forceUpdateHeaderUserComponent()
  }

  function handleClickButtonCredits() {
    modalStore.openModal(MODALS.CREDITS)
  }

  function handleCancelDeleteAccount() {
    showDeleteConfirmation.value = false
    modalStore.closeModal()
  }

  function handleEditAvatar() {
    modalStore.openModal(MODALS.AVATAR)
  }

  function handleDeleteAccount() {
    showDeleteConfirmation.value = true
    modalStore.openModal(MODALS.DELETE_ACCOUNT_CONFIRM)
  }

  async function handleFieldBlur(fieldName: keyof typeof touched.value) {
    touched.value[fieldName] = true

    const validationMap = {
      email: async () => {
        if (email.value && email.value.trim()) {
          const shouldCheckUnique = email.value !== userStore.email
          validationStates.value.email = await validateEmail(email.value, shouldCheckUnique)
        }
      },
      password: () => {
        if (password.value && password.value.trim()) {
          validationStates.value.password = validatePassword(password.value)
        }
      },
    }

    const validator = validationMap[fieldName]

    if (validator) {
      await validator()
    }
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

  async function handleUpdateDisplayName(newDisplayName: string) {
    if (newDisplayName && newDisplayName.trim() && newDisplayName !== userStore.displayName) {
      const originalDisplayName = userStore.displayName

      try {
        const { validateUsername } = useFormValidation()
        const validation = await validateUsername(newDisplayName.trim())

        if (!validation.isValid) {
          ToastService.emitToast(t(validation.message), 'error')
          revertDisplayName(originalDisplayName)
          return
        }

        await userStore.updateDisplayName(newDisplayName.trim())
        ToastService.emitToast(t('displayNameUpdated'), 'success')
      } catch (error) {
        console.error('Error updating display name:', error)
        ToastService.emitToast(t('displayNameUpdateFailed'), 'error')
        revertDisplayName(originalDisplayName)
      }
    }
  }

  async function handleUpdateLanguage(newLanguage: string) {
    if (newLanguage && newLanguage !== userStore.language) {
      try {
        await userStore.updateUserSettings({ language: newLanguage })
        ToastService.emitToast(t('languageUpdated'), 'success')
      } catch (error) {
        console.error('Error updating language:', error)
        ToastService.emitToast(t('languageUpdateFailed'), 'error')
      }
    }
  }

  async function handleUpdateCountry(newCountry: string) {
    if (newCountry && newCountry !== userStore.country) {
      try {
        await userStore.updateUserSettings({ country: newCountry })
        ToastService.emitToast(t('countryUpdated'), 'success')
      } catch (error) {
        console.error('Error updating country:', error)
        ToastService.emitToast(t('countryUpdateFailed'), 'error')
        currentCountry.value = userStore.country
      }
    }
  }

  function handlePasswordChange(newPassword: string) {
    if (newPassword && newPassword.trim()) {
      touched.value.password = true
      const validation = validatePassword(newPassword)
      validationStates.value.password = validation

      if (!validation.isValid) {
        return
      }

      pendingPasswordUpdate.value = newPassword
      pendingFieldType.value = 'password'
      modalStore.openModal(MODALS.RELOGIN_CONFIRM)
    }
  }

  function handleCancelRelogin() {
    modalStore.closeModal()
    email.value = userStore.email
    password.value = ''
    pendingEmailUpdate.value = ''
    pendingPasswordUpdate.value = ''
    touched.value.email = false
    touched.value.password = false
    validationStates.value.email = { isValid: true, message: '' }
    validationStates.value.password = { isValid: true, message: '' }
  }

  async function handleEmailChange(newEmail: string) {
    const trimmedEmail = newEmail.trim()

    if (trimmedEmail && trimmedEmail !== userStore.email) {
      touched.value.email = true
      const shouldCheckUnique = trimmedEmail !== userStore.email
      const validation = await validateEmail(trimmedEmail, shouldCheckUnique)
      validationStates.value.email = validation

      if (!validation.isValid) {
        return
      }

      pendingEmailUpdate.value = trimmedEmail
      pendingFieldType.value = 'email'
      modalStore.openModal(MODALS.RELOGIN_CONFIRM)
    }
  }

  async function handleConfirmRelogin() {
    isUpdatingCredentials.value = true

    try {
      if (pendingEmailUpdate.value) {
        await userStore.updateEmail(pendingEmailUpdate.value)
      }

      if (pendingPasswordUpdate.value) {
        await userStore.updatePassword(pendingPasswordUpdate.value)
      }

      if (pendingEmailUpdate.value && pendingPasswordUpdate.value) {
        ToastService.emitToast(t('credentialsUpdated'), 'success')
      } else if (pendingEmailUpdate.value) {
        ToastService.emitToast(t('emailUpdated'), 'success')
      } else if (pendingPasswordUpdate.value) {
        ToastService.emitToast(t('passwordUpdated'), 'success')
      }

      modalStore.closeModal()
      await handleLogout()
    } catch (error) {
      console.error('Error updating credentials:', error)
      ToastService.emitToast(t('credentialsUpdateFailed'), 'error')
    } finally {
      isUpdatingCredentials.value = false
      pendingEmailUpdate.value = ''
      pendingPasswordUpdate.value = ''
    }
  }

  async function handleLogout() {
    try {
      gameStore.setLeagueLevel()
      modalStore.closeModal()
      await userStore.signOut()
      ToastService.emitToast(t('logoutSuccess'), 'success')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      ToastService.emitToast(t('logoutFailed'), 'error')
    }
  }

  watch([email, password], async ([newEmail, newPassword]) => {
    if (newEmail && newEmail.trim() && shouldShowValidation('email')) {
      const shouldCheckUnique = newEmail !== userStore.email
      validationStates.value.email = await validateEmail(newEmail, shouldCheckUnique)
    }

    if (newPassword && newPassword.trim() && shouldShowValidation('password')) {
      validationStates.value.password = validatePassword(newPassword)
    }
  })

  watch(
    () => userStore.country,
    (newCountry) => (currentCountry.value = newCountry),
    { immediate: true },
  )

  watch(
    () => userStore.email,
    (newEmail) => (email.value = newEmail),
    { immediate: true },
  )
</script>

<template>
  <Page
    back-button-to="home"
    content-classes="flex flex-col justify-between gap-6"
  >
    <HeaderUser
      :key="headerUserKey"
      :display-name="userStore.displayName"
      :has-edit-options="true"
      :avatar-shape="userStore.profile?.avatar.shape"
      :avatar-shape-color="userStore.profile?.avatar.shape_color"
      :avatar-background-color="userStore.profile?.avatar.background_color"
      :avatar-expression="userStore.profile?.avatar.expression"
      @update:display-name="handleUpdateDisplayName"
      @edit-avatar="handleEditAvatar"
    />

    <EmailConfirmationWarning :is-confirmed="userStore.isEmailConfirmed" />

    <form>
      <div class="mb-4">
        <Select
          v-model="currentCountry"
          :label="$t('country')"
          :options="countries"
          :placeholder="$t('selectCountry')"
          name="country"
          show-static-field
          required
          class="border-b border-slate-300 pb-3 mb-3"
          @update="handleUpdateCountry"
        />

        <Input
          v-model="email"
          :label="$t('email')"
          :placeholder="$t('enterEmail')"
          name="email"
          type="email"
          show-static-field
          class="border-b border-slate-300 pb-3 mb-3"
          :externalError="emailError"
          :forceInvalid="emailInvalid"
          @update="handleEmailChange"
          @blur="handleFieldBlur('email')"
        />

        <Input
          v-model="password"
          :label="$t('password')"
          name="password"
          type="password"
          :placeholder="$t('enterNewPassword')"
          show-static-field
          class="mb-4"
          :externalError="passwordError"
          :forceInvalid="passwordInvalid"
          @update="handlePasswordChange"
          @blur="handleFieldBlur('password')"
        />

        <div class="p-4 bg-slate-100 rounded-lg">
          <Select
            v-model="currentLanguage"
            :label="$t('appLanguage')"
            :options="languages"
            :placeholder="$t('selectLanguage')"
            name="language"
            show-static-field
            required
            @update="handleUpdateLanguage"
          />
        </div>
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

      <Button
        :class="isPWA ? 'pb-4' : 'pb-8'"
        size="xs"
        type="link"
        text-color="slate-500 mx-auto"
        @click="handleClickButtonCredits"
      >
        {{ $t('credits') }}
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
      @close="handleCancelDeleteAccount"
    >
      <ModalDeleteAccount
        :is-deleting="isDeletingAccount"
        @cancel="handleCancelDeleteAccount"
        @confirm="confirmDeleteAccount"
      />
    </Modal>

    <Modal
      :name="MODALS.RELOGIN_CONFIRM"
      :heading="$t('reloginConfirmation')"
      @close="handleCancelRelogin"
    >
      <ModalReloginConfirm
        :is-updating="isUpdatingCredentials"
        @cancel="handleCancelRelogin"
        @confirm="handleConfirmRelogin"
      />
    </Modal>

    <Modal
      :name="MODALS.CREDITS"
      :heading="$t('designedAndDevelopedBy')"
    >
      <ModalCredits />
    </Modal>
  </Page>
</template>
