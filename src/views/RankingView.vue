<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import Page from '@/components/app/Page.vue'
  import RankingList from '@/components/app/RankingList.vue'
  import RankingCta from '@/components/app/RankingCta.vue'
  import Icon from '@/components/shared/Icon/index.vue'
  import Tile from '@/components/app/tile/Tile.vue'
  import { useRankingStore } from '@/stores/ranking.store'
  import { DEFAULT_LEAGUE_LEVEL_NAME, GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { GameLeagueLevelKey } from '@/types/game'

  const rankingStore = useRankingStore()

  const activeLeague = ref<GameLeagueLevelKey>(DEFAULT_LEAGUE_LEVEL_NAME)

  const rankingData = computed(() => rankingStore.getRankings(activeLeague.value))
  const loading = computed(() => rankingStore.isLoading(activeLeague.value))
  const error = computed(() => rankingStore.hasError(activeLeague.value))

  async function fetchRankings(leagueLevel: GameLeagueLevelKey) {
    try {
      await rankingStore.fetchRankings(leagueLevel)
    } catch (err) {
      console.error('Failed to fetch rankings:', err)
    }
  }

  function handleTabChange(index: number) {
    const leagueKeys = Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[]
    const newLeague = leagueKeys[index]

    if (newLeague && newLeague !== activeLeague.value) {
      activeLeague.value = newLeague
      fetchRankings(newLeague)
    }
  }

  function handleRetry() {
    rankingStore.refreshRankings(activeLeague.value)
  }

  onMounted(() => {
    fetchRankings(activeLeague.value)
    rankingStore.initializeRankingStore()
  })

  onUnmounted(() => rankingStore.cleanupRankingStore())
</script>

<template>
  <Page
    :floating-tiles="true"
    back-button-to="home"
    content-classes="flex flex-col h-full"
  >
    <div class="flex flex-col gap-6 h-full">
      <header
        class="relative flex flex-col items-center justify-center h-36 shrink-0 rounded-2xl bg-no-repeat bg-sky-100 border border-sky-200"
      >
        <div class="absolute inset-0">
          <div class="relative w-full h-full">
            <div class="absolute -top-2 -right-2 rotate-12">
              <Tile
                id="ht1"
                shape="circle"
                size="md"
                expression="exp1"
              />
            </div>

            <div class="absolute -bottom-2 -left-2 -rotate-12">
              <Tile
                id="ht3"
                shape="star"
                size="md"
                expression="exp3"
                shape-color="#f59e0b"
              />
            </div>

            <div class="absolute -bottom-5 -right-5">
              <Tile
                id="ht4"
                shape="rhomb"
                size="lg"
                expression="exp4"
                shape-color="#ef4444"
              />
            </div>

            <div class="absolute -top-6 left-0 -rotate-12">
              <Tile
                id="ht5"
                shape="triangle"
                size="lg"
                expression="exp1"
              />
            </div>
          </div>
        </div>

        <h2
          class="uppercase text-center leading-6 text-shadow-xs text-shadow-white text-xl font-bold text-sky-900 relative z-20"
        >
          {{ $t('smilyLeaguesRanking1') }}<br />
          {{ $t('smilyLeaguesRanking2') }}
        </h2>
      </header>

      <div class="flex flex-col gap-2 min-h-0 flex-1">
        <div class="flex-1 min-h-0">
          <RankingList
            :list="rankingData"
            :loading="loading"
            :error="error"
            @change="handleTabChange"
            @retry="handleRetry"
          />
        </div>

        <RankingCta v-if="!error" />
      </div>
    </div>
  </Page>
</template>

<style scoped>
  header {
    background-image:
      url('/images/leagues/uiSparklesTL.svg'), url('/images/leagues/uiSparklesTR.svg'),
      url('/images/leagues/uiSparklesBL.svg'), url('/images/leagues/uiSparklesBR.svg'),
      url('/images/leagues/uiSparklesC.svg'), url('/images/leagues/uiHeaderSun.svg');
    background-position:
      top left,
      top right,
      bottom left,
      bottom right,
      center,
      center;
    background-size: auto, auto, auto, auto, 30%, cover;
  }
</style>
