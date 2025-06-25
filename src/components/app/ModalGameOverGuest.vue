<script setup lang="ts">
  import StatBlock from '@/components/app/StatBlock.vue'
  import ModalControls from '@/components/app/ModalControls.vue'
  import { useGameStore } from '@/stores/game.store'

  const gameStore = useGameStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <StatBlock
      :label="$t('youScored')"
      :value="gameStore.score"
      class="shrink-0"
    />

    <div
      class="flex-1 flex flex-col items-center justify-center text-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
    >
      <div class="text-lg font-semibold text-blue-800">
        {{ $t('guestCreateAccountHeader') }}
      </div>

      <div class="text-sm text-blue-600 max-w-xs">
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
