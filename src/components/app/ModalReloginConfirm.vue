<script setup lang="ts">
  defineProps<{
    isUpdating?: boolean
    fieldType?: 'email' | 'password' | 'both'
  }>()

  const emit = defineEmits(['cancel', 'confirm'])

  function handleUpdateConfirm() {
    emit('confirm')
  }

  function handleUpdateCancel() {
    emit('cancel')
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-slate-600">
      {{ $t('reloginExplanation0') }}
      <br />
      <br />
      {{ $t('reloginExplanation1') }}
    </p>

    <div class="flex gap-3">
      <Button
        class="flex-1"
        :disabled="isUpdating"
        @click="handleUpdateCancel"
      >
        {{ $t('cancel') }}
      </Button>

      <Button
        class="flex-1"
        :disabled="isUpdating"
        border-color="lime-600"
        border-color-hover="lime-400"
        background-color="lime-50"
        background-color-hover="lime-100"
        text-color="lime-800"
        @click="handleUpdateConfirm"
      >
        {{ isUpdating ? $t('updating') : $t('continue') }}
      </Button>
    </div>
  </div>
</template>
