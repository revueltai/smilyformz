<script setup lang="ts">
  import { ref } from 'vue'

  const email = ref('')
  const emailError = ref('')
  const password = ref('')
  const passwordError = ref('')
  const rememberMe = ref(false)

  function handleSubmit() {
    console.log('submit')
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
      type="submit"
      border-color="lime-600"
      border-color-hover="lime-400"
      background-color="lime-50"
      background-color-hover="lime-100"
      class="w-full"
    >
      {{ $t('login') }}
    </Button>
  </form>
</template>
