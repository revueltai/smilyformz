<script setup lang="ts">
  import { ref } from 'vue'

  const username = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')

  function handleSubmit() {
    console.log(username.value, email.value, password.value, confirmPassword.value)
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-8 flex flex-col gap-4">
      <Input
        v-model="username"
        name="username"
        :label="$t('username')"
        :placeholder="$t('enterUsername')"
        :show-edit-icon="false"
        required
        show-input-field
      />

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

      <Input
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        :label="$t('confirmPassword')"
        :placeholder="$t('enterConfirmPassword')"
        :show-edit-icon="false"
        required
        show-input-field
      />
    </div>

    <Button
      type="submit"
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-50"
      background-color-hover="lime-100"
      text-color="lime-800"
      class="w-full"
    >
      {{ $t('createAccount') }}
    </Button>
  </form>
</template>
