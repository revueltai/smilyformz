<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '@/stores/user.store'
  import { ToastService } from '../shared/Toast/service'

  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()

  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const submitAttempted = ref(false)

  const isFormValid = computed(() => {
    const emailRequired = email.value && email.value.trim() !== ''
    const passwordRequired = password.value && password.value.trim() !== ''

    return emailRequired && passwordRequired
  })

  async function handleSubmit() {
    submitAttempted.value = true

    if (!isFormValid.value) {
      return
    }

    try {
      await userStore.signIn(email.value.trim(), password.value, rememberMe.value)
      ToastService.emitToast(t('loginSuccess'), 'success')
      router.push('/home')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          ToastService.emitToast(t('invalidCredentials'), 'error')
          return
        }

        if (error.message.includes('Email not confirmed')) {
          ToastService.emitToast(t('emailNotConfirmed'), 'error')
          return
        }
      }

      ToastService.emitToast(t('loginFailed'), 'error')
    }
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="email"
        type="email"
        name="email"
        :label="$t('email')"
        :placeholder="$t('enterEmail')"
        :show-edit-icon="false"
        required
        show-input-field
      />

      <Input
        v-model="password"
        type="password"
        name="password"
        :label="$t('password')"
        :placeholder="$t('enterPassword')"
        :show-edit-icon="false"
        required
        show-input-field
      />

      <Switch
        v-model="rememberMe"
        :label="$t('rememberMe')"
        name="rememberMe"
        direction="row"
      />
    </div>

    <Button
      :disabled="submitAttempted && !isFormValid"
      type="submit"
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-50"
      background-color-hover="lime-100"
      class="w-full"
    >
      {{ submitAttempted && !isFormValid ? $t('loggingIn') : $t('login') }}
    </Button>
  </form>
</template>
