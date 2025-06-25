<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import Page from '@/components/app/Page.vue'
  import RankingList from '@/components/app/RankingList.vue'
  import RankingCta from '@/components/app/RankingCta.vue'
  import Icon from '@/components/shared/Icon/index.vue'
  import { useRankingStore } from '@/stores/ranking.store'
  import { DEFAULT_LEAGUE_LEVEL, GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { GameLeagueLevelKey } from '@/types/game'

  const rankingStore = useRankingStore()

  const activeLeague = ref<GameLeagueLevelKey>(DEFAULT_LEAGUE_LEVEL)

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

  onMounted(() => fetchRankings(activeLeague.value))
</script>

<template>
  <Page
    back-button-to="home"
    content-classes="flex flex-col h-full"
  >
    <div class="flex flex-col gap-6 h-full">
      <header
        class="flex flex-col items-center justify-center h-36 p-4 gap-3 bg-slate-200 rounded-3xl shrink-0"
      >
        <Icon
          name="globe"
          size="2xl"
        />

        <h2 class="text-xl">{{ $t('smilyLeaguesRanking') }}</h2>
      </header>

      <div class="flex flex-col gap-4 min-h-0 flex-1">
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
