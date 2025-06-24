<script setup lang="ts">
  import { computed } from 'vue'
  import { GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import { useUserStore } from '@/stores/user.store'
  import type { GameLeagueLevelKey } from '@/types/game'

  const userStore = useUserStore()

  const currentLeague = computed(() => {
    const leagueLevel = userStore.profile?.league_level || 'easy'
    return GAME_LEAGUE_LEVELS[leagueLevel]
  })

  const nextLeagueInfo = computed(() => {
    const leagueLevel = userStore.profile?.league_level || 'easy'
    const leagueKeys: GameLeagueLevelKey[] = Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[]
    const currentIndex = leagueKeys.indexOf(leagueLevel)

    if (currentIndex === leagueKeys.length - 1) {
      return null
    }

    const nextLeagueKey = leagueKeys[currentIndex + 1]
    const nextLeague = GAME_LEAGUE_LEVELS[nextLeagueKey]
    const currentLeague = GAME_LEAGUE_LEVELS[leagueLevel]

    return {
      name: nextLeague.name,
      requiredPoints: currentLeague.nextLevelPoints,
    }
  })
</script>

<template>
  <div class="flex flex-col items-center gap-2 bg-sky-200 rounded-xl pt-3 pb-1.5 px-1.5 shadow-xs">
    <h2 class="text-xs uppercase text-blue-950">
      {{ $t('yourLeague') }}
    </h2>

    <div
      class="flex w-full justify-center items-center gap-3 rounded-md bg-white text-slate-900 py-3.5 px-4 h"
    >
      <img
        :src="`/images/leagues/${currentLeague.id}.svg`"
        alt="League badge"
        class="w-10 h-10"
      />

      <p class="text-base font-bold text-blue-950">{{ $t(currentLeague.name) }}</p>
    </div>
  </div>
</template>
