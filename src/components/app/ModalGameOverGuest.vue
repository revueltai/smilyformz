<script setup lang="ts">
  import ModalControls from '@/components/app/ModalControls.vue'
  import GameOverScoreSign from '@/components/app/GameOverScoreSign.vue'

  const emit = defineEmits<{
    (e: 'createAccount'): void
  }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <GameOverScoreSign :hide-share-button="true" />

    <div
      class="flex flex-col gap-2 items-center p-6 w-full text-lg rounded-lg bg-sky-50 border border-sky-200 text-center"
    >
      <h2 class="text-base font-semibold text-blue-800 leading-tight">
        {{ $t('guestCreateAccountHeader') }}
      </h2>

      <div class="text-xs text-blue-600 max-w-xs">
        {{ $t('guestCreateAccountDescription') }}
      </div>
    </div>

    <ModalControls
      :has-home-button="false"
      class="shrink-0"
      :cta-text="$t('createAccount')"
      @click="$emit('createAccount')"
    />
  </div>
</template>
