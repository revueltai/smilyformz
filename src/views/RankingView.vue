<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Page from '@/components/app/Page.vue'
  import RankingList from '@/components/app/RankingList.vue'
  import Icon from '@/components/shared/Icon/index.vue'
  import Button from '@/components/shared/Button/index.vue'
  import Loader from '@/components/shared/Loader/index.vue'
  import { supabase } from '@/services/Supabase.service'
  import { DEFAULT_LEAGUE_LEVEL, GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { GameLeagueLevelKey, LeagueRankingListRankItem } from '@/types/game'

  const rankingData = ref<LeagueRankingListRankItem[]>([])

  const loading = ref(false)

  const error = ref<string | null>(null)

  const activeLeague = ref<GameLeagueLevelKey>(DEFAULT_LEAGUE_LEVEL)

  async function fetchRankings(leagueLevel: GameLeagueLevelKey) {
    loading.value = true
    error.value = null

    try {
      const data = await supabase.getLeagueRankings(leagueLevel)
      rankingData.value = data.map((item) => ({
        ...item,
        league: item.league as GameLeagueLevelKey,
      }))
    } catch (err) {
      console.error('Failed to fetch rankings:', err)
      error.value = 'failedToLoadRankings'
      rankingData.value = []
    } finally {
      loading.value = false
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
        <Loader
          v-if="loading"
          size="lg"
          class="flex items-center justify-center py-8"
        />

        <div
          v-else-if="error"
          class="flex flex-col items-center justify-center py-8 gap-4"
        >
          <p class="text-red-500 text-center">{{ $t(error) }}</p>

          <Button
            size="sm"
            @click="fetchRankings(activeLeague)"
          >
            {{ $t('retry') }}
          </Button>
        </div>

        <RankingList
          v-else
          :list="rankingData"
          @tab-change="handleTabChange"
        />

        <div
          v-if="!error"
          class="flex flex-col items-center gap-3 mt-2 shrink-0"
        >
          <p class="text-center text-xs text-slate-400">
            {{ $t('globalRankingTeaser1') }}<br />
            {{ $t('globalRankingTeaser2') }}
          </p>

          <Button
            size="xs"
            to="game"
            border-color="lime-600"
            border-color-hover="lime-400"
            background-color="lime-100"
            background-color-hover="lime-200"
            text-color="lime-800"
          >
            <Icon
              name="play"
              size="sm"
              color="lime-800"
            />

            {{ $t('playNow') }}
          </Button>
        </div>
      </div>
    </div>
  </Page>
</template>
