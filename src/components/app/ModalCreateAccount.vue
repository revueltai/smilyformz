<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { getCountriesForSelect } from '@/configs/countries'
  import { useFormValidation } from '@/composables/useFormValidation'
  import { supabase } from '@/services/Supabase.service'
  import { ToastService } from '../shared/Toast/service'

  const { validateUsername, validateEmail, validatePassword, validateConfirmPassword } =
    useFormValidation()

  const router = useRouter()
  const { t } = useI18n()

  const countryOptions = getCountriesForSelect()

  const displayName = ref('')
  const country = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const submitAttempted = ref(false)
  const isLoading = ref(false)
  const touched = ref({
    displayName: false,
    country: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const validationStates = ref({
    username: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    confirmPassword: { isValid: true, message: '' },
  })

  const isFormValid = computed(() => {
    const usernameRequired = displayName.value && displayName.value.trim() !== ''
    const countryRequired = country.value && country.value !== ''
    const emailRequired = email.value && email.value.trim() !== ''
    const passwordRequired = password.value && password.value.trim() !== ''
    const confirmPasswordRequired = confirmPassword.value && confirmPassword.value.trim() !== ''

    const usernameValid = usernameRequired ? validationStates.value.username.isValid : false
    const emailValid = emailRequired ? validationStates.value.email.isValid : false
    const passwordValid = passwordRequired ? validationStates.value.password.isValid : false
    const confirmPasswordValid = confirmPasswordRequired
      ? validationStates.value.confirmPassword.isValid
      : false

    return (
      usernameRequired &&
      usernameValid &&
      countryRequired &&
      emailRequired &&
      emailValid &&
      passwordRequired &&
      passwordValid &&
      confirmPasswordRequired &&
      confirmPasswordValid
    )
  })

  const usernameError = computed(() => {
    return shouldShowValidation('displayName') &&
      displayName.value &&
      !validationStates.value.username.isValid
      ? validationStates.value.username.message
      : ''
  })

  const usernameInvalid = computed(() => {
    return (
      shouldShowValidation('displayName') &&
      displayName.value &&
      !validationStates.value.username.isValid
    )
  })

  const emailError = computed(() => {
    return shouldShowValidation('email') && email.value && !validationStates.value.email.isValid
      ? validationStates.value.email.message
      : ''
  })

  const emailInvalid = computed(() => {
    return shouldShowValidation('email') && email.value && !validationStates.value.email.isValid
  })

  const passwordError = computed(() => {
    return shouldShowValidation('password') &&
      password.value &&
      !validationStates.value.password.isValid
      ? validationStates.value.password.message
      : ''
  })

  const passwordInvalid = computed(() => {
    return (
      shouldShowValidation('password') && password.value && !validationStates.value.password.isValid
    )
  })

  const confirmPasswordError = computed(() => {
    return shouldShowValidation('confirmPassword') &&
      confirmPassword.value &&
      !validationStates.value.confirmPassword.isValid
      ? validationStates.value.confirmPassword.message
      : ''
  })

  const confirmPasswordInvalid = computed(() => {
    return (
      shouldShowValidation('confirmPassword') &&
      confirmPassword.value &&
      !validationStates.value.confirmPassword.isValid
    )
  })

  function shouldShowValidation(fieldName: keyof typeof touched.value) {
    return touched.value[fieldName] || submitAttempted.value
  }

  async function handleFieldBlur(fieldName: keyof typeof touched.value) {
    touched.value[fieldName] = true

    const validationMap = {
      displayName: async () => {
        if (displayName.value) {
          validationStates.value.username = await validateUsername(displayName.value)
        }
      },
      email: async () => {
        if (email.value) {
          validationStates.value.email = await validateEmail(email.value)
        }
      },
      password: () => {
        if (password.value) {
          validationStates.value.password = validatePassword(password.value)
        }
      },
      confirmPassword: () => {
        if (confirmPassword.value) {
          validationStates.value.confirmPassword = validateConfirmPassword(
            confirmPassword.value,
            password.value,
          )
        }
      },
    }

    const validator = validationMap[fieldName]
    if (validator) {
      await validator()
    }
  }

  async function handleSubmit() {
    submitAttempted.value = true

    if (!isFormValid.value) {
      return
    }

    isLoading.value = true

    try {
      const { error } = await supabase.signUp({
        display_name: displayName.value.trim(),
        email: email.value.trim(),
        password: password.value,
        country: country.value,
      })

      if (error) {
        ToastService.emitToast(t('accountCreationFailed'), 'error')
        throw error
      }

      ToastService.emitToast(t('accountCreated'), 'success')
      router.push('/home')
    } catch (error) {
      ToastService.emitToast(t('accountCreationFailed'), 'error')
    } finally {
      isLoading.value = false
    }
  }

  watch(
    [displayName, email, password, confirmPassword],
    async ([newDisplayName, newEmail, newPassword, newConfirmPassword]) => {
      // Validate displayName/username
      if (newDisplayName && shouldShowValidation('displayName')) {
        validationStates.value.username = await validateUsername(newDisplayName)
      }

      // Validate email
      if (newEmail && shouldShowValidation('email')) {
        validationStates.value.email = await validateEmail(newEmail)
      }

      // Validate password
      if (newPassword && shouldShowValidation('password')) {
        validationStates.value.password = validatePassword(newPassword)
      }

      // Validate confirm password
      if (newConfirmPassword && shouldShowValidation('confirmPassword')) {
        validationStates.value.confirmPassword = validateConfirmPassword(
          newConfirmPassword,
          newPassword,
        )
      }
    },
  )
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="displayName"
        name="displayName"
        :label="$t('username')"
        :placeholder="$t('enterUsername')"
        :show-edit-icon="false"
        show-input-field
        required
        :externalError="usernameError"
        :forceInvalid="usernameInvalid"
        @blur="handleFieldBlur('displayName')"
      />

      <Select
        v-model="country"
        :label="$t('country')"
        :options="countryOptions"
        :placeholder="$t('selectCountry')"
        :show-edit-icon="false"
        name="country"
        show-select-field
        required
        @blur="handleFieldBlur('country')"
      />

      <Input
        v-model="email"
        type="email"
        name="email"
        :label="$t('email')"
        :placeholder="$t('enterEmail')"
        :show-edit-icon="false"
        show-input-field
        required
        :externalError="emailError"
        :forceInvalid="emailInvalid"
        @blur="handleFieldBlur('email')"
      />

      <Input
        v-model="password"
        type="password"
        name="password"
        :label="$t('password')"
        :placeholder="$t('enterPassword')"
        :show-edit-icon="false"
        show-input-field
        required
        :externalError="passwordError"
        :forceInvalid="passwordInvalid"
        @blur="handleFieldBlur('password')"
      />

      <Input
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        :label="$t('confirmPassword')"
        :placeholder="$t('enterConfirmPassword')"
        :externalError="confirmPasswordError"
        :forceInvalid="confirmPasswordInvalid"
        :show-edit-icon="false"
        show-input-field
        required
        @blur="handleFieldBlur('confirmPassword')"
      />
    </div>

    <Button
      :disabled="!isFormValid || isLoading"
      type="submit"
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-50"
      background-color-hover="lime-100"
      text-color="lime-800"
      class="w-full"
    >
      {{ isLoading ? $t('creatingAccount') : $t('createAccount') }}
    </Button>
  </form>
</template>
