<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'
  import { useGameStore } from '@/stores/game.store'
  import { GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { GameLeagueLevelKey } from '@/types/game'
  import LeagueItem from '@/components/app/LeagueItem.vue'

  const router = useRouter()
  const modalStore = useModalStore()
  const userStore = useUserStore()
  const gameStore = useGameStore()

  const currentUserLeague = computed(() => userStore.profile?.league_level || 'easy')

  const allLeagues = computed(() => {
    const leagueKeys = Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[]

    return leagueKeys.map((leagueKey) => {
      const league = GAME_LEAGUE_LEVELS[leagueKey]
      const currentIndex = leagueKeys.indexOf(currentUserLeague.value)
      const leagueIndex = leagueKeys.indexOf(leagueKey)
      const isAvailable = leagueIndex <= currentIndex

      return {
        ...league,
        isCurrent: leagueKey === currentUserLeague.value,
        isAvailable,
        isLocked: !isAvailable,
        pointsToUnlock: isAvailable ? null : league.nextLevelPoints,
        nextLevelPoints: leagueKey === currentUserLeague.value ? league.nextLevelPoints : null,
      }
    })
  })

  function isNextLeagueAvailable(index: number) {
    return index < allLeagues.value.length - 1
  }

  function handleLeagueSelect(leagueKey: GameLeagueLevelKey) {
    const league = allLeagues.value.find((l) => l.id === leagueKey)

    if (league && league.isAvailable) {
      gameStore.setLeagueLevel(leagueKey)
      modalStore.closeModal()
      router.push('/game')
    }
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <p class="text-center text-sm text-slate-600">
      {{ $t('selectLeagueDescription') }}
    </p>

    <div class="relative">
      <div class="flex items-center gap-4 overflow-x-auto overflow-y-visible scrollbar-hide">
        <LeagueItem
          v-for="(league, index) in allLeagues"
          :key="league.id"
          :league="league"
          :show-arrow="isNextLeagueAvailable(index)"
          :is-next-available="isNextLeagueAvailable(index)"
          @select="handleLeagueSelect"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
