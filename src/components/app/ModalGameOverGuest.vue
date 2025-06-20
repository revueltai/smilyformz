<script setup lang="ts">
  import StatBlock from '@/components/app/StatBlock.vue'
  import ModalControls from '@/components/app/ModalControls.vue'
  import { useGameStore } from '@/stores/game.store'

  const gameStore = useGameStore()
</script>

<template>
  <div class="flex flex-col gap-4 h-[60vh]">
    <StatBlock
      :label="$t('youScored')"
      :value="`${gameStore.score} ${$t('points')}`"
      variant="score"
      class="shrink-0"
    />

    <div class="flex-1 flex flex-col items-center justify-center text-center gap-4 p-4">
      <div class="text-lg font-semibold text-gray-800">
        {{ $t('createAccountToSave') }}
      </div>
      <div class="text-sm text-gray-600 max-w-xs">
        {{ $t('createAccountBenefits') }}
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
