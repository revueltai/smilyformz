<script setup lang="ts">
  import { computed, ref, onMounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'
  import { useGameStore } from '@/stores/game.store'
  import { DEFAULT_LEAGUE_LEVEL_NAME, GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { GameLeagueLevelKey } from '@/types/game'
  import LeagueItem from '@/components/app/LeagueItem.vue'

  const router = useRouter()
  const modalStore = useModalStore()
  const userStore = useUserStore()
  const gameStore = useGameStore()

  const leagueKeys = Object.keys(GAME_LEAGUE_LEVELS) as GameLeagueLevelKey[]

  const scrollContainerRef = ref<HTMLElement>()

  const currentUserLeague = computed(
    () => userStore.profile?.league_level || DEFAULT_LEAGUE_LEVEL_NAME,
  )

  const allLeagues = computed(() => {
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

  function scrollToCurrentLeague() {
    if (!scrollContainerRef.value) {
      return
    }

    const currentLeagueIndex = leagueKeys.indexOf(currentUserLeague.value)

    if (currentLeagueIndex === -1) {
      return
    }

    const container = scrollContainerRef.value
    const leagueItems = container.querySelectorAll('[data-league-item]')

    if (leagueItems.length === 0) {
      return
    }

    const firstItem = leagueItems[0] as HTMLElement
    const itemWidth = firstItem.offsetWidth + 16 // 16px gap between items
    const scrollPosition =
      currentLeagueIndex * itemWidth - container.clientWidth / 2 + itemWidth / 2

    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth',
    })
  }

  onMounted(async () => {
    await nextTick()
    scrollToCurrentLeague()
  })
</script>

<template>
  <div class="flex flex-col gap-6">
    <p class="text-center text-sm text-slate-600">
      {{ $t('selectLeagueDescription') }}
    </p>

    <div class="relative">
      <div
        ref="scrollContainerRef"
        class="flex items-center gap-4 overflow-x-auto overflow-y-visible scrollbar-hide"
      >
        <LeagueItem
          v-for="(league, index) in allLeagues"
          :key="league.id"
          :league="league"
          :show-arrow="isNextLeagueAvailable(index)"
          :is-next-available="isNextLeagueAvailable(index)"
          data-league-item
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
