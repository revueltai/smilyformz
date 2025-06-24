<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { useUserStore } from '@/stores/user.store'
  import { useGameStore } from '@/stores/game.store'
  import { GAME_LEAGUE_LEVELS } from '@/configs/constants'
  import type { GameLeagueLevelKey } from '@/types/game'
  import ModalControls from '@/components/app/ModalControls.vue'

  const router = useRouter()
  const modalStore = useModalStore()
  const userStore = useUserStore()
  const gameStore = useGameStore()

  const currentUserLeague = computed(() => userStore.profile?.league_level || 'easy')

  const availableLeagues = computed(() => {
    const leagueKeys: GameLeagueLevelKey[] = ['easy', 'medium', 'hard', 'ultimate']
    const currentIndex = leagueKeys.indexOf(currentUserLeague.value)

    return leagueKeys.slice(0, currentIndex + 1).map((leagueKey) => ({
      ...GAME_LEAGUE_LEVELS[leagueKey],
      isCurrent: leagueKey === currentUserLeague.value,
    }))
  })

  function handleLeagueSelect(leagueKey: GameLeagueLevelKey) {
    gameStore.setLeagueLevel(leagueKey)
    modalStore.closeModal()
    router.push('/game')
  }

  function handleCancel() {
    modalStore.closeModal()
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h3 class="text-lg font-semibold text-slate-900 mb-2">
        {{ $t('selectLeague') }}
      </h3>
      <p class="text-sm text-slate-600">
        {{ $t('selectLeagueDescription') }}
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="league in availableLeagues"
        :key="league.id"
        class="relative"
      >
        <button
          class="w-full p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="{
            'border-blue-500 bg-blue-50': league.isCurrent,
          }"
          @click="handleLeagueSelect(league.id)"
        >
          <div class="flex flex-col items-center gap-3">
            <img
              :src="`/images/leagues/${league.id}.svg`"
              :alt="`${$t(league.name)} league badge`"
              class="w-12 h-12"
            />

            <div class="text-center">
              <h4 class="font-semibold text-slate-900">
                {{ $t(league.name) }}
              </h4>

              <div class="text-xs text-slate-500 mt-1">
                {{ $t('rows') }}: {{ league.totalRowsLength }}
              </div>
            </div>
          </div>

          <div
            v-if="league.isCurrent"
            class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium"
          >
            {{ $t('current') }}
          </div>
        </button>
      </div>
    </div>

    <ModalControls
      :has-home-button="false"
      :cta-text="$t('cancel')"
      @click="handleCancel"
    />
  </div>
</template>
