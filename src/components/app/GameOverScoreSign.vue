<script setup lang="ts">
  import NumberCounter from '@/components/shared/NumberCounter/index.vue'
  import { useGameStore } from '@/stores/game.store'
  import { useModalStore } from '@/stores/modal.store'
  import { MODALS } from '@/configs/constants'

  defineProps<{
    hideShareButton?: boolean
  }>()

  const gameStore = useGameStore()
  const modalStore = useModalStore()

  function handleShareScore() {
    modalStore.openModal(MODALS.SHARE)
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <p class="text-sm">
      {{ $t(gameStore.score === 0 ? 'gameOverScoreMessage1' : 'gameOverScoreMessage2') }}
    </p>

    <div class="relative w-full">
      <div
        class="bg-gradient-to-b from-sky-100 to-sky-300 w-full rounded-sm px-8 py-6 border border-sky-300"
      >
        <p class="text-xs mb-2 uppercase font-bold text-sky-600">
          {{ $t('youScored') }}
        </p>

        <div class="flex items-center justify-center gap-2">
          <NumberCounter
            :value="gameStore.score"
            :duration="1500"
            :delay="300"
            easing="ease-out"
            class="text-6xl font-black text-sky-800 tracking-tight"
          />

          <span class="text-2xl font-bold text-sky-600 mt-2">
            {{ $t('points') }}
          </span>
        </div>
      </div>

      <div
        class="absolute -top-2 -left-2 w-6 h-6 border-4 border-white bg-green-400 rounded-full"
      />
      <div
        class="absolute -top-2 -right-2 w-6 h-6 border-4 border-white bg-blue-400 rounded-full"
      />
      <div
        class="absolute -bottom-2 -left-2 w-6 h-6 border-4 border-white bg-pink-400 rounded-full"
      />
      <div
        class="absolute -bottom-2 -right-2 w-6 h-6 border-4 border-white bg-purple-400 rounded-full"
      />
    </div>

    <div
      v-if="!hideShareButton && gameStore.score > 0"
      class="flex flex-col gap-2 items-center p-6 w-full text-lg rounded-lg bg-sky-50 border border-sky-200 text-center"
    >
      <p class="text-sm">
        {{ $t('shareWithFriends') }}
      </p>

      <Button
        background-color="blue-500"
        border-color="blue-700"
        background-color-hover="blue-500"
        text-color="white"
        @click="handleShareScore"
      >
        <Icon
          name="share-2"
          size="sm"
          color="white"
        />

        {{ $t('shareYourScore') }}
      </Button>
    </div>
  </div>
</template>
