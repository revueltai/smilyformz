<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const emit = defineEmits(['cancel', 'confirm'])

  const props = defineProps<{
    isDeleting?: boolean
  }>()

  function confirmDeleteAccount() {
    emit('confirm')
  }

  function cancelDeleteAccount() {
    emit('cancel')
  }
</script>

<template>
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
        :disabled="isDeleting"
        background-color="rose-50"
        background-color-hover="rose-100"
        border-color="rose-600"
        border-color-hover="rose-800"
        text-color="rose-800"
        @click="confirmDeleteAccount"
      >
        {{ isDeleting ? $t('deletingAccount') : $t('delete') }}
      </Button>
    </div>
  </div>
</template>
