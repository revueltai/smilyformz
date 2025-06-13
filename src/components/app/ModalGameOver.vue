<script setup lang="ts">
  import StatBlock from '@/components/app/StatBlock.vue'
  import ModalControls from '@/components/app/ModalControls.vue'
  import RankingList from '@/components/app/RankingList.vue'
  import { useRouter } from 'vue-router'
  import { mockRankings } from '@/configs/mocks'

  const router = useRouter()

  function handleShareScore() {
    console.log('share')
  }

  function handleHome() {
    router.push('/home')
  }

  function handlePlayAgain() {
    console.log('play again')
  }
</script>

<template>
  <div class="flex flex-col gap-4 h-[60vh]">
    <StatBlock
      :label="$t('youScored')"
      value="2000 Pts"
      variant="score"
      class="shrink-0"
      @click="handleShareScore"
    />

    <RankingList :list="mockRankings" />

    <ModalControls
      class="shrink-0"
      :cta-text="$t('playAgain')"
      @home="handleHome"
      @click="handlePlayAgain"
    />
  </div>
</template>
